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
			palette: {},
			zoom: {},
			font: {},
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
main.app-body {
	width: 100%;
	height: 100%;
	margin-left: 210px;
	/* margin-top:  */
	background-color: blue;

	canvas {
		width: 100%;
		height: 100%;
	}
}
</style>
