<template>
    <main class="app-body">
        <canvas></canvas>
    </main>
</template>

<script>
export default {
    name: 'CanvasField',
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