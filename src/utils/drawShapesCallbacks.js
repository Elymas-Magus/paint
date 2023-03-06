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
    circle() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = Math.abs(mouse.y - start.y) * 2 / 3;
        this.shapes[index].radius(radius);
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
    pentagram() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y);
        this.shapes[index].innerRadius(radius);
        this.shapes[index].outerRadius(radius * 19 / 50);
    },
    hexagram() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y);
        this.shapes[index].innerRadius(radius);
        this.shapes[index].outerRadius(radius * 4 / 7);
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
    octagon() {
        const { start, mouse } = this.points;
        const index = this.shapes.length - 1;
        const radius = (mouse.y - start.y) * 1.1 / 2;
        this.shapes[index].y(start.y + radius);
        this.shapes[index].radius(radius);
    },
}

export default drawShapesCallbacks;