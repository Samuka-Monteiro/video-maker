const state = require('./state')
const google = require('googleapis').google
const customSerach = google.customsearch('v1')
const googleSearchCredentials = require('../credentials/google-search')
const imageDownloader = require('image-downloader')
const jimp = require('jimp');

robot = async () => {
    const content = state.load()

    downloadAndSave = (url, fileName) => imageDownloader.image({
        url, url,
        dest: `./content/${fileName}`
    })

    downloadAllImages = async content => {
        content.downloadedImages = []

        for (let i = 0; i < content.sentences.length; i++) {
            const images = content.sentences[i].images

            for (let j = 0; j < images.length; j++) {
                const imageUrl = images[j]
                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error('Image already downloaded')
                    }
                    await downloadAndSave(imageUrl, `${i}-original.png`)
                    content.downloadedImages.push(imageUrl)
                    console.log(`${i} ${j} Download with success: ${imageUrl}`)
                    break
                } catch (error) {
                    console.log(`${i} ${j} Error on download ${imageUrl}: ${error}`)
                }
            }
        }
    }

    fetchImagesOfAllSentences = async (content) => {
        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`
            sentence.images = await fetchGoogleAndReturnImagesLink(query)

            sentence.googleSearchQuery = query
        }
    }

    fetchGoogleAndReturnImagesLink = async (query) => {
        const response = await customSerach.cse.list({
            auth: googleSearchCredentials.apikey,
            cx: googleSearchCredentials.googleSearchEngineId,
            q: query,
            searchType: "image",
            imgSize: "huge",
            num: 2
        })

        const imageUrl = response.data.items.map((item) => item.link)

        return imageUrl
    }

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

    createSentenceImage = async (index, sentence) => {
        return new Promise((resolve, reject) => {
            const outputFile = `./content/${index}-sentence.png`

            let image = new jimp(1920, 1080, (err, image) => {
                if (err) throw err
            })

            jimp.loadFont(jimp.FONT_SANS_64_WHITE)
                .then(font => {
                    image.print(font, 0, 0, sentence, 1080)
                    return image
                }).then(image => {
                    image.write(outputFile)
                    console.log(`Sentence ${index} created`)
                    resolve()
                })

        })
    }

    createAllImagesSentences = async content => {
        for (let i = 0; i < content.sentences.length; i++) {
            await createSentenceImage(i, content.sentences[i].text)
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
    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)
    await convertAllImages(content)
    await createAllImagesSentences(content)
    await createYoutubeThumbnail()
    state.save(content) 
}

module.exports = robot