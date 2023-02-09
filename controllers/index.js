const { Course, User, UserDetail } = require('../models')
const bcryptjs = require('bcryptjs')

class Controller {
    static home(req, res) {
        res.render('homepage')
    }
    static loginForm(req, res) {
        res.render('loginForm')
    }
    static login(req, res) {
        let { email, password } = req.body

        if (!email || !password) {
            let error = 'all field must be filled'
            res.redirect(`/login?error=${error}`)
        } else {
            User.findOne({ where: { email } })
                .then(user => {
                    if (user) {
                        const validPass = bcryptjs.compareSync(password, user.password)
                        if (validPass) {
                            res.redirect('/courses')
                        }
                    } else {
                        let cantFind = 'No User Has Found'
                        res.redirect(`/login?error=${cantFind}`)
                    }
                })
                .catch(err => res.send(err))
        }
    }
    static registerForm(req, res) {
        res.render('registerForm')
    }
    static register(req, res) {
        let { email, password, role } = req.body

        User.create({ email, password, role })
            .then(_ => {
                res.redirect('/courses')
            })
            .catch(err => res.send(err))
    }
    static courses(req, res) {
        Course.findAll({
            include: User,
        })
            .then(courses => {
                res.render('courses', { courses })
            })
            .catch(err => res.send(err))
    }
    static courseDetail(req, res) {

        Course.findByPk()
    }
    static addForm(req, res) {
        res.render('addForm')
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
