const commands = {
    undo() {
        if (this.elements.length <= 1) {
            this.run(commands.clean());
        } else {
            this.deleteds.push(this.elements.pop());
            this.context.buffer.putImageData(last(this.elements), 0, 0);
        }
    },
    redo() {
        if (this.deleteds.length > 0) {
            this.elements.push(this.deleteds.pop());
            this.context.buffer.putImageData(last(this.elements), 0, 0);
        }
    },
    clean() {
        this.context.buffer.fillStyle = this.palette.background;
        this.context.buffer.clearRect(0, 0, this.dimensions.w, this.dimensions.h);
        this.context.buffer.fillRect(0, 0, this.dimensions.w, this.dimensions.h);

        this.elements = [];
    },
    paste(e) {
        console.log(e);
        const pasteImage = async () => {
            try {
                const destinationImage = new Image();
                const permission = await navigator.permissions.query({
                    name: "clipboard-read",
                });
                if (permission.state === "denied") {
                    throw new Error("Not allowed to read clipboard.");
                }
                const clipboardContents = await navigator.clipboard.read();
                for (const item of clipboardContents) {
                    if (!item.types.includes("image/png")) {
                        throw new Error("Clipboard contains non-image data.");
                    }
                    const blob = await item.getType("image/png");
                    destinationImage.src = URL.createObjectURL(blob);
                    destinationImage.onload = () => {
                        this.context.drawImage(destinationImage, 100, 100);
                    }

                }
            } catch (error) {
                console.error(error.message);
            }
        }
        pasteImage().then(() => console.log('paste'));
    },
    download(_, args) {
        const { name, format } = JSON.parse(args);
        const tmp = document.createElement('canvas');
        const tmpCtx = tmp.getContext('2d');
        const tmpImage = new Image();
        const tmpUrl = this.canvas.buffer.toDataURL('image/' + format.label + '', 1.0)
            .replace('image/' + format.label + '', 'image/octet-stream');

        tmp.width = this.canvas.buffer.width;
        tmp.height = this.canvas.buffer.height;

        tmpCtx.clearRect(0, 0, this.dimensions.w, this.dimensions.h);
        tmpCtx.globalCompositeOperation = 'destination-out';
        tmpCtx.strokeStyle = this.palette.background;
        tmpCtx.fillStyle = this.palette.background;
        tmpCtx.lineWidth = this.palette.weight;
        tmpCtx.beginPath();

        tmpCtx.rect(0, 0, this.dimensions.w, this.dimensions.h);
        tmpCtx.fill();

        tmpImage.src = tmpUrl
        tmpImage.onload = () => {
            tmpCtx.drawImage(tmpImage, 0, 0);

            this.image = {
                name: name + '.' + format.extension,
                url: tmp.toDataURL('image/' + format.label + '', 1.0)
                    .replace('image/' + format.label + '', 'image/octet-stream'),
            };

            const link = document.createElement('a');

            link.download = this.image.name;
            link.href = this.image.url;

            link.click();
        }
    },
}

export default commands;