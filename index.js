const robots = {
    input: require('./robots/input'),
    text: require('./robots/text'),
    state: require('./robots/state')
}

start = async () => {
    robots.input()
    await robots.text()

    const content = robots.state.load()
    console.log(content)
}

start()