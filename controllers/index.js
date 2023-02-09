const { Course, User, UserDetail,StudentCourse } = require('../models')
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
                        let validPass = bcryptjs.compareSync(password, user.password)
                        if (validPass) {
                            req.session.userId = user.id;
                            req.session.userRole = user.role;
                            res.redirect('/courses')
                        }else{
                            let error = 'password wrong'
                            res.redirect(`/login?error=${error}`)
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
                res.redirect('/login')
            })
            .catch(err => res.send(err))
    }
    static courses(req, res) {
        Course.findAll({
            include: User
        })
         .then(courses => {
            res.render('courses', { courses })
          })
          .catch(err => res.send(err))
    }
    static courseDetail(req, res) {
        let {id} = req.params;
        let course;

        Course.findByPk(+id, {
            include:{
                model:User,
            }
        })
        .then(data => {
            course = data;
            return User.findByPk(course.TeacherId, {
                include: UserDetail
            })
        })
        .then(teacher => {
            res.render('courseDetail', {teacher,course})
        })
        .catch(err => {
            res.send(err)
        })
    }
    static addForm(req, res) {
        res.render('addForm')
    }
    static addCourse(req, res) {
        res.render('addForm')
    }
    static enrollCourse(req, res) {
        let {CourseId} = req.params;
        CourseId = +CourseId
        let StudentId = req.session.userId;
        if(req.session.userRole !== 'Student'){
            let authNeed = 'Only student can enroll in course'
            return res.redirect(`/courses/${CourseId}/courseDetail?error=${authNeed}`)
        }        
            Course.findByPk(CourseId)
            .then(course => {
                if(!course){
                    throw 'no course found'
                }
                return StudentCourse.create({StudentId, CourseId})
            })
            .then(_ => res.redirect(`/courses`))
            .catch(err => res.send(err))
    }
    static userDetail(req, res) {
        let {id} = req.params;

        User.findByPk(+id, {include: UserDetail})
        .then(user => {
            res.render('userDetail', {user})
        })
    }
}

module.exports = Controller
