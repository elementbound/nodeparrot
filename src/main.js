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

const main = () => {
    chalk.level = 1
    console.log(`Chalk level: ${chalk.level}`)

    let frame = loadFrame(0)
    printImage(frame)
}

main()