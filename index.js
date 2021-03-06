const robots = {
    input: require('./robots/input'),
    text: require('./robots/text'),
    state: require('./robots/state'),
    image: require('./robots/images'),
    video: require('./robots/video'),
}

start = async () => {
    robots.input()
    await robots.text()
    await robots.image()
    await robots.video()
}

start()

