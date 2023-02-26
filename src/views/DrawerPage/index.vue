<template>
	<v-app>
		<topbar
			@text-format="formatText"
			@run-command="runCommand"
		></topbar>
		<div>
			<sidebar
				@select="selectTool"
				@configure="configPalette"
				@zoom="setZoom"
			></sidebar>
			<canvas-field
				ref="canvas"
				:tool="tool"
				:zoom="zoom"
				:font="font"
				:palette="palette"
			></canvas-field>
		</div>
	</v-app>
</template>

<script>
import {
	Sidebar,
	Topbar,
	CanvasField,
	// PaintingBox
} from '@/components';

export default {
	name: 'DrawerPage',

	components: {
		Sidebar,
		Topbar,
		CanvasField,
		// PaintingBox
	},

	data() {
		return {
			tool: {},
			font: {
				align: {key: 'align-left', icon: 'mdi-format-align-left'},
				format: [],
				size: 12,
				ident: 0,
				lists: undefined,
				decoration: undefined,
			},
			zoom: {
				value: 100,
				min: 0,
				max: 200,
				color: 'blue darken-3',
				thumbColor: '#000066',
			},
			palette: {
				weight: 2,
				foreground: '#000000FF',
				background: '#FFFFFFFF',
			},
		}	
	},

	methods: {
		formatText(format) {
			console.log(format);
			this.font = format;
		},
		selectTool(tool) {
			console.log(tool);
			this.tool = tool;
		},
		configPalette(palette) {
			this.palette = palette;
			console.log(palette);
		},
		setZoom(zoom) {
			console.log(zoom);
			this.zoom = zoom;
		},
		runCommand(command) {
			console.log(command);
			this.$refs.canvas.invoker(command);
		}
	},
};
</script>

<style lang="scss">
@import "./styles";
</style>
