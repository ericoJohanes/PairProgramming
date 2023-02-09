module.exports = (password) => {
    let salt = bcryptjs.genSaltSync(7);
    let passHashed = bcryptjs.hashSync(password, salt)
    return passHashed
}