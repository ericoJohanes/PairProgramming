const Controller = require('../controllers')
const router = require('express').Router()


router.get('/', Controller.home)
router.get('/login', Controller.login)
router.get('/register', Controller.register)
router.get('/courses', Controller.courses)



router.get('/courses/add', Controller.addForm)
router.post('/courses/add', Controller.addCourse)
router.get('/courses/enroll', Controller.enrollForm)
router.post('/courses/enroll', Controller.enrollCourse)
router.get('/courses/:id/details', Controller.userDetail)


module.exports = router
