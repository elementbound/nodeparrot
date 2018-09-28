const chalk = require('chalk')
const jpeg = require('jpeg-js')
const fs = require('fs')

const pixel = rgb => 
    process.stdout.write(chalk.bgRgb(...rgb)(' '))

const loadFrame = id => {
    let filename = `frames/${id}.jpg`
    let imageData = fs.readFileSync(filename)

    let image = jpeg.decode(imageData, true)
    image.get = (x,y) => {
        let offset = ((y * image.width) + x) * 4
        return image.data.slice(offset, offset+3)
    }

    return image
}

const printImage = image => {
    for(let y = 0; y < image.height; y++) {
        for(let x = 0; x < image.width; x++) {
            let color = image.get(x,y)

            pixel(color)
            pixel(color)
        }

        process.stdout.write('\n')
    }
}

const cup = (x,y) => 
    process.stdout.write(`\x1B[${x};${y}f`)

const main = () => {
    chalk.level = 1
    console.log(`Chalk level: ${chalk.level}`)

    let frames = [...new Array(10).keys()]
        .map((_,i) => i)
        .map(i => {
            console.log(`Loading frame ${i}`,)
            return loadFrame(i)
        })

    for(let i = 0; true; i = (i+1) % 10) {
        cup(0,0)
        printImage(frames[i])
    }
}

main()