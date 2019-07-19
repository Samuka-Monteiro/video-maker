const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const state = require('./state')
const fs = require('fs')

const textToSpeech = new TextToSpeechV1({
    iam_apikey: "bweIOXbdg7H9AFW4N-IMfkrhOQS4xleXFD86-wN76Scs",
    url: 'https://gateway-lon.watsonplatform.net/text-to-speech/api'
});

robot = async () => {
    const content = state.load()

    turnSentencesInVoice = async (sentence, index) => {
        return new Promise((resolve, reject) => {
            const synthesizeParams = {
                text: sentence,
                accept: 'audio/mp3',
                voice: 'en-US_AllisonVoice',
            };

            textToSpeech.synthesize(synthesizeParams)
                .then(audio => {
                    audio.pipe(fs.createWriteStream(`${index}.mp3`))
                    console.log(`Creating audio ${index}`)
                    resolve()
                })
                .catch(err => {
                    console.log('error:', err);
                });
        })
    }

    getSentences = async content => {
        for (const index of content.sentences.keys()) {
            await turnSentencesInVoice(content.sentences[index].text, index)
        }
    }

    await getSentences(content)
}

module.exports = robot