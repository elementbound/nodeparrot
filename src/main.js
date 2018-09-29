const termkit = require('terminal-kit')
const jpeg = require('jpeg-js')
const fs = require('fs')

const term = termkit.terminal

const range = n => 
    [...Array(n).keys()]

const quantize = q => v => 
    ((v / q) | 0) * q

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

const compileFrame = term => frame => {
    let aspect = term.width / term.height / 2
    let halfPixel = 0.5 / term.height / 2

    return range(term.width * term.height)
        .map(i => [i % term.width, i / term.width | 0])
        .map(([x,y]) => [x / term.width, y / term.height])
        .map(([u,v]) => [(u - 0.25) * aspect, v])
        .map(uv => frame.sample(...uv).map(quantize(32)))
        .map(color => term.str.bgColorRgb(...color, ' '))
        .join('')
}

const main = () => {
    let frames = range(10)
        .map(i => {
            console.log(`Loading frame ${i}`)
            return loadFrame(i)
        })
        .map(compileFrame(term))

    term.fullscreen()
    for(let i = 0; true; i = (i+1) % 10) {
        term.moveTo(1,1)
        term(frames[i])
    }
}

main()