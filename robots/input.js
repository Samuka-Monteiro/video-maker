const readline = require('readline-sync')
const state = require('./state')

robot = () => {
    const content = {
        maximunSentences: 7
    }

    askAndReturnSearchTerm = () => readline.question('Type a Wikipedia search term: ')

    askAndReturnPrefix = () => {
        const prefixes = [
            'Who is',
            'What is',
            'The history of'
        ]
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')

        return prefixes[selectedPrefixIndex]
    }

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    state.save(content)
}

module.exports = robot