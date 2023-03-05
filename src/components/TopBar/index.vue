<template>
	<div>
		<div class="topbar">
			<topbar-item
				btn-class="active"
				:label="labels.file"
				:options="fileOptions"
				@run-command="runCommand"
			/>
			<topbar-item
				:label="labels.edit"
				:options="editOptions"
				@run-command="runCommand"
			>
				<template #children_text>
					<div class="w-100">
						<table class="text text-table" v-for="(textIcons, group) in textIconGroups" :key="group">
							<td v-for="(textIcon, index) in textIcons" :key="index">
								<v-btn
									class="tool-item"
									:class="{'active': textIcon.selected}"
									@click="select(textIcon, group, index)"
								>
									<v-icon>{{ textIcon.icon }}</v-icon>
								</v-btn>
							</td>
						</table>
					</div>
				</template>
			</topbar-item>
			<topbar-item
				:label="labels.help"
				:options="helpOptions"
				@run-command="runCommand"
			/>
		</div>
	</div>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import each from 'lodash/each';
import findIndex from 'lodash/findIndex';
import TopbarItem from '@/components/TopbarItem';
import { formatsForDownload } from '@/utils';
import { pt_br } from '@/langs';

const lang = pt_br;
export default {
	name: 'TopBar',
	components: {
		TopbarItem
	},
	data() {
		return {
			labels: lang.topbar,
			formatsForDownload,
			file: {
				name: '',
				format: '',
			},
			fileOptions: [
				{
					key: 'download',
					label: lang.topbar.options.download,
					icon: 'mdi-download',
				},
				{key: 'close', label: lang.topbar.options.close, icon: 'mdi-close'},
			],
			editOptions: [
				{key: 'undo', label: lang.topbar.options.undo, icon: 'mdi-undo'},
				{key: 'redo', label: lang.topbar.options.redo, icon: 'mdi-redo'},
				{key: 'clean', label: lang.topbar.options.clean, icon: 'mdi-cancel'},
				{
					key: 'text',
					label: lang.topbar.options.text,
					icon: 'mdi-text',
					childrens: [{
						key: 'text'
					}]
				},
			],
			helpOptions: [
				{key: 'tutorials', label: lang.topbar.options.tutorials},
				{key: 'github', label: lang.topbar.options.github},
				{key: 'about', label: lang.topbar.options.about},
			],
			textIconGroups: {
				align: [
					{key: 'align-left', icon: 'mdi-format-align-left', selected: true},
					{key: 'align-center', icon: 'mdi-format-align-center'},
					{key: 'align-justify', icon: 'mdi-format-align-justify'},
					{key: 'align-right', icon: 'mdi-format-align-right'},
				],
				lists: [
					{key: 'list-bulleted', icon: 'mdi-format-list-bulleted'},
					{key: 'list-numbered', icon: 'mdi-format-list-numbered'},
				],
				format: [
					{key: 'format-bold', icon: 'mdi-format-bold'},
					{key: 'format-italic', icon: 'mdi-format-italic'},
					{key: 'format-underline', icon: 'mdi-format-underline'},
					{key: 'strikethrough-variant', icon: 'mdi-format-strikethrough-variant'},
				],
				size: [
					{key: 'annotation-minus', icon: 'mdi-format-annotation-minus'},
					{key: 'annotation-plus', icon: 'mdi-format-annotation-plus'},
				],
				decoration: [
					{key: 'format-subscript', icon: 'mdi-format-subscript'},
					{key: 'format-superscript', icon: 'mdi-format-superscript'},
				],
				ident: [
					{key: 'indent-decrease', icon: 'mdi-format-indent-decrease'},
					{key: 'indent-increase', icon: 'mdi-format-indent-increase'},
				],
			},
			textConfig: {
				align: get(this.textIconGroups, [0, 0]),
				format: [],
				size: 12,
				ident: 0,
				lists: undefined,
				decoration: undefined,
			}
		}
	},
	watch: {
		textConfig: {
			handler(newValue, oldValue) {
				this.$emit('text-format', newValue, oldValue);
			}
		}
	},
	methods: {
		runCommand(item) {
			this.$emit('run-command', item);
		},	
		select(item, group, index) {
			const resolver = this.getResolver(group);
			if (resolver) resolver.call(this, item, index);
			this.textIconGroups = { ...this.textIconGroups };
			this.textConfig = { ...this.textConfig };
		},
		resetTextGroup(group) {
			each(this.textIconGroups[group], (item, index) => {
				set(this.textIconGroups[group], index, { ...item, selected: false });
			})
		},
		configTextGroup(group, item, index) {
			set(this.textIconGroups[group], index, { ...item, selected: true });
		},
		getResolver(group) {
			const callbacks = {
				align(item, index) {
					this.resetTextGroup('align');
					this.configTextGroup('align', item, index);
					this.textConfig.align = item;
				},
				lists(item, index) {
					this.resetTextGroup('lists');
					this.configTextGroup('lists', item, index);
					this.textConfig.lists != item ? item : undefined;
				},
				format(item) {
					this.resetTextGroup('format');
					const index = findIndex(this.textConfig.format, ['key', item.key]);
					if (index >= 0) {
						this.textConfig.format.splice(index, 1);
					} else {
						this.textConfig.format.push(item);
					}
					each(this.textConfig.format, (item) => {
						this.configTextGroup('format', item, findIndex(this.textIconGroups.format, item));
					})
				},
				size(item) {
					if (item.key == 'annotation-minus') {
						this.textConfig.size--;
					}
					if (item.key == 'annotation-plus') {
						this.textConfig.size++;
					}
				},
				decoration(item, index) {
					this.resetTextGroup('decoration');
					this.textConfig.decoration = this.textConfig.decoration?.key != item.key ? item : undefined;
					if (this.textConfig.decoration) {
						this.configTextGroup('decoration', item, index);
					}
				},
				ident(item) {
					if (item['indent-decrease']) {
						this.textConfig.ident--;
					}
					if (item['indent-increase']) {
						this.textConfig.ident++;
					}
				},
			}
			return callbacks[group];
		},
		clearFileConfig() {
			this.file = {
				name: '',
				format: '',
			}
		},
		download() {
			this.runCommand({ key: 'download-' + JSON.stringify(this.file) });
		}
	},
}
</script>

<style lang="scss">
@import "./styles";
</style>