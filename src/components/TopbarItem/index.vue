<template>
    <v-menu
        right
        bottom
        content-class="menu"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                :class="['menu-btn', btnClass]"
            >{{ label }}</v-btn>
        </template>

        <v-list>
            <v-list-item
                v-for="item in options"
                :key="item.key"
                :class="[
                    'menu-item',
                    {
                        'has-childrens': item.childrens
                    }
                ]"
            >
                <v-menu
                    top
                    right
                    content-class="submenu"
                    :offset-x="true"
                    :close-on-content-click="false"
                    v-if="item.childrens"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            :elevation="0"
                            :class="['submenu-item-btn', 'd-flex', 'justify-start', 'px-8']"
                        >
                            <v-icon class="mx-0" v-if="item.icon">
                                {{ item.icon }}
                            </v-icon>
                            <div :class="{'mx-3': item.icon}"></div>
                            <div class="text-left mr-4">{{ item.label }}</div>
                        </v-btn>
                    </template>

                    <v-card class="py-4 px-5">
                        <div
                            v-for="children in item.childrens"
                            :key="children.key"
                            :class="['submenu-item']"
                        >
                            <v-list-item-title v-if="children.label">{{ children.label }}</v-list-item-title>
                            <slot :name="'children_' + children.key" :item="item" :children="children" v-else></slot>
                        </div>
                    </v-card>
                </v-menu>
                <v-btn
                    color="transparent"
                    elevation="0"
                    class="d-flex justify-space-around px-8" style="width: 100%"
                    @click="runCommand(item)"
                    v-else
                >
                    <v-list-item-icon v-if="item.icon" style="margin-right: 0">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <div :class="{'mx-2': item.icon}"></div>
                    <v-list-item-content style="width: 100%">
                        <div class="text-left pl-2 mr-4">{{ item.label }}</div>
                    </v-list-item-content>
                </v-btn>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    name: 'TopbarItem',
    props: {
        label: {
            type: String,
        },
        options: {
            type: Array,
        },
        btnClass: {
            type: [Array, Object, String, undefined]
        },
    },
    methods: {
        runCommand(item) {
            this.$emit('run-command', item);
        }
    },
}
</script>

<style lang="scss" scoped>
@import "./styles";
</style>