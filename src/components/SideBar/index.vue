<template>
	<div>
		<div class="sidebar">
			<div class="d-flex flex-column align-end sidebar-container">
				<div class="w-100">
					<h3>
						<v-icon class="sidebar-icon">
							mdi-tools
						</v-icon>
						{{ labels.tools }}
					</h3>
					<div class="w-100">
						<table class="tools">
							<tr v-for="(tools, group) in tools.itemsGroup" :key="group">
								<td v-for="(tool, index) in tools" :key="tool.key">
									<v-btn
										class="tool-item"
										:class="{'active': tool.selected}"
										@click="select(['itemsGroup', group, index])"
									>
										<v-icon>{{ tool.icon }}</v-icon>
									</v-btn>
								</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="mt-5 w-100">
					<h3>
						<v-icon class="sidebar-icon">
							mdi-palette-swatch-variant
						</v-icon>
						{{ labels.configs }}
					</h3>
					<div class="w-100">
						<table class="tools">
							<tr v-for="(tools, group) in tools.weightsGroup" :key="group">
								<td v-for="(tool) in tools" :key="tool.key">
									<v-btn
										class="tool-item"
										:class="{'active': tool.selected}"
										@click="config(tool.key)"
									>
										<v-icon>{{ tool.icon }}</v-icon>
									</v-btn>
								</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="mt-5 w-100" v-if="selectedTool">
					<h3>
						<v-icon class="sidebar-icon">
							mdi-select-all
						</v-icon>
						{{ labels.selected }}
					</h3>
					<div class="w-100">
						<v-icon
							x-large
							class="sidebar-icon ml-5"
							style="width: 50px"
							@click="changeColors"
						>
							{{ selectedTool.icon }}
						</v-icon>
					</div>
				</div>
				<div class="mt-5 w-100" v-if="labels.colors">
					<h3>
						<v-icon class="sidebar-icon">
							mdi-format-line-weight
						</v-icon>
						{{ labels.weight }}
					</h3>
					<div class="weight-info text-center">
						{{ configs.weight }}px (pixels)
					</div>
					<div class="d-flex flex-start">
						<div class="current-weight" :style="'height: ' + configs.weight + 'px'"></div>
					</div>
				</div>
				<div class="mt-5 w-100" v-if="labels.colors">
					<h3>
						<v-icon class="sidebar-icon">
							mdi-palette
						</v-icon>
						{{ labels.colors }}
					</h3>
					<div class="d-flex flex-start">
						<div class="selected-colors-container">
							<div
								class="selected-colors background-color"
								:style="'background-color:' + configs.background"
								@click="config('background')"
							></div>
							<div
								class="selected-colors foreground-color"
								:style="'background-color:' + configs.foreground"
								@click="config('foreground')"
							></div>
						</div>
						<v-icon
							x-large
							class="sidebar-icon ml-5"
							style="width: 50px"
							@click="changeColors"
						>
							mdi-swap-vertical
						</v-icon>
					</div>
				</div>
				<div class="mt-auto w-100">
					<div>
						{{ labels.zoom }}
						<v-slider
							v-model="zoom.value"
							append-icon="mdi-magnify-plus-outline"
							prepend-icon="mdi-magnify-minus-outline"
							thumb-label="always"
							hide-details
							:min="zoom.min"
							:max="zoom.max"
							:color="zoom.color"
							:thumb-color="zoom.thumbColor"
							@click:append="zoomIn"
							@click:prepend="zoomOut"
						></v-slider>
					</div>
				</div>
			</div>
		</div>
		<weight-dialog v-model="configs.weight" :show.sync="dialog.weight"></weight-dialog>
		<color-dialog v-model="configs.foreground" :show.sync="dialog.foreground"></color-dialog>
		<color-dialog v-model="configs.background" :show.sync="dialog.background"></color-dialog>
	</div>
</template>

<script>
import _ from 'lodash';
import { pt_br } from '@/langs';
import ColorDialog from '@/components/ColorDialog';
import WeightDialog from '@/components/WeightDialog';

const lang = pt_br;
export default {
	name: 'SideBar',
	components: {
		ColorDialog,
		WeightDialog,
	},
	data() {
		return {
			selectedTool: '',
			labels: lang.sidebar,
			tools: {
				itemsGroup: [
					[
						{ key: 'select', icon: 'mdi-select' },
						{ key: 'drap', icon: 'mdi-arrow-all' },
						{ key: 'resize', icon: 'mdi-resize' },
					],
					[
						{ key: 'pencil', icon: 'mdi-pencil' },
						{ key: 'brush', icon: 'mdi-brush' },
						{ key: 'spray', icon: 'mdi-spray' },
					],
					[
						{ key: 'bucket', icon: 'mdi-format-color-fill' },
						{ key: 'text', icon: 'mdi-format-color-text' },
						{ key: 'eraser', icon: 'mdi-eraser' },
					],
				],
				weightsGroup: [
					[
						{ key: 'weight', icon: 'mdi-format-line-weight' },
						{ key: 'foreground', icon: 'mdi-palette' },
						{ key: 'background', icon: 'mdi-palette-advanced' },
					],
				]
			},
			zoom: {
				value: 100,
				min: 0,
				max: 200,
				color: 'blue darken-3',
				thumbColor: '#000066',
			},
			configs: {
				weight: 2,
				foreground: '#FFFFFFFF',
				background: '#000000FF',
			},
			dialog: '',
		}
	},
	watch: {
		selectedTool(newValue, oldValue) {
			this.$emit('select', newValue, oldValue);
		},
		configs: {
			handler(newValue, oldValue) {
				this.$emit('configure', newValue, oldValue);
			},
			deep: true,
		},
		zoom: {
			handler(newValue, oldValue) {
				this.$emit('zoom', newValue, oldValue);
			},
			deep: true,
		}
	},
	methods: {
		zoomIn() {
			this.zoom.value += 5;
		},
		zoomOut() {
			this.zoom.value -= 5;
		},
		select(indexes) {
			const tool = _.get(this.tools, indexes);
			const selected = tool.selected

			this.selectedTool = !selected ? tool : undefined;
			
			_.each(this.tools.itemsGroup, (tools, group) => {
				_.each(tools, (tool, index) => {
					_.set(this.tools, ['itemsGroup', group, index], { ...tool, selected: false })
				});
			});

			_.set(this.tools, indexes, { ...tool, selected: !selected });
			this.tools = { ...this.tools };
		},
		config(key) {
			this.dialog = { [key]: true };
		},
		changeColors() {
			const color = this.configs.foreground;
			this.configs.foreground = this.configs.background;
			this.configs.background = color;
		}
	},
}
</script>

<style lang="scss" scoped>
.sidebar {
	margin: 0;
	padding: 5px;
	width: 210px;
	background-color: #f1f1f1;
	position: fixed;
	height: calc(100% - 36px);
	overflow: hidden;
}


div.content {
	margin-left: 200px;
	padding: 1px 16px;
	height: 1000px;
}

.sidebar-icon {
	width: 20px;
	margin: 5px;
	color: black;
}

.tool-item {
	&.active {
		background-color: #aa0404;
		color: white;
	}
}

.sidebar-container {
	width: 100%;
	height: 100%;
}

.selected-colors {
	border: 2px solid black;
	width: 30px;
	height: 30px;
	border-radius: 2px;
}

.selected-colors-container {
	// width: 100%;
	margin-top: 10px;
	margin-left: 10px;
}

.background-color {
}
.foreground-color {
	margin-top: -15px;
	margin-left: 15px;
}

.current-weight {
	width: calc(100% - 20px);
	background-color: black;
	margin: 0 auto;
}

.weight-info {
	line-height: 2;
	font-size: 14px;
	color: rgb(87, 71, 71);
}

@media screen and (max-width: 700px) {
	.sidebar {
		width: 100%;
		height: auto;
		position: relative;
	}
	div.content {margin-left: 0;}
}

@media screen and (max-width: 400px) {
	.sidebar a {
		text-align: center;
		float: none;
	}
}
</style>