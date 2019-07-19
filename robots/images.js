const state = require('./state')
const google = require('googleapis').google
const customSerach = google.customsearch('v1')
const googleSearchCredentials = require('../credentials/google-search')
const imageDownloader = require('image-downloader')

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

    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)
    state.save(content) 
}

module.exports = robot