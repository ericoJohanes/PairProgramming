const { Course, User, UserDetail, StudentCourse } = require('../models')
const bcryptjs = require('bcryptjs')
const { errorHandler, errorThrower, hourFormatter } = require('../helpers')
class Controller {
    static home(req, res) {
        res.render('homepage')
    }
    static loginForm(req, res) {
        let { error } = req.query
        error = error || {}

        res.render('loginForm', { error })
    }
    static login(req, res) {
        let { email, password } = req.body

        if (!email || !password) {
            let error = 'all field must be filled'
            throw errorThrower(error)
        } else {
            User.findOne({ where: { email } })
                .then(user => {
                    if (user) {
                        let validPass = bcryptjs.compareSync(password, user.password)
                        if (validPass) {
                            req.session.userId = user.id;
                            req.session.userRole = user.role;
                            res.redirect('/userDetail')
                        } else {
                            let error = 'password wrong'
                            throw errorThrower(error)
                        }
                    } else {
                        let cantFind = 'No User Has Found'
                        throw errorThrower(cantFind)
                    }
                })
                .catch(err => {
                    let errors = errorHandler(err)
                    errors ? res.redirect(`/login?error=${errors}`) : res.send(err)
                })
        }
    }
    static auth(req, res, next) {
        if (req.session.userId) {
            next()
        } else {
            let authNeed = `you haven't login yet!`
            res.redirect(`/login?error=${authNeed}`)
        }
    }
    static registerForm(req, res) {
        res.render('registerForm')
    }

    static register(req, res) {
        let { email, password, role } = req.body

        User.create({ email, password, role })
            .then(_ => {
                res.redirect('/login')
            })
            .catch(err => {
                let errors = errorHandler(err)
                errors ? res.redirect(`/register?error=${errors}`) : res.send(err)
            })
    }
    static userDetailForm(req, res) {
        let UserId = req.session.userId;

        UserDetail.findOne({ where: { UserId } })
            .then(userDetail => {
                if (!userDetail) {
                    res.render('detailForm')
                } else {
                    res.redirect('/courses')
                }
            })
            .catch(err => res.send(err))
    }
    static addUserDetail(req, res) {
        let UserId = req.session.userId;
        let { fullName, profilePicture, school, dateOfBirth, about } = req.body;

        UserDetail.create({ fullName, profilePicture, school, dateOfBirth, about, UserId })
            .then(_ => res.redirect('/courses'))
            .catch(err => {
                let errors = errorHandler(err)
                errors ? res.redirect(`/userDetail?error=${errors}`) : res.send(err)
            })
    }
    static courses(req, res) {
        Course.findAll({
            include: User
        })
            .then(courses => {
                res.render('courses', { courses, hourFormatter })
            })
            .catch(err => res.send(err))
    }
    static courseDetail(req, res) {
        let { id } = req.params;
        let course;

        Course.findByPk(+id, {
            include: { model: User }
        })
            .then(data => {
                course = data;
                return User.findByPk(course.TeacherId, {
                    include: UserDetail
                })
            })
            .then(teacher => {
                res.render('courseDetail', { teacher, course, hourFormatter })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static addForm(req, res) {
        let { error } = req.query;
        error = error || {}

        res.render('addForm', { error })
    }
    static addCourse(req, res) {
        let { name, level, duration, description } = req.body;
        let id = req.session.userId;

        Course.create({ name, level, duration, description, 'TeacherId': +id })
            .then(_ => res.redirect('/courses'))
            .catch(err => {
                let errors = errorHandler(err)
                errors ? res.redirect(`/courses/add?error=${errors}`) : res.send(err)
            })
    }
    static enrollCourse(req, res) {
        let { CourseId } = req.params;
        CourseId = +CourseId
        let StudentId = req.session.userId;

        if (req.session.userRole !== 'Student') {
            let authNeed = 'Only student can enroll in course'
            return res.redirect(`/courses/${CourseId}/courseDetail?error=${authNeed}`)
        } else {
            Course.findByPk(CourseId)
                .then(course => {
                    if (!course) {
                        let errorMsg = 'Course not Found'
                        throw errorHandler(errorMsg)
                    }
                    return StudentCourse.create({ StudentId, CourseId })
                })
                .then(_ => res.redirect(`/courses`))
                .catch(err => {
                    let errors = errorHandler(err)
                    errors ? res.redirect(`/courses/${CourseId}/courseDetail?error=${errors}`) : res.send(err)
                })
        }
    }
    static userDetail(req, res) {
        let { id } = req.params;

        User.findByPk(+id, { include: UserDetail })
            .then(user => {
                res.render('userDetail', { user })
            })

    }
}

module.exports = Controller
