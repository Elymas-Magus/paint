import last from 'lodash/last';
// import geometry from './geometry';



const drawShapesCallbacks = {
    pencil() { // e = { evt, target, currentTarget, pointerId, type }
        const { mouse } = this.points;
        const index = this.shapes.length - 1;
        this.shapes[index].points(
            this.shapes[index].points().concat([mouse.x, mouse.y])
        );
    },
    brush() {
        const { mouse } = this.points;
        const index = this.shapes.length - 1;
        this.shapes[index].points(
            this.shapes[index].points().concat([mouse.x, mouse.y])
        );
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
        const { mouse } = this.points;
        const index = this.shapes.length - 1;
        this.shapes[index].points(
            this.shapes[index].points().concat([mouse.x, mouse.y])
        );
    },
    slash() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        this.shapes[index].points([start.x, start.y, mouse.x, mouse.y]);
    },
    square() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        // const distancy = geometry.distancy(start, mouse)
        this.shapes[index].width(mouse.x - start.x);
        this.shapes[index].height(mouse.y - start.y);
    },
    triangle() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y) * 2 / 3;
        this.shapes[index].y(start.y + radius);
        this.shapes[index].radius(radius);
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
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const headlen = 5 * this.palette.weight;
        const angle = Math.atan2(mouse.y - start.y, mouse.x - start.x);

        if (mode == 'thin') {
            this.shapes[index].points([start.x, start.y, mouse.x, mouse.y]);
        } else {
            this.shapes[index].points([
                start.x, start.y,
                mouse.x, mouse.y,
                mouse.x - headlen * Math.cos(angle - Math.PI / 6), mouse.y - headlen * Math.sin(angle - Math.PI / 6),
                mouse.x, mouse.y,
                mouse.x - headlen * Math.cos(angle + Math.PI / 6), mouse.y - headlen * Math.sin(angle + Math.PI / 6)
            ]);
        }
    },
    star(e, mode = '') {
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
    pentagon() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y) * 1.1 / 2;
        this.shapes[index].y(start.y + radius);
        this.shapes[index].radius(radius);
    },
    hexagon() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y) * 1.1 / 2;
        this.shapes[index].y(start.y + radius);
        this.shapes[index].radius(radius);
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
    octagon() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y) * 1.1 / 2;
        this.shapes[index].y(start.y + radius);
        this.shapes[index].radius(radius);
    },
}

export default drawShapesCallbacks;