<template>
	<div class="text-center">
		<v-dialog
			v-model="state"
			width="300"
		>
			<div>
				<v-color-picker
					v-model="color"
					class="mx-auto"
					canvas-height="200"
				></v-color-picker>
			</div>
		</v-dialog>
	</div>
</template>

<script>
export default {
	name: 'ColorDialog',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: 'white',
		}
	},
	data() {
		return {
			state: this.show,
			color: this.value,
		}
	},
	watch: {
		show(newValue) {
			this.state = newValue;
		},
		color(newValue) {
			console.log(newValue)
			this.$emit('input', newValue);
		},
		value(newValue) {
			this.color = newValue;
		},
		state(newValue) {
			this.$emit('update:show', newValue);
		}
	},
}
</script>

<style lang="scss" scoped>

</style>