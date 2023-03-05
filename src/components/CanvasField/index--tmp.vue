<template>
    <main class="app-body">
		<div class="canvas-container">
			<canvas v-bind="canvasProps.buffer" v-show="showBuffer"></canvas>
			<canvas v-bind="canvasProps.uilayer"></canvas>
			<canvas v-bind="canvasProps.background"></canvas>
		</div>
		<keyboard-listener :actions="shortcuts" />
    </main>
</template>

<script>
import { guid, drawCallbacks } from '@/utils';
import last from 'lodash/last';
import KeyboardListener from '@/components/KeyboardListener';

const SIDEBAR_SIZE = 240;
const TOPBAR_SIZE = 36;
export default {
    name: 'CanvasField',
	components: {
		KeyboardListener,
	},
	props: {
		tool: {
			type: Object,
		},
		palette: {
			type: Object,
		},
		zoom: {
			type: Object,
		},
		font: {
			type: Object,
		},
	},
	data() {
		return {
			uuid: 'canvas-' + guid(),
			elements: [],
			deleteds: [],
			dimensions: {
				w: window.innerWidth - SIDEBAR_SIZE,
				h: window.innerHeight - TOPBAR_SIZE,
			},
			isDrawing: false,
			showBuffer: false,
			canvas: {
				buffer: undefined,
				uilayer: undefined,
				background: undefined,
			},
			context: {
				buffer: undefined,
				uilayer: undefined,
				background: undefined,
			},
			points: {
				start: {},
				end: {},
			},
			shortcuts: [
				{ key: 'z', callback: () => this.invoker({key: 'undo'})},
				{ key: 'y', callback: () => this.invoker({key: 'redo'})},
				{ key: 's', callback: () => this.invoker({key: 'download'})},
				{ key: 'v', callback: (e) => this.invoker({key: 'paste'}, e)},
			],
			image: { url: '', name: '' },
		}
	},
	computed: {
		canvasProps() {
			return {
				background: {
					[this.uuid + '-background']: '',
					class: 'background--canvas',
					width: this.dimensions.w,
					height: this.dimensions.h,
				},
				uilayer:{
					[this.uuid + '-uilayer']: '',
					class: 'uilayer--canvas',
					width: this.dimensions.w,
					height: this.dimensions.h,
				},
				buffer:{
					[this.uuid + '-buffer']: '',
					class: 'buffer--canvas',
					width: this.dimensions.w,
					height: this.dimensions.h,
				}
			}
		}
	},
	created() {
		window.addEventListener('resize', this.onResize);
	},
	mounted() {
		this.init();
	},
	watch: {
		'palette.background': {
			handler(newValue) {
				this.canvas.uilayer.style.background = newValue || '#ffffff';
				this.context.background.clearRect(0, 0, this.dimensions.w, this.dimensions.h);
				this.context.background.globalCompositeOperation = 'source-over';
				this.context.background.strokeStyle = newValue;
				this.context.background.fillStyle = newValue;
				this.context.background.lineWidth = this.palette.weight;
				this.context.background.beginPath();

				this.context.background.rect(0, 0, this.dimensions.w, this.dimensions.h);
				this.context.background.fill();
			}
		}
	},
	methods: {
		init() {	
			this.canvas.buffer = this.getCanvas('buffer');	
			this.canvas.uilayer = this.getCanvas('uilayer');	
			this.canvas.background = this.getCanvas('background');	

			this.initContext();
			this.addEventListeners();
		},
		getCanvas(name) {
			return document.querySelector(`canvas[${this.uuid}-${name}]`);
		},
		initContext() {
			this.context.buffer = this.canvas.buffer.getContext('2d', { willReadFrequently: true });	
			this.context.buffer.lineCap = 'round';
			this.context.buffer.lineJoin = 'round';
			this.context.buffer.globalAlpha = .5;

			this.context.uilayer = this.canvas.uilayer.getContext('2d', { willReadFrequently: true });	
			this.context.uilayer.lineCap = 'round';
			this.context.uilayer.lineJoin = 'round';
			this.context.uilayer.globalAlpha = .5;

			this.context.background = this.canvas.background.getContext('2d', { willReadFrequently: true });	
			this.context.background.lineCap = 'round';
			this.context.background.lineJoin = 'round';
		},
		addEventListeners() {
			this.canvas.uilayer.addEventListener('touchstart', this.start, false);
			this.canvas.uilayer.addEventListener('mousedown', this.start, false);
			this.canvas.uilayer.addEventListener('pointerdown', this.start, false);

			this.canvas.buffer.addEventListener('touchmove', this.draw, false);
			this.canvas.buffer.addEventListener('mousemove', this.draw, false);
			this.canvas.buffer.addEventListener('pointermove', this.draw, false);

			this.canvas.buffer.addEventListener('touchend', this.stop, false);
			this.canvas.buffer.addEventListener('mouseup', this.stop, false);
			this.canvas.buffer.addEventListener('mouseout', this.stop, false);
			this.canvas.buffer.addEventListener('pointerup', this.stop, false);
			this.canvas.buffer.addEventListener('pointercancel', this.stop, false);
		},
		start(e) {
			this.isDrawing = true;
			this.showBuffer = true;

			console.log('start');

			this.context.buffer.beginPath();
			this.points.start = {
				x: e.clientX - this.canvas.buffer.offsetLeft,
				y: e.clientY - this.canvas.buffer.offsetTop,
			}
			// this.context.buffer.moveTo(this.points.start.x, this.points.start.y);
			this.elements.push(this.context.buffer.getImageData(0, 0, this.dimensions.w, this.dimensions.h));

			e.preventDefault();
		},
		nameResolver(key) {
			const parts = key.split('-');
			const path = {
				key: parts.shift(),
				args: parts,
			}
			return path;
		},
		draw(e) {
			const name = this.nameResolver(this.tool.key);

			console.log('draw');

			if (this.isDrawing) {
				this.run(drawCallbacks[name.key], { e, args: name.args });
			}
		},
		stop(e) {
			if (this.isDrawing) {
				this.context.buffer.stroke();
				this.context.buffer.closePath();

				this.isDrawing = false;
				this.showBuffer = false;
				
				this.context.uilayer.drawImage(this.canvas.buffer, 0, 0);
				// this.invoker({key: 'clean'})
			}
			e.preventDefault();

			if (e.type != 'mouseout') {
				this.elements.push(this.context.buffer.getImageData(0, 0, this.dimensions.w, this.dimensions.h));
			}
		},
		run(callback, { e, args = [] }) {
			if (typeof callback !== 'function') return;
			return callback.call(this, e, ...args);
		},
		invoker(command, e = undefined) {
			const name = this.nameResolver(command.key);
			const commands = {
				undo() {
					if (this.elements.length <= 1) {
						this.run(commands.clean());
					} else {
						this.deleteds.push(this.elements.pop());
						this.context.buffer.putImageData(last(this.elements), 0, 0);
					}
				},
				redo() {
					if (this.deleteds.length > 0) {
						this.elements.push(this.deleteds.pop());
						this.context.buffer.putImageData(last(this.elements), 0, 0);
					}
				},
				clean() {
					this.context.buffer.fillStyle = this.palette.background;
					this.context.buffer.clearRect(0, 0, this.dimensions.w, this.dimensions.h);
					this.context.buffer.fillRect(0, 0, this.dimensions.w, this.dimensions.h);

					this.elements = [];
				},
				paste(e) {
					console.log(e);
					const pasteImage = async () => {
						try {
							const destinationImage = new Image();
							const permission = await navigator.permissions.query({
								name: "clipboard-read",
							});
							if (permission.state === "denied") {
								throw new Error("Not allowed to read clipboard.");
							}
							const clipboardContents = await navigator.clipboard.read();
							for (const item of clipboardContents) {
								if (!item.types.includes("image/png")) {
									throw new Error("Clipboard contains non-image data.");
								}
								const blob = await item.getType("image/png");
								destinationImage.src = URL.createObjectURL(blob);
								destinationImage.onload = () => {
									this.context.drawImage(destinationImage, 100, 100);
								}

							}
						} catch (error) {
							console.error(error.message);
						}
					}
					pasteImage().then(() => console.log('paste'));
				},
				download(_, args) {
					const { name, format } = JSON.parse(args);
					const tmp = document.createElement('canvas');
					const tmpCtx = tmp.getContext('2d');
					const tmpImage = new Image();
					const tmpUrl = this.canvas.buffer.toDataURL('image/' + format.label + '', 1.0)
						.replace('image/' + format.label + '', 'image/octet-stream');

					tmp.width = this.canvas.buffer.width;
					tmp.height = this.canvas.buffer.height;

					tmpCtx.clearRect(0, 0, this.dimensions.w, this.dimensions.h);
					tmpCtx.globalCompositeOperation = 'destination-out';
					tmpCtx.strokeStyle = this.palette.background;
					tmpCtx.fillStyle = this.palette.background;
					tmpCtx.lineWidth = this.palette.weight;
					tmpCtx.beginPath();

					tmpCtx.rect(0, 0, this.dimensions.w, this.dimensions.h);
					tmpCtx.fill();

					tmpImage.src = tmpUrl
					tmpImage.onload = () => {
						tmpCtx.drawImage(tmpImage, 0, 0);

						this.image = {
							name: name + '.' + format.extension,
							url: tmp.toDataURL('image/' + format.label + '', 1.0)
								.replace('image/' + format.label + '', 'image/octet-stream'),
						};

						const link = document.createElement('a');

						link.download = this.image.name;
						link.href = this.image.url;

						link.click();
					}
				},
			}
			this.run(commands[name.key], { e, args: name.args });
		},
		onResize() {
			this.dimensions = {
				w: window.innerWidth - SIDEBAR_SIZE,
				h: window.innerHeight - TOPBAR_SIZE,
			}
		}
	},
}
</script>

<style lang="scss" scoped>
@import "./styles";
</style>