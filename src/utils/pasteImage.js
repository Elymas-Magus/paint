const paste = () => {
    this.image = async () => {
        try {
            this.load();

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
                    this.loading = false;
                    // this.context.drawImage(destinationImage, 100, 100);
                }
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            this.stopLoading();
        }
    }

    return this;
}