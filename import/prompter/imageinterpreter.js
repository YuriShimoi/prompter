class PrompterImageInterpreter {
    static map(source, width, height) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = source;
            image.onload = () => {
                try {
                    let ctx = document.createElement("CANVAS").getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    let mapping = [];
            
                    let imageData = ctx.getImageData(0, 0, width, height);
                    let data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        let toHex = c => c < 16? '0' + c.toString(16): c.toString(16);
                        let rgb_map = {'red': data[i], 'green': data[i + 1], 'blue': data[i + 2]};
                        
                        mapping.push('#' + toHex(rgb_map.red) + toHex(rgb_map.green) + toHex(rgb_map.blue));
                    }
                    resolve(mapping);
                }
                catch {
                    reject(null);
                }
            };
        });
    }
}