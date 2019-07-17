const state = require('./state')
const google = require('googleapis').google
const customSerach = google.customsearch('v1')
const googleSearchCredentials = require('../credentials/google-search')

robot = async () => {
    const content = state.load()

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
    state.save(content)
}

module.exports = robot