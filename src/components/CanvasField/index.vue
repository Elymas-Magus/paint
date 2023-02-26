<template>
    <main class="app-body">
		<canvas v-bind="canvasProps"></canvas>
    </main>
</template>

<script>
import { guid } from '@/utils';
import last from 'lodash/last';
import min from 'lodash/min';
const SIDEBAR_SIZE = 240;
const TOPBAR_SIZE = 36;
export default {
    name: 'CanvasField',
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
			} 
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
				this.context.fillStyle = newValue || '#f0f0f5';
				this.context.fillRect(0, 0, this.dimensions.w, this.dimensions.h);
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
				tool: parts.shift(),
				args: parts,
			}
			return path;
		},
		draw(e) {
			const name = this.nameResolver(this.tool.key);
			const drawCallbacks = {
				pencil() {
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;

					this.context.stroke();
				},
				brush() {
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;

					this.context.stroke();
				},
				eraser() {
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.globalCompositeOperation = 'destination-out';
					this.context.strokeStyle = this.palette.background;
					this.context.lineWidth = this.palette.weight;

					this.context.stroke();
				},
				slash() {
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();
					
					this.context.moveTo(this.points.start.x, this.points.start.y);
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.stroke();

				},
				square(mode = '') {
					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();

					this.context.rect(
						this.points.start.x,
						this.points.start.y,
						min([e.clientX - this.points.start.x - this.canvas.offsetLeft, this.canvas.width - this.points.start.x]),
						min([e.clientY - this.points.start.y - this.canvas.offsetTop, this.canvas.height - this.points.start.y]),
					);

					if (mode == 'outline') {
						this.context.stroke();
					} else {
						this.context.fillStyle = this.palette.foreground;
						this.context.fill();
					}
				},
				triangle(mode = '') {
					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();

					this.context.moveTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, this.points.start.y);
					this.context.lineTo(this.points.start.x, e.clientY - this.canvas.offsetTop);
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.closePath();

					if (mode == 'outline') {
						this.context.stroke();
					} else {
						this.context.fillStyle = this.palette.foreground;
						this.context.fill();
					}
				},
				circle(mode = '') {
					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();

					this.context.arc(this.points.start.x, this.points.start.y, Math.abs(e.clientX - this.points.start.x - this.canvas.offsetLeft), 0, 2 * Math.PI, false);

					if (mode == 'outline') {
						this.context.stroke();
					} else {
						this.context.fillStyle = this.palette.foreground;
						this.context.fill();
					}
				},
				rhombus(mode = '') {
					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();

					this.context.moveTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, this.points.start.y);
					this.context.lineTo(this.points.start.x, e.clientY - this.canvas.offsetTop);
					this.context.lineTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, 2 * (e.clientY - this.canvas.offsetTop) - this.points.start.y);
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

					this.context.closePath();
					if (mode == 'outline') {
						this.context.stroke();
					} else {
						this.context.fillStyle = this.palette.foreground;
						this.context.fill();
					}
				},
				trapezoid(mode = '') {
					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();

					this.context.moveTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, this.points.start.y);
					this.context.lineTo(this.points.start.x, (e.clientY - this.canvas.offsetTop / 2));
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, (e.clientY - this.canvas.offsetTop / 2));
					this.context.lineTo(e.clientX - this.canvas.offsetLeft, this.points.start.y);

					this.context.closePath();
					if (mode == 'outline') {
						this.context.stroke();
					} else {
						this.context.fillStyle = this.palette.foreground;
						this.context.fill();
					}
				},
				star() {
					this.context.putImageData(last(this.elements), 0, 0);
					this.context.globalCompositeOperation = 'source-over';
					this.context.strokeStyle = this.palette.foreground;
					this.context.lineWidth = this.palette.weight;
					this.context.beginPath();

					this.context.moveTo(108, 0.0);
					this.context.lineTo(141, 70);
					this.context.lineTo(218, 78.3);
					this.context.lineTo(162, 131);
					this.context.lineTo(175, 205);
					this.context.lineTo(108, 170);
					this.context.lineTo(41.2, 205);
					this.context.lineTo(55, 131);
					this.context.lineTo(1, 78);
					this.context.lineTo(75, 68);
					this.context.lineTo(108, 0);

					this.context.closePath();
					this.context.stroke();
				},
			}

			if (this.isDrawing) {
				this.run(drawCallbacks[name.tool], name.args);
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
		run(callback, args = []) {
			if (typeof callback !== 'function') return;
			return callback.call(this, ...args);
		},
		invoker(command) {
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
						this.context.putImageData(last(this.deleteds), 0, 0);
					}
				},
				clean() {
					console.log(this.palette.background)
					this.context.fillStyle = this.palette.background;
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

					this.elements = [];
				}
			}
			this.run(commands[command.key]);
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