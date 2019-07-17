const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/credentials.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const nlu = new NaturalLanguageUnderstandingV1({
    username: "cLJUs97rNmoFCyDHvoD3MBBOZ0zCpnnBSE2G58haWxTw",
    password: "cLJUs97rNmoFCyDHvoD3MBBOZ0zCpnnBSE2G58haWxTw",
    iam_apikey: "cLJUs97rNmoFCyDHvoD3MBBOZ0zCpnnBSE2G58haWxTw",
    version: '2018-04-05',
    url: 'https://gateway-lon.watsonplatform.net/natural-language-understanding/api'
});

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

    limitMaximumSentences = content => content.sentences = content.sentences.slice(0, content.maximunSentences)

    fetchKeyWordsOfAllSentences = async (content) => {
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchWastonAndReturnKeywords(sentence.text)
        }
    }

    fetchWastonAndReturnKeywords = async (sentence) => {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error)
                    throw (error)

                const keywords = response.keywords.map((keyword) => keyword.text)

                resolve(keywords)
            })
        })
    }

    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeyWordsOfAllSentences(content)
}

module.exports = robot