const jimp = require('jimp')
const state = require('./state')
const spawn = require('child_process').spawn
const path = require('path')
const rootPath = path.resolve(__dirname, '..')

robot = async () => {
    const content = state.load()

    convertImage = async (index) => {
        return new Promise((resolve, reject) => {
            const inputFile = `./content/${index}-original.png`
            const outputFile = `./content/${index}-converted.png`
            const width = 1920
            const height = 1080

            jimp.read(inputFile).then(image => {
                image
                    .clone()
                    .resize(width, height)
                    .write(outputFile);

                console.log(`Image ${index} resized`)
                resolve()
            }).catch(err => {
                console.error(err);
            });

        })
    }

    convertAllImages = async content => {
        for (let i = 0; i < content.sentences.length; i++) {
            await convertImage(i)
        }
    }

    createYoutubeThumbnail = async () => {
        return new Promise((resolve, reject) => {
            jimp.read('./content/0-converted.png').then(image => {
                image
                    .clone()
                    .write('./content/youtube-thumbnail.jpg');

                console.log(`Creating YouTube thumbnail`)
                resolve()
            }).catch(err => {
                console.error(err);
            });
        })
    }

    createAfterEffectScript = async content => state.saveScript(content)

    renderVideoWihtAfterEffects = async () => {
        return new Promise((resolve, reject) => {
            const aerenderFilePath = 'C:/Program Files/Adobe/Adobe After Effects CC 2018/Support Files/aerender'
            const templateFilePath = 'C:/Users/samue/ui_coding/back-end/video-maker/templates/1/template.aep'
            const destinationFilePath = 'C:/Users/samue/ui_coding/back-end/video-maker/content/output.mov'

            console.log("Starting After Effects")

            const aerender = spawn(aerenderFilePath, [
                '-comp', 'main',
                '-project', templateFilePath,
                '-output', destinationFilePath
            ])

            aerender.stdout.on('data', (data) => {
                process.stdout.write(data)
            })

            aerender.on('close', () => {
                console.log("After Effects closed")
                resolve()
            })
        })
    }

    await convertAllImages(content)
    await createYoutubeThumbnail()
    await createAfterEffectScript(content)
    await renderVideoWihtAfterEffects()
}

module.exports = robot