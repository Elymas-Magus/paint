import last from 'lodash/last';

const lineConfig = {
    lineCap: 'round',
    lineJoin: 'round',
    globalCompositeOperation: 'source-over',
    draggable: true,
}

const factory = {
    make(type, configs) {
        const drawer = window.Konva[type];
        const shape = new drawer({ ...lineConfig, ...configs });

        this.shapes.push(shape);
        this.layer.add(last(this.shapes));
    }
}

const createShapesCallbacks = {
    pencil() { // e = { evt, target, currentTarget, pointerId, type }
        const { start } = this.points;
        factory.make.call(this, 'Line', {
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
            points: [start.x, start.y, start.x, start.y],
        });
    },
    brush() {
        const { start } = this.points;
        factory.make.call(this, 'Line', {
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
            points: [start.x, start.y, start.x, start.y],
        });
    },
    spray(e) {
        const mouse = {
            x: e.clientX - this.canvas.buffer.offsetLeft,
            y: e.clientY - this.canvas.buffer.offsetTop,
        }

        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.rect(mouse.x, mouse.y, 1, 1);

        for (var i = 30; i--;) { 
            this.context.buffer.rect(
                mouse.x + ((Math.random() * 100 - 10) % this.palette.weight), 
                mouse.y + ((Math.random() * 100 - 10) % this.palette.weight), 1, 1
            );
        }

        this.context.buffer.closePath();
        this.context.buffer.stroke();
    },
    eraser() {
        const { start } = this.points;
        factory.make.call(this, 'Line', {
            stroke: this.palette.background,
            strokeWidth: this.palette.weight,
            globalCompositeOperation: 'destination-out',
            points: [start.x, start.y, start.x, start.y],
        });
    },
    slash() {
        const { start } = this.points;
        factory.make.call(this, 'Line', {
            points: [start.x, start.y, start.x, start.y],
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    square(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'Rect', {
            ...start,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    triangle(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'RegularPolygon', {
            x: start.x,
            y: start.y,
            sides: 3,
            radius: 0,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    circle(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'Circle', {
            x: start.x,
            y: start.y,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    rhombus(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        this.context.buffer.moveTo(this.points.start.x + (e.clientX - this.canvas.buffer.offsetLeft - this.points.start.x) / 2, this.points.start.y);
        this.context.buffer.lineTo(this.points.start.x, e.clientY - this.canvas.buffer.offsetTop);
        this.context.buffer.lineTo(this.points.start.x + (e.clientX - this.canvas.buffer.offsetLeft - this.points.start.x) / 2, 2 * (e.clientY - this.canvas.buffer.offsetTop) - this.points.start.y);
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.closePath();
        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
    },
    trapezoid(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        this.context.buffer.moveTo(this.points.start.x + (e.clientX - this.canvas.buffer.offsetLeft - this.points.start.x) / 2, this.points.start.y);
        this.context.buffer.lineTo(this.points.start.x, (e.clientY - this.canvas.buffer.offsetTop / 2));
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, (e.clientY - this.canvas.buffer.offsetTop / 2));
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, this.points.start.y);

        this.context.buffer.closePath();
        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
    },
    arrow(_, mode) {
        const { start } = this.points;
        if (mode == 'thin') {
            factory.make.call(this, 'Arrow', {
                fill: mode == 'outline' ? this.palette.background : this.palette.foreground,
                stroke: this.palette.foreground,
                points: [start.x, start.y, start.x, start.y],
                pointerLength: 5 * this.palette.weight,
                pointerWidth: 5 * this.palette.weight,
                strokeWidth: this.palette.weight,
            });
        } else {
            factory.make.call(this, 'Line', {
                fill: mode == 'outline' ? this.palette.background : this.palette.foreground,
                stroke: this.palette.foreground,
                points: [start.x, start.y, start.x, start.y],
                strokeWidth: this.palette.weight,
            });
        }
    },
    pentagon(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'RegularPolygon', {
            x: start.x,
            y: start.y,
            sides: 5,
            radius: 0,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    hexagon(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'RegularPolygon', {
            x: start.x,
            y: start.y,
            sides: 6,
            radius: 0,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    octagon(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'RegularPolygon', {
            x: start.x,
            y: start.y,
            sides: 8,
            radius: 0,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    pentagram(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'Star', {
            x: start.x,
            y: start.y,
            numPoints: 5,
            innerRadius: 0,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    hexagram(_, mode = '') {
        const { start } = this.points;
        factory.make.call(this, 'Star', {
            x: start.x,
            y: start.y,
            numPoints: 6,
            innerRadius: 0,
            fill: mode == 'outline' ?
                this.palette.background : this.palette.foreground,
            stroke: this.palette.foreground,
            strokeWidth: this.palette.weight,
        });
    },
    // hexagram(e, mode = '') {
    //     this.context.buffer.putImageData(last(this.elements), 0, 0);
    //     this.context.buffer.globalCompositeOperation = 'source-over';
    //     this.context.buffer.strokeStyle = this.palette.foreground;
    //     this.context.buffer.lineWidth = this.palette.weight;
    //     this.context.buffer.beginPath();

    //     const { start } = this.points;
    //     const mouse = {
    //         x: e.clientX - this.canvas.buffer.offsetLeft,
    //         y: e.clientY - this.canvas.buffer.offsetTop,
    //     }
    //     const tan30 = Math.tan(Math.PI / 6);
    //     const current = {
    //         x: start.x + (mouse.y - start.y) / tan30,
    //         y: mouse.y,
    //     }
        
    //     const axis = mouse.y < start.y ? -1 : 1;
    //     const distancy = Math.sqrt(Math.pow(current.x -start.x, 2) + Math.pow(current.y -start.y, 2));
    //     const side = axis * distancy / 3;
    //     const height = axis * side * Math.sqrt(3) / 2;

    //     this.context.buffer.moveTo(start.x, start.y); // a
    //     this.context.buffer.lineTo(start.x + side / 2, start.y + height); // a'
        
    //     this.context.buffer.lineTo(start.x + (1.5 * side), start.y + height); // b
    //     this.context.buffer.lineTo(start.x + side, start.y + (2 * height)); // b'

    //     this.context.buffer.lineTo(start.x + (1.5 * side), start.y + (3 * height)); // c
    //     this.context.buffer.lineTo(start.x + side / 2, start.y + (3 * height)); // c'

    //     this.context.buffer.lineTo(start.x, start.y + (4 * height)); // d
    //     this.context.buffer.lineTo(start.x - side / 2, start.y + (3 * height)); // d'
        
    //     this.context.buffer.lineTo(start.x - (1.5 * side), start.y + (3 * height)); // e
    //     this.context.buffer.lineTo(start.x - side, start.y + (2 * height)); // e'
        
    //     this.context.buffer.lineTo(start.x - (1.5 * side), start.y + height); // f
    //     this.context.buffer.lineTo(start.x - side / 2, start.y + height); // f
    //     this.context.buffer.lineTo(start.x, start.y); // a
        
    //     this.context.buffer.closePath();

    //     if (mode == 'outline') {
    //         this.context.buffer.stroke();
    //     } else {
    //         this.context.buffer.fillStyle = this.palette.foreground;
    //         this.context.buffer.fill();
    //     }
    // },
}

export default createShapesCallbacks;