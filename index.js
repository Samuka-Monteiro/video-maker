const robots = {
    input: require('./robots/input'),
    text: require('./robots/text'),
    state: require('./robots/state'),
    image: require('./robots/images'),
    voice: require('./robots/voice'),
    video: require('./robots/video'),
}

start = async () => {
    robots.input()
    await robots.text()
    await robots.image()
    await robots.voice()
    await robots.video()
}

start()