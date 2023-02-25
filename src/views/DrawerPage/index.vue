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
			<canvas-field></canvas-field>
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

	data: () => ({
		
	}),

	methods: {
		formatText(format) {
			console.log(format);
		},
		runCommand(command) {
			console.log('run-command', command);
		},
		selectTool(tool) {
			console.log(tool);
		},
		configPalette(palette) {
			console.log(palette);
		},
		setZoom(zoom) {
			console.log(zoom);
		},
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
