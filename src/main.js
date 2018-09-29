const termkit = require('terminal-kit')
const jpeg = require('jpeg-js')
const fs = require('fs')

const term = termkit.terminal

const loadFrame = id => {
    let filename = `frames/${id}.jpg`
    let imageData = fs.readFileSync(filename)

    let image = jpeg.decode(imageData, true)
    image.get = (x,y) => {
        if(x < 0 || x >= image.width || 
            y < 0 || y >= image.height)
            return [0,0,0]

        let offset = ((y * image.width) + x) * 4
        return image.data.slice(offset, offset+3)
    }

    image.sample = (u,v) => 
        image.get((u * image.width) | 0, (v * image.height) | 0)

    return image
}

const printImage = image => {
    for(let y = 0; y < image.height; y++) {
        for(let x = 0; x < image.width; x++) {
            let color = image.get(x,y)
                .map(v => ((v/8)|0) * 8)

            term.bgColorRgb(...color)('  ')
        }

        term('\n')
    }
}

const main = () => {
    let frames = [...new Array(10).keys()]
        .map((_,i) => i)
        .map(i => {
            console.log(`Loading frame ${i}`,)
            return loadFrame(i)
        })

    term.fullscreen()
    for(let i = 0; true; i = (i+1) % 10) {
        term.moveTo(1,1)
        
        let frame = frames[i];
        let aspect = term.width / term.height / 2;

        for(let y = 0; y < term.height; ++y) {
            for(let x = 0; x < term.width; ++x) {
                let uv = [x/term.width, y/term.height]
                uv[0] = (uv[0] - 0.25) * aspect
                let color = frame.sample(...uv)
                    .map(v => ((v/32)|0) * 32)

                term.bgColorRgb(...color)(' ')
            }
        }

        term.styleReset()
    }
}

main()