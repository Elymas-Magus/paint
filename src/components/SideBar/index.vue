<template>
	<div>
		<div class="sidebar">
			<div class="d-flex flex-column align-end sidebar-container">
				<div class="sidebar-tool-list w-100" style="margin-bottom: 25px; padding-bottom: 75px;">
					<div class="w-100">
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
									mdi-shape
								</v-icon>
								{{ labels.shapes }}
							</h3>
							<div class="w-100">
								<table class="tools">
									<tr v-for="(tools, group) in tools.shapeIconGroups" :key="group">
										<td v-for="(tool, index) in tools" :key="tool.key">
											<v-btn
												class="tool-item"
												:class="{'active': tool.selected}"
												@click="select(['shapeIconGroups', group, index])"
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
									<tr v-for="(tools, group) in palette.weightsGroup" :key="group">
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
					</div>
				</div>
				<div class="sidebar-zoom mt-auto w-100">
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
import get from 'lodash/get';
import each from 'lodash/each';
import set from 'lodash/set';
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
			selectedTool: { key: 'pencil', icon: 'mdi-pencil' },
			labels: lang.sidebar,
			palette: {
				weightsGroup: [
					[
						{ key: 'weight', icon: 'mdi-format-line-weight' },
						{ key: 'foreground', icon: 'mdi-palette' },
						{ key: 'background', icon: 'mdi-palette-advanced' },
					],
				],
			},
			tools: {
				itemsGroup: [
					[
						{ key: 'select', icon: 'mdi-select' },
						{ key: 'drap', icon: 'mdi-arrow-all' },
						{ key: 'resize', icon: 'mdi-resize' },
					],
					[
						{ key: 'pencil', icon: 'mdi-pencil', selected: true },
						{ key: 'brush', icon: 'mdi-brush' },
						{ key: 'spray', icon: 'mdi-spray' },
					],
					[
						{ key: 'bucket', icon: 'mdi-format-color-fill' },
						{ key: 'text', icon: 'mdi-format-color-text' },
						{ key: 'eraser', icon: 'mdi-eraser' },
					],
				],
				shapeIconGroups: [
					[
						{ key: 'triangle', icon: 'mdi-triangle' },
						{ key: 'square', icon: 'mdi-square' },
						{ key: 'rhombus', icon: 'mdi-rhombus' },
					],
					[
						{ key: 'pentagon', icon: 'mdi-pentagon' },
						{ key: 'hexagon', icon: 'mdi-hexagon' },
						{ key: 'octagon', icon: 'mdi-octagon' },
					],
					[
						{ key: 'circle', icon: 'mdi-circle' },
						{ key: 'pentagram', icon: 'mdi-star' },
						{ key: 'hexagram', icon: 'mdi-hexagram' },
					],
					[
						{ key: 'triangle-outline', icon: 'mdi-triangle-outline' },
						{ key: 'square-outline', icon: 'mdi-square-outline' },
						{ key: 'rhombus-outline', icon: 'mdi-rhombus-outline' },
					],
					[
						{ key: 'pentagon-outline', icon: 'mdi-pentagon-outline' },
						{ key: 'hexagon-outline', icon: 'mdi-hexagon-outline' },
						{ key: 'octagon-outline', icon: 'mdi-octagon-outline' },
					],
					[
						{ key: 'circle-outline', icon: 'mdi-circle-outline' },
						{ key: 'pentagram-outline', icon: 'mdi-star-outline' },
						{ key: 'hexagram-outline', icon: 'mdi-hexagram-outline' },
					],
					[
						{ key: 'slash', icon: 'mdi-slash-forward' },
						{ key: 'arrow', icon: 'mdi-arrow-top-left' },
						{ key: 'arrow-thin', icon: 'mdi-arrow-top-left-thin' },
					],
				],
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
				foreground: '#000000FF',
				background: '#FFFFFFFF',
			},
			dialog: '',
		}
	},
	created() {
		this.selectedTool = { key: 'pencil', icon: 'mdi-pencil' };
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
			const tool = get(this.tools, indexes);
			const selected = tool.selected

			this.selectedTool = !selected ? tool : undefined;
			
			each(this.tools, (toolsgroups, groupName) => {
				each(toolsgroups, (tools, group) => {
					each(tools, (tool, index) => {
						set(this.tools, [groupName, group, index], { ...tool, selected: false })
					});
				});
			});

			set(this.tools, indexes, { ...tool, selected: !selected });
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
@import "./styles";
</style>