import isLetter from "./isLetter";
import logicFuncs from "./logicFuncs";

const modifiers = {
    ctrl: 'ctrlKey',
    shift: 'shiftKey',
    alt: 'altKey',
    meta: 'metaKey',
}

const SPACE_HEX = String(0x20);
const SPACE_KEY = ' ';

function keyboardListener() {
    this.eventName = '';
    this.actions = [];

    this.on = (eventName) => {
        console.log('on', eventName);
        this.eventName = eventName;
        return this;
    }
    this.action = (actions) => {
        console.log('actions', actions);
        this.actions = actions;
        this.listen();
    }
    this.actionResolver = (e, action) => {
        const items = action.split('+');
        return logicFuncs.and(items, item => {
            if (isLetter(item)) {
                return e.key === item;
            }
            if (modifiers[item] != undefined) {
                return e[modifiers[item]];
            }
            if (item == SPACE_HEX) {
                return e.key === SPACE_KEY;
            }
            return false;
        });
    }
    this.listen = () => {
        const actions = this.actions;
        document.addEventListener(this.eventName, e => {
            actions.forEach(action => {
                if (this.actionResolver(e, action.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                
                    action.callback.call(this.$parent, e);
                }
            })
        });
    }
    return this;
}

export { SPACE_KEY, SPACE_HEX };
export default keyboardListener;