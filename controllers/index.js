const { User, Course, Category } = require('../models')

class Controller {
    static homepage(req, res) {
        User.findAll({ include: Category })
            .then(users => res.send(users))
            .catch(err => res.send(err))
    }
}

module.exports = Controller