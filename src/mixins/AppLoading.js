export default {
	data() {
		return {
			loading: false,
		}
	},
    methods: {
		load() {
			this.loading = true;
		},
		stopLoading() {
			this.loading = false;
		},
    },
}