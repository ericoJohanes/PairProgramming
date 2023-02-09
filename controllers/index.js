const { Course, User, UserDetail, StudentCourse } = require('../models')
const bcryptjs = require('bcryptjs')
const { errorHandler, errorThrower, hourFormatter } = require('../helpers')
const { Op } = require('sequelize')


class Controller {
    static home(req, res) {
        res.render('homepage')
    }
    static loginForm(req, res) {
        let { error } = req.query
        error = error || null

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
                            res.redirect('/registerDetail')
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
        let { error } = req.query
        error = error || null

        UserDetail.findOne({ where: { UserId } })
            .then(userDetail => {
                if (!userDetail) {
                    res.render('detailForm', { error })
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
        let UserId = req.session.userId
        let { filter, error } = req.query
        error = error || null
        let query = { include: User }
        filter ? query.where = {
            name: { [Op.iLike]: `%${filter}%` }
        } : null

        Course.findAll(query)
            .then(courses => {
                res.render('courses', { courses, hourFormatter, UserId, error })
            })
            .catch(err => res.send(err))
    }
    static courseDetail(req, res) {
        let { id } = req.params;
        let course;
        let { error } = req.query
        error = error || null


        Course.findByPk(+id, {
            include: { model: User }
        })
            .then(data => {
                course = data;
                return User.findByPk(course.TeacherId, { include: UserDetail })
            })
            .then(teacher => {
                res.render('courseDetail', { teacher, course, hourFormatter, error })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static addForm(req, res) {
        let { error } = req.query;
        error = error || null

        res.render('addForm', { error })
    }
    static addCourse(req, res) {
        let { name, level, duration, description } = req.body;
        let id = req.session.userId;
        let role = req.session.userRole;

        if (role !== 'Teacher') {
            throw errorThrower('Only Teacher Can Create Course!')
        }
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
            throw errorHandler(authNeed)
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
        let { error } = req.query;
        error = error || null

        UserDetail.findOne({
            where: { UserId: +id }
        })
            .then(user => {
                const dateConverter = UserDetail.dateConvert
                res.render('userDetail', { user, error, dateConverter })
            })
            .catch(err => res.send(err))
    }
    static editForm(req, res) {
        let id = req.session.userId
        let { error } = req.query;
        error = error || null

        UserDetail.findOne({
            where: { UserId: id }
        })
            .then(userDetail => {
                const dateConverter = UserDetail.dateConvert

                res.render('editForm', { userDetail, error, dateConverter })
            })

    }
    static editDetail(req, res) {
        let { fullName, profilePicture, school, dateOfBirth, about } = req.body;
        let { id } = req.params;

        UserDetail.update({ fullName, profilePicture, school, dateOfBirth, about }, { where: { UserId: +id } })
            .then(_ => res.redirect(`/user/${id}/details`))
            .catch(err => {
                let errors = errorHandler(err)
                errors ? res.redirect(`/user/${id}/edit?error=${errors}`) : res.send(err)
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
            throw errorThrower('Only Teacher can delete Course')
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
                errors ? res.redirect(`/courses/${id}/courseDetail?error=${errors}`) : res.send(err)
            })
    }
}

module.exports = Controller
