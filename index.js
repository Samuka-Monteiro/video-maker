const readline = require('readline-sync')
start = () => {
    const content = {}

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

    content.seachTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    console.log(content)
}

start()