<template>
	<div class="text-center">
		<v-dialog
			v-model="state"
			width="300"
		>
			<v-card class="weight-container pa-5">
				<h3>{{ labels.title }}</h3>
				<div
					v-for="(weight, index) in weights"
					:key="index"
					class="d-flex"
					@click="setEspessura(weight)"
				>
					<div class="weight-label">{{ weight }}px</div>
					<div
						class="weight-bar"
						:style="'height:' + weight + 'px'"
					></div>
				</div>

				<div>
					<h3>{{ labels.label }}</h3>
					<input type="number" v-model="weight" class="weight-input">
				</div>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { pt_br } from '@/langs';

const lang = pt_br;
export default {
	name: 'WeightDialog',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		value: {
			type: Number,
			default: 2,
		}
	},
	data() {
		return {
			labels: lang.weight_dialog,
			state: this.show,
			weight: this.value,
			weights: [2, 4, 6, 8, 10, 12, 16],
		}
	},
	watch: {
		show(newValue) {
			this.state = newValue;
		},
		weight(newValue) {
			console.log(newValue)
			this.$emit('input', newValue);
		},
		value(newValue) {
			this.weight = newValue;
		},
		state(newValue) {
			this.$emit('update:show', newValue);
		}
	},
	methods: {
		setEspessura(value) {
			this.weight = value;
		}
	},
}
</script>

<style lang="scss" scoped>
.weight-container {
	line-height: 2;
}
.weight-label {
	width: 50px;
}
.weight-bar {
	width: calc(100% - 30px);
	background-color: black;
	margin-top: 10px;
	margin-bottom: 10
}
.weight-input {
	border: 2px solid black;
	border-radius: 10px;
	padding: 5px 10px;
	margin: 0 auto;
	width: 100%;
}
</style>