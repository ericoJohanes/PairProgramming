const Controller = require('../controllers')
const router = require('express').Router()


router.get('/', Controller.home)
router.get('/login', Controller.login)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

//for login to see course


router.get('/courses', Controller.courses)

//for students to enroll

router.get('/courses/enroll', Controller.enrollForm)
router.post('/courses/enroll', Controller.enrollCourse)

//for teacher to create course

router.get('/courses/add', Controller.addForm)
router.post('/courses/add', Controller.addCourse)
router.get('/courses/:id/details', Controller.userDetail)


module.exports = router
