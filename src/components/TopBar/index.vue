<template>
	<div>
		<div class="topbar">
			<topbar-item :label="labels.file" :options="fileOptions" btn-class="active"></topbar-item>
			<topbar-item :label="labels.edit" :options="editOptions">
				<template #children_shapes>
					<div class="w-100">
						<table class="shapes">
							<tr v-for="(shapeIcons, group) in shapeIconGroups" :key="group">
								<td v-for="(shapeIcon, index) in shapeIcons" :key="index">
									<v-btn><v-icon>{{ shapeIcon }}</v-icon></v-btn>
								</td>
							</tr>
						</table>
					</div>
				</template>
				<template #children_text>
					<div class="w-100">
						<table class="text mb-4" v-for="(textIcons, group) in textIconGroups" :key="group">
							<td v-for="(textIcon, index) in textIcons" :key="index">
								<v-btn><v-icon>{{ textIcon }}</v-icon></v-btn>
							</td>
						</table>
					</div>
				</template>
			</topbar-item>
			<topbar-item :label="labels.help" :options="helpOptions"></topbar-item>
		</div>
	</div>
</template>

<script>
import TopbarItem from './TopbarItem';
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
			fileOptions: [
				{key: 'download', label: lang.topbar.options.download, icon: 'mdi-download'},
				{key: 'close', label: lang.topbar.options.close, icon: 'mdi-close'},
			],
			editOptions: [
				{key: 'undo', label: lang.topbar.options.undo, icon: 'mdi-undo'},
				{key: 'redo', label: lang.topbar.options.redo, icon: 'mdi-redo'},
				{key: 'clean', label: lang.topbar.options.clean, icon: 'mdi-cancel'},
				{
					key: 'shapes',
					label: lang.topbar.options.shapes,
					icon: 'mdi-shape',
					childrens: [{
						key: 'shapes'
					}]
				},
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
			shapeIconGroups: [
				['mdi-triangle', 'mdi-square', 'mdi-rhombus'],
				['mdi-hexagon', 'mdi-octagon', 'mdi-circle'],
				['mdi-star', 'mdi-hexagram', 'mdi-octagram'],
				['mdi-triangle-outline', 'mdi-square-outline', 'mdi-rhombus-outline'],
				['mdi-hexagon-outline', 'mdi-octagon-outline', 'mdi-circle-outline'],
				['mdi-star-outline', 'mdi-hexagram-outline', 'mdi-octagram-outline'],
				['mdi-slash-forward', 'mdi-arrow-top-left', 'mdi-arrow-top-right'],
				['mdi-arrow-bottom-left', 'mdi-arrow-bottom-right', 'mdi-arrow-top-left-thin'],
				['mdi-arrow-top-right-thin', 'mdi-arrow-bottom-left-thin', 'mdi-arrow-bottom-right-thin'],
			],
			textIconGroups: [
				['mdi-format-align-left', 'mdi-format-align-center', 'mdi-format-align-justify', 'mdi-format-align-right'],
				['mdi-format-list-bulleted', 'mdi-format-list-numbered'],
				['mdi-format-bold', 'mdi-format-italic', 'mdi-format-underline', 'mdi-format-strikethrough-variant'],
				['mdi-format-annotation-minus', 'mdi-format-annotation-plus'],
				['mdi-format-subscript', 'mdi-format-superscript'],
				['mdi-format-indent-decrease', 'mdi-format-indent-increase'],
			]
		}
	}
}
</script>

<style lang="scss">
.w-100 {
	width: 100%;
}
.topbar {
	overflow: hidden;
	background-color: #333;
}

.topbar .v-btn {
	float: left;
	color: #f2f2f2;
	text-align: center;
	padding: 10px 12px;
	text-decoration: none;
	font-size: 15px !important;
	background-color: transparent !important;
	border-radius: 0 !important;
}

.topbar .v-btn:hover {
	background-color: #ddd !important;
	color: black;
}

.topbar .v-btn.active {
	background-color: #aa0404 !important;
	color: white;
}
table.shapes {
	width: 100%;
	border: 1px solid black;

	tr:not(tr:last-child) {
		td {
			border-bottom: 1px solid black;
		}
	}

	td:not(td:first-child) {
		border-left: 1px solid black;
	}

	td {
		text-align: center;
	}
}
</style>