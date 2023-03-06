<template>
    <main class="app-body">
		<div id="canvas-container"></div>
		<v-overlay :value="loading">
			<v-progress-circular
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>
    </main>
</template>

<script>
import {
	guid,
	drawShapesCallbacks,
	createShapesCallbacks,
	SPACE_HEX,
} from '@/utils';
import {
	AppLoading,
	KonvasMixins
} from '@/mixins';

export default {
    name: 'CanvasField',
	mixins: [AppLoading, KonvasMixins],
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
			shortcuts: {
				keydown: [
					{ key: 'ctrl+z', callback: () => this.invoker({key: 'undo'})},
					{ key: 'ctrl+y', callback: () => this.invoker({key: 'redo'})},
					{ key: 'ctrl+s', callback: () => this.invoker({key: 'download'})},
					{ key: 'ctrl+v', callback: (e) => this.invoker({key: 'paste'}, e)},
					{ key: SPACE_HEX, callback: this.dragOn},
				],
				keyup: [
					{ key: SPACE_HEX, callback: this.dragOff},
				]
			},
		}
	},
	mounted() {
		this.init();
		this.listenShorcuts();
	},
	watch: {
		'palette.background': {
			handler() {
				this.setBackground();
			}
		},
	},
	methods: {
		getContainer() {
			return document.querySelector('#canvas-container');
		},
		listenShorcuts() {
			for (let [event, actions] of Object.entries(this.shortcuts)) {
				this.listener.on(event).action(actions);
			}
		},
		start({ evt: e }) { // { evt: e, target, currentTarget, pointerId, type }
			if (this.dragging) return;

			e.preventDefault();

			const name = this.nameResolver(this.tool.key);

			this.drawing = true;
			this.points.start = this.stage.getPointerPosition();
			this.changeMouse('pointer');

			this.run(createShapesCallbacks[name.key], { e, args: name.args });
		},
		draw({ evt: e }) {
			const name = this.nameResolver(this.tool.key);

			e.preventDefault();

			this.points.mouse = this.stage.getPointerPosition();
			if (this.drawing) {
				this.run(drawShapesCallbacks[name.key], { e, args: name.args });
			}
		},
		stop({ evt: e }) {
			e.preventDefault();
			this.drawing = false;
			this.changeMouse('default');
		},
		invoker(command, e = undefined) {
			const name = this.nameResolver(command.key);
			const commands = {
				undo() {
					
				},
				redo() {

				},
				clean() {
					
				},
				paste(e) {
					console.log(e);
					const pasteImage = async () => {
					}
					pasteImage().then(() => console.log('paste'));
				},
				download() {

					// <template #children_save>
					// 	<div class="w-100">
					// 		<form @submit.prevent="download">
					// 			<v-text-field
					// 				v-model="file.name"
					// 				:label="labels.file_name"
					// 				required
					// 			></v-text-field>
					// 			<v-select
					// 				v-model="file.format"
					// 				:items="formatsForDownload"
					// 				:label="labels.file_format"
					// 				item-text="label"
					// 				item-value="key"
					// 				return-object
					// 				required
					// 			></v-select>
					// 			<v-btn
					// 				type="submit"
					// 				class="mr-4"
					// 			>
					// 				submit
					// 			</v-btn>
					// 			<v-btn @click="clearFileConfig">
					// 				clear
					// 			</v-btn>
					// 		</form> 
					// 	</div>
					// </template>

					// const { name, format } = JSON.parse(args);
					// const tmp = document.createElement('canvas');
					// const tmpCtx = tmp.getContext('2d');
					// const tmpImage = new Image();
					// const tmpUrl = this.canvas.buffer.toDataURL('image/' + format.label + '', 1.0)
					// 	.replace('image/' + format.label + '', 'image/octet-stream');

					// tmp.width = this.canvas.buffer.width;
					// tmp.height = this.canvas.buffer.height;

					// tmpCtx.clearRect(0, 0, this.dimensions.w, this.dimensions.h);
					// tmpCtx.globalCompositeOperation = 'destination-out';
					// tmpCtx.strokeStyle = this.palette.background;
					// tmpCtx.fillStyle = this.palette.background;
					// tmpCtx.lineWidth = this.palette.weight;
					// tmpCtx.beginPath();

					// tmpCtx.rect(0, 0, this.dimensions.w, this.dimensions.h);
					// tmpCtx.fill();

					// tmpImage.src = tmpUrl
					// tmpImage.onload = () => {
					// 	tmpCtx.drawImage(tmpImage, 0, 0);

					// 	this.image = {
					// 		name: name + '.' + format.extension,
					// 		url: tmp.toDataURL('image/' + format.label + '', 1.0)
					// 			.replace('image/' + format.label + '', 'image/octet-stream'),
					// 	};

					// 	const link = document.createElement('a');

					// 	link.download = this.image.name;
					// 	link.href = this.image.url;

					// 	link.click();
					// }
				},
			}
			this.run(commands[name.key], { e, args: name.args });
		},
	},
}
</script>

<style lang="scss" scoped>
@import "./styles";
</style>