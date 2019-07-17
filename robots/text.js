const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/credentials.json').apiKey
const sentenceBoundaryDetection = require('sbd')

robot = async (content) => {

    fetchContentFromWikipedia = async (content) => {
        const algorithmiaAuthenticaticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticaticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediacontent = wikipediaResponde.get()

        content.sourceContentOriginal = wikipediacontent.content
    }

    sanitizeContent = (content) => {
        removeBlankLinesAndMarkdown = (text) => {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })

            return withoutBlankLinesAndMarkdown.join(' ')
        }

        removeDatesInParentheses = text => text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')

        breakContentIntoSentences = (content) => {
            content.sentences = []
            
            const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSinitized)
            sentences.forEach(sentence => {
                content.sentences.push({
                    text: sentence,
                    keywords: [],
                    images: []
                })
            });
        }

        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSinitized = withoutDatesInParentheses
    }

    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
}

module.exports = robot