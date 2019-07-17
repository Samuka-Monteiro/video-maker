const readline = require('readline-sync')
const robots = {
    text: require('./robots/text')
}

start = async () => {
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

    await robots.text(content)
    console.log(content)
}

start()