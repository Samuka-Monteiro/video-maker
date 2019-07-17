const robots = {
    input: require('./robots/input'),
    text: require('./robots/text'),
    state: require('./robots/state'),
    image: require('./robots/images'),
}

start = async () => {
    robots.input()
    await robots.text()
    await robots.image()

    const content = robots.state.load()
    //console.log(content)
}

start()