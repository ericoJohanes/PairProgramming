const errorHandler = (error) => {
    if ((error.name.match(/(validation)/gi))) {
        errors = error.errors.map(el => el.message)
        return errors
    }
}
const errorThrower = (message) => {
    return { name: 'validation', errors: [{ message }] }
}
const hourFormatter = (durationMin) => {
    let min, hour, formatted;
    min = durationMin % 60
    hour = Math.floor(durationMin / 60)
    min = `${min}`.length < 2 ? `0${min}` : min
    hour = `${hour}`.length < 2 ? `0${hour}` : hour
    formatted = `${hour}:${min}`

    return formatted
}

module.exports = { errorHandler, errorThrower, hourFormatter }