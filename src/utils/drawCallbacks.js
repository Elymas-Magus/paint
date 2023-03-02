import last from 'lodash/last';
import min from 'lodash/min';

const drawCallbacks = {
    pencil(e) {
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;

        this.context.stroke();
    },
    brush(e) {
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;

        this.context.stroke();
    },
    spray(e) {
        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        }

        this.context.strokeStyle = this.palette.foreground;
        this.context.rect(mouse.x, mouse.y, 1, 1);

        for (var i = 30; i--;) { 
            this.context.rect(
                mouse.x + ((Math.random() * 100 - 10) % this.palette.weight), 
                mouse.y + ((Math.random() * 100 - 10) % this.palette.weight), 1, 1
            );
        }

        this.context.closePath();
        this.context.stroke();
    },
    eraser(e) {
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.globalCompositeOperation = 'destination-out';
        this.context.strokeStyle = this.palette.background;
        this.context.lineWidth = this.palette.weight;

        this.context.stroke();
    },
    slash(e) {
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();
        
        this.context.moveTo(this.points.start.x, this.points.start.y);
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.stroke();

    },
    square(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        this.context.rect(
            this.points.start.x,
            this.points.start.y,
            min([e.clientX - this.points.start.x - this.canvas.offsetLeft, this.canvas.width - this.points.start.x]),
            min([e.clientY - this.points.start.y - this.canvas.offsetTop, this.canvas.height - this.points.start.y]),
        );

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    triangle(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        this.context.moveTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, this.points.start.y);
        this.context.lineTo(this.points.start.x, e.clientY - this.canvas.offsetTop);
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.closePath();

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    circle(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        this.context.arc(this.points.start.x, this.points.start.y, Math.abs(e.clientX - this.points.start.x - this.canvas.offsetLeft), 0, 2 * Math.PI, false);

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    rhombus(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        this.context.moveTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, this.points.start.y);
        this.context.lineTo(this.points.start.x, e.clientY - this.canvas.offsetTop);
        this.context.lineTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, 2 * (e.clientY - this.canvas.offsetTop) - this.points.start.y);
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);

        this.context.closePath();
        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    trapezoid(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        this.context.moveTo(this.points.start.x + (e.clientX - this.canvas.offsetLeft - this.points.start.x) / 2, this.points.start.y);
        this.context.lineTo(this.points.start.x, (e.clientY - this.canvas.offsetTop / 2));
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, (e.clientY - this.canvas.offsetTop / 2));
        this.context.lineTo(e.clientX - this.canvas.offsetLeft, this.points.start.y);

        this.context.closePath();
        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    arrow(e, mode) {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        }

        const headlen = 15; // length of head in pixels
        const dx = mouse.x - this.points.start.x;
        const dy = mouse.y - this.points.start.y;
        const angle = Math.atan2(dy, dx);


        if (mode == 'thin') {
            this.context.fillStyle = this.palette.foreground;

            this.context.moveTo(this.points.start.x, this.points.start.y);
            this.context.lineTo(mouse.x, mouse.y);

            this.context.closePath();
            this.context.stroke();
            
            this.context.moveTo(mouse.x, mouse.y);
            this.context.lineTo(mouse.x - headlen * Math.cos(angle + Math.PI / 6), mouse.y - headlen * Math.sin(angle + Math.PI / 6));
            this.context.lineTo(mouse.x - headlen * Math.cos(angle - Math.PI / 6), mouse.y - headlen * Math.sin(angle - Math.PI / 6));
    
            this.context.closePath();        
            this.context.fill();
        } else {
            this.context.moveTo(this.points.start.x, this.points.start.y);
            this.context.lineTo(mouse.x, mouse.y);
            this.context.lineTo(mouse.x - headlen * Math.cos(angle - Math.PI / 6), mouse.y - headlen * Math.sin(angle - Math.PI / 6));
            this.context.moveTo(mouse.x, mouse.y);
            this.context.lineTo(mouse.x - headlen * Math.cos(angle + Math.PI / 6), mouse.y - headlen * Math.sin(angle + Math.PI / 6));
    
            this.context.closePath();
            this.context.stroke();
        }

    },
    star(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
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
            this.context.moveTo(start.x, start.y); // a
            this.context.lineTo(start.x + straights.f, start.y + straights.c); // a'
            this.context.lineTo(start.x + straights.a, start.y + straights.c); // b
            this.context.lineTo(start.x + straights.g, start.y + straights.e); // b'
            this.context.lineTo(current.x, current.y); // c
            this.context.lineTo(start.x, start.y + straights.e + straights.d); // c'
            this.context.lineTo(current.x - straights.b, current.y); // d
            this.context.lineTo(start.x - straights.g, start.y + straights.e); // d'
            this.context.lineTo(start.x - straights.a, start.y + straights.c); // e
            this.context.lineTo(start.x - straights.f, start.y + straights.c); // e'
            this.context.lineTo(start.x, start.y); // a

            this.context.closePath();
            
            this.context.closePath();						
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            const straights = {
                a: 2 * axis * distancy * sin18 * cos36,
                b: 2 * axis * distancy * sin18,
                c: 2 * axis * distancy * sin18 * sin36,
            }
            
            // Star-outline
            this.context.moveTo(start.x, start.y);
            this.context.lineTo(current.x, current.y);
            this.context.lineTo(start.x - straights.a, start.y + straights.c);
            this.context.lineTo(start.x + straights.a, start.y + straights.c);
            this.context.lineTo(current.x - straights.b, current.y);
            this.context.lineTo(start.x, start.y);

            this.context.closePath();
            this.context.fill();
        }
    },
    pentagon(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        
        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
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
        
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(start.x + straights.a, start.y + straights.c);
        this.context.lineTo(current.x, current.y);
        this.context.lineTo(current.x - straights.b, current.y);
        this.context.lineTo(start.x - straights.a, start.y + straights.c);

        this.context.closePath();

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    hexagon(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
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
        
        this.context.moveTo(start.x, start.y); // a
        this.context.lineTo(start.x + (1.5 * side), start.y + height); // b
        this.context.lineTo(start.x + (1.5 * side), start.y + (3 * height)); // c
        this.context.lineTo(start.x, start.y + (4 * height)); // d
        this.context.lineTo(start.x - (1.5 * side), start.y + (3 * height)); // e
        this.context.lineTo(start.x - (1.5 * side), start.y + height); // f

        this.context.closePath();

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    hexagram(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
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

        this.context.moveTo(start.x, start.y); // a
        this.context.lineTo(start.x + side / 2, start.y + height); // a'
        
        this.context.lineTo(start.x + (1.5 * side), start.y + height); // b
        this.context.lineTo(start.x + side, start.y + (2 * height)); // b'

        this.context.lineTo(start.x + (1.5 * side), start.y + (3 * height)); // c
        this.context.lineTo(start.x + side / 2, start.y + (3 * height)); // c'

        this.context.lineTo(start.x, start.y + (4 * height)); // d
        this.context.lineTo(start.x - side / 2, start.y + (3 * height)); // d'
        
        this.context.lineTo(start.x - (1.5 * side), start.y + (3 * height)); // e
        this.context.lineTo(start.x - side, start.y + (2 * height)); // e'
        
        this.context.lineTo(start.x - (1.5 * side), start.y + height); // f
        this.context.lineTo(start.x - side / 2, start.y + height); // f
        this.context.lineTo(start.x, start.y); // a
        
        this.context.closePath();

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
    octagon(e, mode = '') {
        this.context.putImageData(last(this.elements), 0, 0);
        this.context.globalCompositeOperation = 'source-over';
        this.context.strokeStyle = this.palette.foreground;
        this.context.lineWidth = this.palette.weight;
        this.context.beginPath();

        const { start } = this.points;
        const mouse = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
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
        
        this.context.moveTo(start.x, start.y); // a
        this.context.lineTo(start.x + axis * base / 2, start.y + axis * (height - base)); // b

        this.context.lineTo(start.x + axis * side, start.y + axis * side); // c
        this.context.lineTo(current.x - mouseAlign, current.y); // d

        this.context.lineTo(start.x, start.y + 2 * axis * side); // e
        this.context.lineTo(start.x - axis * base / 2, start.y + axis * height); // f

        this.context.lineTo(start.x - axis * side, start.y + axis * side); // g
        this.context.lineTo(start.x - axis * base / 2, start.y + axis * (height - base)); // h

        this.context.closePath();

        if (mode == 'outline') {
            this.context.stroke();
        } else {
            this.context.fillStyle = this.palette.foreground;
            this.context.fill();
        }
    },
}

export default drawCallbacks;