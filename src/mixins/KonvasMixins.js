import { runEventCallback, keyboardListener } from "@/utils";

const SIDEBAR_SIZE = 240;
const TOPBAR_SIZE = 36;
const ORIGIN = { x: 0, y: 0 };

export default {
	data() {
		return {
			shapes: [],
			drawing: false,
			dimensions: {
				w: window.innerWidth - SIDEBAR_SIZE,
				h: window.innerHeight - TOPBAR_SIZE,
			},
			points: {
				start: {},
				mouse: {},
			},
			container: undefined,
			stage: undefined,
			layer: undefined,
			dragging: false,
            background: undefined,
			listener: new keyboardListener(),
		}
	},
	created() {
		window.addEventListener('resize', this.onResize);
	},
    methods: {
		init() {	
			this.stage = this.newStage();	
			this.layer = this.newLayer();
			this.stage.add(this.layer);

			this.container = this.getContainer();
			this.addEventListeners();
		},
        setBackground() {
            if (this.background) {
                this.background.destroy();
            }
            this.background = new window.Konva.Rect({
                ...ORIGIN,
                width: this.stage.width(),
                height: this.stage.height(),
                illLinearGradientStartPoint: ORIGIN,
                fillLinearGradientEndPoint: {
                    x: this.stage.width(),
                    y: this.stage.height()
                },
                fill: this.palette.background,
                listening: false,
            });
            this.layer.add(this.background);
            this.background.moveToBottom();
        },
		setDragging(dragging) {
			this.dragging = dragging;
		},
		dragOn() {
			this.setDragging(true);
			this.changeMouse('move');
		},
		dragOff() {
			this.setDragging(false);
			this.changeMouse('default');
		},
		newStage() {
			return new window.Konva.Stage({
				container: 'canvas-container',
				width: this.dimensions.w,
				height: this.dimensions.h,
			});
		},
		newLayer() {
			return new window.Konva.Layer();
		},
		addEventListeners() {
			this.stage.on('touchstart mousedown pointerdown', this.start);
			this.stage.on('touchmove mousemove pointermove', this.draw);
			this.stage.on('touchend mouseup mouseout pointerup pointercancel', this.stop);
		},
		onResize() {
			this.dimensions = {
				w: window.innerWidth - SIDEBAR_SIZE,
				h: window.innerHeight - TOPBAR_SIZE,
			}
		},
		changeMouse(type) {
			document.body.style.cursor = type;
		},
		run(callback, params) {
			return runEventCallback.call(this, callback, params);
		},
		nameResolver(key) {
			const parts = key.split('-');
			const path = {
				key: parts.shift(),
				args: parts,
			}
			return path;
		},
    },
}