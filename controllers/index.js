const { Course, User, UserDetail } = require('../models')
class Controller {
    static home(req, res) {

    }
    static login(req, res) {

    }
    static register(req, res) {

    }
    static courses(req, res) {
        Course.findAll({ include: User })
            .then(courses => {
                res.send(courses)
            })
            .catch(err => res.send(err))
    }
    static addForm(req, res) {


    }
    static addCourse(req, res) {

    }
    static enrollForm(req, res) {

    }
    static enrollCourse(req, res) {

    }
    static userDetail(req, res) {

    }
}

module.exports = Controller