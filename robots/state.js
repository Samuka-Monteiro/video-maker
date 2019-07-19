const fs = require('fs')
const contentFilePath = './content.json'
const scriptFilePath = './content/after-effects-script.js'

save = content => {
    const contentString = JSON.stringify(content)
    return fs.writeFileSync(contentFilePath, contentString)
}

saveScript = content => {
    let contentString = {}
    contentString.searchTerm = content.searchTerm
    contentString.prefix = content.prefix
    contentString.sentences = content.sentences

    const scriptString = `var content = ${JSON.stringify(contentString)}`
    return fs.writeFileSync(scriptFilePath, scriptString)
}

load = () => {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
    const contentJson = JSON.parse(fileBuffer)
    return contentJson
}

module.exports = {
    save,
    saveScript,
    load,
}