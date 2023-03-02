<template>
    <main class="app-body">
		<canvas v-bind="canvasProps"></canvas>
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
			canvas: undefined,
			context: undefined,
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
				[this.uuid]: '',
				width: this.dimensions.w,
				height: this.dimensions.h,
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
				this.canvas.style.background = newValue || '#ffffff';
				// this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				// this.context.globalCompositeOperation = 'destination-over';
				// this.context.strokeStyle = newValue;
				// this.context.fillStyle = newValue;
				// this.context.lineWidth = this.palette.weight;
				// this.context.beginPath();

				// this.context.rect(0, 0, this.canvas.width, this.canvas.height);
				// this.context.fill();
			}
		}
	},
	methods: {
		init() {	
			this.canvas = this.getCanvas();	
			this.initContext();
			this.addEventListeners();
		},
		getCanvas() {
			return document.querySelector(`canvas[${this.uuid}]`);
		},
		initContext() {
			this.context = this.canvas.getContext('2d', { willReadFrequently: true });	
			this.context.lineCap = 'round';
			this.context.lineJoin = 'round';
		},
		addEventListeners() {
			this.canvas.addEventListener('touchstart', this.start, false);
			this.canvas.addEventListener('mousedown', this.start, false);
			this.canvas.addEventListener('pointerdown', this.start, false);

			this.canvas.addEventListener('touchmove', this.draw, false);
			this.canvas.addEventListener('mousemove', this.draw, false);
			this.canvas.addEventListener('pointermove', this.draw, false);

			this.canvas.addEventListener('touchend', this.stop, false);
			this.canvas.addEventListener('mouseup', this.stop, false);
			this.canvas.addEventListener('mouseout', this.stop, false);
			this.canvas.addEventListener('pointerup', this.stop, false);
			this.canvas.addEventListener('pointercancel', this.stop, false);
		},
		start(e) {
			this.isDrawing = true;

			this.context.beginPath();
			this.points.start = {
				x: e.clientX - this.canvas.offsetLeft,
				y: e.clientY - this.canvas.offsetTop,
			}
			this.context.moveTo(this.points.start.x, this.points.start.y);
			this.elements.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));

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

			if (this.isDrawing) {
				this.run(drawCallbacks[name.key], { e, args: name.args });
			}
		},
		stop(e) {
			if (this.isDrawing) {
				this.context.stroke();
				this.context.closePath();
				this.isDrawing = false;
			}
			e.preventDefault();

			if (e.type != 'mouseout') {
				this.elements.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
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
						this.context.putImageData(last(this.elements), 0, 0);
					}
				},
				redo() {
					if (this.deleteds.length > 0) {
						this.elements.push(this.deleteds.pop());
						this.context.putImageData(last(this.elements), 0, 0);
					}
				},
				clean() {
					this.context.fillStyle = this.palette.background;
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
					const tmpUrl = this.canvas.toDataURL('image/' + format.label + '', 1.0)
						.replace('image/' + format.label + '', 'image/octet-stream');

					tmp.width = this.canvas.width;
					tmp.height = this.canvas.height;

					tmpCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					tmpCtx.globalCompositeOperation = 'destination-out';
					tmpCtx.strokeStyle = this.palette.background;
					tmpCtx.fillStyle = this.palette.background;
					tmpCtx.lineWidth = this.palette.weight;
					tmpCtx.beginPath();

					tmpCtx.rect(0, 0, this.canvas.width, this.canvas.height);
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