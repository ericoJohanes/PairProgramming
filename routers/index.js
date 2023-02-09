const Controller = require('../controllers')
const router = require('express').Router()


router.get('/', Controller.home)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.login)
router.get('/logout', Controller.logout)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

//for login to see course
router.use(Controller.auth)

router.get('/registerDetail', Controller.userDetailForm)
router.post('/registerDetail', Controller.addUserDetail)
router.get('/courses', Controller.courses)
router.get('/courses/:id/courseDetail', Controller.courseDetail)
router.get('/courses/:CourseId/enroll/', Controller.enrollCourse)
router.get('/courses/add', (req, res, next) => {
    if (req.session.userRole == 'Teacher') {
        next()
    } else {
        let authNeed = 'only instructors can make course'
        res.redirect(`/courses?error=${authNeed}`)
    }
})

router.get('/courses/add', Controller.addForm)
router.post('/courses/add', Controller.addCourse)
router.get('/courses/:id/details', Controller.userDetail)


module.exports = router
