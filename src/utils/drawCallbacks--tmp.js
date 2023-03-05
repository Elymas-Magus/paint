import last from 'lodash/last';
import min from 'lodash/min';

const drawCallbacks = {
    pencil(e) {
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;

        this.context.buffer.stroke();
    },
    brush(e) {
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;

        this.context.buffer.stroke();
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
    eraser(e) {
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.globalCompositeOperation = 'destination-out';
        this.context.buffer.strokeStyle = this.palette.background;
        this.context.buffer.lineWidth = this.palette.weight;

        this.context.buffer.stroke();
    },
    slash(e) {
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();
        
        this.context.buffer.moveTo(this.points.start.x, this.points.start.y);
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.stroke();

    },
    square(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        this.context.buffer.rect(
            this.points.start.x,
            this.points.start.y,
            min([e.clientX - this.points.start.x - this.canvas.buffer.offsetLeft, this.canvas.buffer.width - this.points.start.x]),
            min([e.clientY - this.points.start.y - this.canvas.buffer.offsetTop, this.canvas.buffer.height - this.points.start.y]),
        );

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
    },
    triangle(e, mode = '') {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        this.context.buffer.moveTo(this.points.start.x + (e.clientX - this.canvas.buffer.offsetLeft - this.points.start.x) / 2, this.points.start.y);
        this.context.buffer.lineTo(this.points.start.x, e.clientY - this.canvas.buffer.offsetTop);
        this.context.buffer.lineTo(e.clientX - this.canvas.buffer.offsetLeft, e.clientY - this.canvas.buffer.offsetTop);

        this.context.buffer.closePath();

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
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
    arrow(e, mode) {
        this.context.buffer.putImageData(last(this.elements), 0, 0);
        this.context.buffer.globalCompositeOperation = 'source-over';
        this.context.buffer.strokeStyle = this.palette.foreground;
        this.context.buffer.lineWidth = this.palette.weight;
        this.context.buffer.beginPath();

        const mouse = {
            x: e.clientX - this.canvas.buffer.offsetLeft,
            y: e.clientY - this.canvas.buffer.offsetTop,
        }

        const headlen = 15; // length of head in pixels
        const dx = mouse.x - this.points.start.x;
        const dy = mouse.y - this.points.start.y;
        const angle = Math.atan2(dy, dx);


        if (mode == 'thin') {
            this.context.buffer.fillStyle = this.palette.foreground;

            this.context.buffer.moveTo(this.points.start.x, this.points.start.y);
            this.context.buffer.lineTo(mouse.x, mouse.y);

            this.context.buffer.closePath();
            this.context.buffer.stroke();
            
            this.context.buffer.moveTo(mouse.x, mouse.y);
            this.context.buffer.lineTo(mouse.x - headlen * Math.cos(angle + Math.PI / 6), mouse.y - headlen * Math.sin(angle + Math.PI / 6));
            this.context.buffer.lineTo(mouse.x - headlen * Math.cos(angle - Math.PI / 6), mouse.y - headlen * Math.sin(angle - Math.PI / 6));
    
            this.context.buffer.closePath();        
            this.context.buffer.fill();
        } else {
            this.context.buffer.moveTo(this.points.start.x, this.points.start.y);
            this.context.buffer.lineTo(mouse.x, mouse.y);
            this.context.buffer.lineTo(mouse.x - headlen * Math.cos(angle - Math.PI / 6), mouse.y - headlen * Math.sin(angle - Math.PI / 6));
            this.context.buffer.moveTo(mouse.x, mouse.y);
            this.context.buffer.lineTo(mouse.x - headlen * Math.cos(angle + Math.PI / 6), mouse.y - headlen * Math.sin(angle + Math.PI / 6));
    
            this.context.buffer.closePath();
            this.context.buffer.stroke();
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
    pentagon(e, mode = '') {
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
        // const cos18 = Math.cos(Math.PI / 10);
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

        const straights = {
            a: 2 * axis * distancy * sin18 * cos36,
            b: 2 * axis * distancy * sin18,
            c: 2 * axis * distancy * sin18 * sin36,
        }
        
        this.context.buffer.moveTo(start.x, start.y);
        this.context.buffer.lineTo(start.x + straights.a, start.y + straights.c);
        this.context.buffer.lineTo(current.x, current.y);
        this.context.buffer.lineTo(current.x - straights.b, current.y);
        this.context.buffer.lineTo(start.x - straights.a, start.y + straights.c);

        this.context.buffer.closePath();

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
    },
    hexagon(e, mode = '') {
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
        this.context.buffer.lineTo(start.x + (1.5 * side), start.y + height); // b
        this.context.buffer.lineTo(start.x + (1.5 * side), start.y + (3 * height)); // c
        this.context.buffer.lineTo(start.x, start.y + (4 * height)); // d
        this.context.buffer.lineTo(start.x - (1.5 * side), start.y + (3 * height)); // e
        this.context.buffer.lineTo(start.x - (1.5 * side), start.y + height); // f

        this.context.buffer.closePath();

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
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
    octagon(e, mode = '') {
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
        const tan22_5 = Math.tan(22.5 * Math.PI / 180);

        const axis = mouse.y < start.y ? -1 : 1;
        const mouseAlign = axis < 0 ? base : 0;
        const height = Math.abs(mouse.y - start.y);
        const base = 2 * height * tan22_5;
        const side = Math.sqrt(Math.pow(base, 2) / 2);

        const current = {
            x: start.x + base / 2,
            y: mouse.y,
        }
        
        this.context.buffer.moveTo(start.x, start.y); // a
        this.context.buffer.lineTo(start.x + axis * base / 2, start.y + axis * (height - base)); // b

        this.context.buffer.lineTo(start.x + axis * side, start.y + axis * side); // c
        this.context.buffer.lineTo(current.x - mouseAlign, current.y); // d

        this.context.buffer.lineTo(start.x, start.y + 2 * axis * side); // e
        this.context.buffer.lineTo(start.x - axis * base / 2, start.y + axis * height); // f

        this.context.buffer.lineTo(start.x - axis * side, start.y + axis * side); // g
        this.context.buffer.lineTo(start.x - axis * base / 2, start.y + axis * (height - base)); // h

        this.context.buffer.closePath();

        if (mode == 'outline') {
            this.context.buffer.stroke();
        } else {
            this.context.buffer.fillStyle = this.palette.foreground;
            this.context.buffer.fill();
        }
    },
}

export default drawCallbacks;