<template>
    <main class="app-body">
        <canvas></canvas>
    </main>
</template>

<script>
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
			elements: [],
		}
	},
	methods: {
		invoker(command) {
			console.log(command);
		}
	},
}
</script>

<style lang="scss">
main.app-body {
	width: 100%;
	height: 100%;
	margin-left: 210px;
	background-color: blue;

	canvas {
		width: 100%;
		height: 100%;
	}
}
</style>