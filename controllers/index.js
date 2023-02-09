
class Controller {
    static homepage(req, res) {
        User.findAll({ include: Category })
            .then(users => res.send(users))
            .catch(err => res.send(err))
    }
    static test(req, res) {
        User.findAll({ include: UserDetail })
            .then(users => res.send(users))
            .catch(err => res.send(err))
    }
}

module.exports = Controller