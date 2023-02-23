<template>
	<v-app>
		<topbar></topbar>
		<div>
			<sidebar></sidebar>
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
		//
	}),
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
