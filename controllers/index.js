const { Course, User, UserDetail, StudentCourse } = require('../models')
const bcryptjs = require('bcryptjs')
const { errorHandler, errorThrower, hourFormatter } = require('../helpers')
const { Op } = require('sequelize')

class Controller {
    static home(req, res) {
        res.render('homepage')
    }
    static loginForm(req, res) {
        let { errors } = req.query
        errors = errors || null

        res.render('loginForm', { errors })
    }
    static login(req, res) {
        let { email, password } = req.body

        if (!email || !password) {
            let errors = 'all field must be filled'
            throw errorThrower(errors)
        } else {
            User.findOne({ where: { email } })
                .then(user => {
                    if (user) {
                        let validPass = bcryptjs.compareSync(password, user.password)
                        if (validPass) {
                            req.session.userId = user.id;
                            req.session.userRole = user.role;
                            res.redirect('/registerDetail')
                        } else {
                            let errors = 'password wrong'
                            throw errorThrower(errors)
                        }
                    } else {
                        let cantFind = 'No User Has Found'
                        throw errorThrower(cantFind)
                    }
                })
                .catch(err => {
                    let errors = errorHandler(err)
                    if (errors) {
                        res.redirect(`/login?errors=${errors}`)
                    } else {
                        res.send(err)
                    }
                })
        }
    }
    static auth(req, res, next) {
        if (req.session.userId) {
            next()
        } else {
            let authNeed = `you haven't login yet!`
            res.redirect(`/login?errors=${authNeed}`)
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
                if (errors) {
                    res.redirect(`/register?errors="${errors}"`)
                } else {
                    res.send(err)
                }
            })
    }
    static userDetailForm(req, res) {
        let UserId = req.session.userId;
        let { errors } = req.query
        errors = errors || null

        UserDetail.findOne({ where: { UserId } })
            .then(userDetail => {
                if (!userDetail) {
                    res.render('detailForm', { errors })
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
                if (errors) {
                    res.redirect(`/registerDetail?errors="${errors}"`)
                } else {
                    res.send(err)
                }
            })
    }
    static courses(req, res) {
        let UserId = req.session.userId
        let { filter, errors } = req.query
        errors = errors || null
        let query = { include: User }
        filter ? query.where = {
            name: { [Op.iLike]: `%${filter}%` }
        } : null

        Course.findAll(query)
            .then(courses => {
                res.render('courses', { courses, hourFormatter, UserId, errors })
            })
            .catch(err => res.send(err))
    }
    static courseDetail(req, res) {
        let { id } = req.params;
        let course;
        let { errors } = req.query
        errors = errors || null


        Course.findByPk(+id, {
            include: { model: User }
        })
            .then(data => {
                course = data;
                return User.findByPk(course.TeacherId, { include: UserDetail })
            })
            .then(teacher => {
                res.render('courseDetail', { teacher, course, hourFormatter, errors })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static addForm(req, res) {
        let { errors } = req.query;
        errors = errors || null

        res.render('addForm', { errors })
    }
    static addCourse(req, res) {
        let { name, level, duration, description } = req.body;
        let id = req.session.userId;
        let role = req.session.userRole;

        if (role !== 'Teacher') {
            let errors = errorThrower('Only Teacher Can Create Course!')
            throw errors
            // return res.redirect(`/courses?errors=${errors}`)
        }
        Course.create({ name, level, duration, description, 'TeacherId': +id })
            .then(_ => res.redirect('/courses'))
            .catch(err => {
                let errors = errorThrower(err)
                if (errors) {
                    res.redirect(`/courses?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }
    static enrollCourse(req, res) {
        let { id } = req.params;
        let StudentId = req.session.userId;
        let CourseId = id

        if (req.session.userRole !== 'Student') {
            let errors = 'Only student can enroll in course'
            res.redirect(`/courses/${CourseId}/courseDetail?errors=${errors}`)
        } else {
            Course.findByPk(+id)
                .then(course => {
                    if (!course) {
                        let errorsMsg = 'Course not Found'
                        let errors = errorThrower(errorsMsg)
                        res.redirect(`/courses/${CourseId}/courseDetail?errors=${errors}`)
                    } else {
                        return StudentCourse.create({ StudentId, CourseId })
                    }
                })
                .then(_ => res.redirect(`/ courses`))
                .catch(err => {
                    let errors = errorHandler(err)
                    if (errors) {
                        res.redirect(`/courses/${CourseId}/courseDetail?errors=${errors}`)
                    } else {
                        res.send(err)
                    }
                })
        }
    }
    static userDetail(req, res) {
        let { id } = req.params;
        let { errors } = req.query;
        errors = errors || null

        UserDetail.findOne({
            where: { UserId: +id }
        })
            .then(user => {
                const dateConverter = UserDetail.dateConvert
                res.render('userDetail', { user, errors, dateConverter })
            })
            .catch(err => res.send(err))
    }
    static editForm(req, res) {
        let id = req.session.userId
        let { errors } = req.query;
        errors = errors || null

        UserDetail.findOne({
            where: { UserId: id }
        })
            .then(userDetail => {
                const dateConverter = UserDetail.dateConvert

                res.render('editForm', { userDetail, errors, dateConverter })
            })
    }
    static editDetail(req, res) {
        let { fullName, profilePicture, school, dateOfBirth, about } = req.body;
        let { id } = req.params;

        UserDetail.update({ fullName, profilePicture, school, dateOfBirth, about }, { where: { UserId: +id } })
            .then(_ => res.redirect(`/user/${id}/details`))
            .catch(err => {
                let errors = errorHandler(err)
                if (errors) {
                    res.redirect(`/user/${id}/edit?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/')
    }
    static deleteCourse(req, res) {
        let { id } = req.params
        let role = req.session.userRole

        if (role != 'Teacher') {
            let errors = 'Only Teacher can delete Course'
            return res.redirect(`/courses/${id}/courseDetail?errors=${errors}`)
        }
        StudentCourse.destroy({ where: { CourseId: id } })
            .then(_ => {
                return Course.findByPk(+id)
            })
            .then(_ => {
                return Course.destroy({ where: { id } })
            })
            .then(_ => res.redirect('/courses'))
            .catch(err => {
                let errors = errorHandler(err)
                if (errors) {
                    return res.redirect(`/courses/${id}/courseDetail?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }
}

module.exports = Controller
