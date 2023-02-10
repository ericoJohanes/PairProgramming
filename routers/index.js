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
router.get('/courses/add', Controller.auth)
router.get('/courses/add', Controller.addForm)
router.post('/courses/add', Controller.addCourse)
router.get('/courses/:id/courseDetail', Controller.courseDetail)
router.get('/courses/:id/enroll', Controller.enrollCourse)
router.get('/courses/:id/delete', Controller.deleteCourse)
router.get('/user/:id/details', Controller.userDetail)
router.get('/user/:id/details', Controller.userDetail)
router.get('/user/:id/edit', Controller.editForm)
router.post('/user/:id/edit', Controller.editDetail)


module.exports = router
