<template>
    <div>

    </div>
</template>

<script>
    export default {
        name: 'KeyboardListener',
        props: {
            actions: {
                type: Array,
            }
        },
        mounted() {
            document.addEventListener('keydown', e => {
                this.actions.forEach(action => {
                    if (e.ctrlKey && e.key === action.key) {
                        e.preventDefault();
                        e.stopPropagation();
                    
                        action.callback.call(this.$parent, e);
                    }
                })
            });
        }
    }
</script>

<style lang="scss" scoped>

</style>