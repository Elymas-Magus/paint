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
    circle(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        this.context.buffer.arc(this.points.start.x, this.points.start.y, Math.abs(e.clientX - this.points.start.x - this.canvas.buffer.offsetLeft), 0, 2 * Math.PI, false);

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
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
    pentagram(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.buffer.offsetLeft,
            y: e.clientY - this.canvas.buffer.offsetTop,
        }
        // const distancy = Math.sqrt(Math.pow(mouse.x -start.x, 2) + Math.pow(mouse.y -start.y, 2));
        const cos18 = Math.cos(Math.PI / 10);
        const sin18 = Math.sin(Math.PI / 10);
        const tan18 = Math.tan(Math.PI / 10);
        const cos36 = Math.cos(Math.PI / 5);
        const sin36 = Math.sin(Math.PI / 5);

        const current = {
            x: start.x + tan18 * (mouse.y - start.y),
            y: mouse.y,
        }
        const axis = mouse.y < start.y ? -1 : 1;
        const distancy = Math.sqrt(Math.pow(current.x -start.x, 2) + Math.pow(current.y -start.y, 2));

        if (mode == 'outline') {
            const straights = {
                a: 2 * axis * distancy * sin18 * cos36,
                b: 2 * axis * distancy * sin18,
                c: 2 * axis * distancy * sin18 * sin36,
                d: 4 * axis * sin36 * tan18 * distancy * sin18 * sin36,
                e: axis * cos18 * (distancy / 2 + 2 * tan18 * distancy * sin18 * sin36),
                f: 2 * axis * tan18 * distancy * sin18 * sin36,
                g: axis * sin18 * (distancy / 2 + 2 * tan18 * distancy * sin18 * sin36)
            }
            
            // Star
            this.context.buffer.moveTo(start.x, start.y); // a
            this.context.buffer.lineTo(start.x + straights.f, start.y + straights.c); // a'
            this.context.buffer.lineTo(start.x + straights.a, start.y + straights.c); // b
            this.context.buffer.lineTo(start.x + straights.g, start.y + straights.e); // b'
            this.context.buffer.lineTo(current.x, current.y); // c
            this.context.buffer.lineTo(start.x, start.y + straights.e + straights.d); // c'
            this.context.buffer.lineTo(current.x - straights.b, current.y); // d
            this.context.buffer.lineTo(start.x - straights.g, start.y + straights.e); // d'
            this.context.buffer.lineTo(start.x - straights.a, start.y + straights.c); // e
            this.context.buffer.lineTo(start.x - straights.f, start.y + straights.c); // e'
            this.context.buffer.lineTo(start.x, start.y); // a

            this.context.buffer.closePath();
            
            this.context.buffer.closePath();						
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            const straights = {
                a: 2 * axis * distancy * sin18 * cos36,
                b: 2 * axis * distancy * sin18,
                c: 2 * axis * distancy * sin18 * sin36,
            }
            
            // Star-outline
            this.context.buffer.moveTo(start.x, start.y);
            this.context.buffer.lineTo(current.x, current.y);
            this.context.buffer.lineTo(start.x - straights.a, start.y + straights.c);
            this.context.buffer.lineTo(start.x + straights.a, start.y + straights.c);
            this.context.buffer.lineTo(current.x - straights.b, current.y);
            this.context.buffer.lineTo(start.x, start.y);

            this.context.buffer.closePath();
            this.context.buffer.fill();
        }
    },
    hexagram(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.buffer.offsetLeft,
            y: e.clientY - this.canvas.buffer.offsetTop,
        }
        const tan30 = Math.tan(Math.PI / 6);
        const current = {
            x: start.x + (mouse.y - start.y) / tan30,
            y: mouse.y,
        }
        
        const axis = mouse.y < start.y ? -1 : 1;
        const distancy = Math.sqrt(Math.pow(current.x -start.x, 2) + Math.pow(current.y -start.y, 2));
        const side = axis * distancy / 3;
        const height = axis * side * Math.sqrt(3) / 2;

        this.context.buffer.moveTo(start.x, start.y); // a
        this.context.buffer.lineTo(start.x + side / 2, start.y + height); // a'
        
        this.context.buffer.lineTo(start.x + (1.5 * side), start.y + height); // b
        this.context.buffer.lineTo(start.x + side, start.y + (2 * height)); // b'

        this.context.buffer.lineTo(start.x + (1.5 * side), start.y + (3 * height)); // c
        this.context.buffer.lineTo(start.x + side / 2, start.y + (3 * height)); // c'

        this.context.buffer.lineTo(start.x, start.y + (4 * height)); // d
        this.context.buffer.lineTo(start.x - side / 2, start.y + (3 * height)); // d'
        
        this.context.buffer.lineTo(start.x - (1.5 * side), start.y + (3 * height)); // e
        this.context.buffer.lineTo(start.x - side, start.y + (2 * height)); // e'
        
        this.context.buffer.lineTo(start.x - (1.5 * side), start.y + height); // f
        this.context.buffer.lineTo(start.x - side / 2, start.y + height); // f
        this.context.buffer.lineTo(start.x, start.y); // a
        
        this.context.buffer.closePath();

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
    },
}

export default createShapesCallbacks;