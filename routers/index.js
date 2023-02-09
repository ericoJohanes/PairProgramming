const Controller = require('../controllers')
const user = require('../models/user')
const router = require('express').Router()


router.get('/', Controller.home)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.login)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

//for login to see course
router.use((req,res,next) => {
    //use for later
    if(req.session.userId){
        next() 
    }else{
        let authNeed = `you haven't login yet!`
        res.redirect(`/login?error=${authNeed}`)
    }
})

router.get('/courses', Controller.courses)
router.get('/courses/:id/courseDetail', Controller.courseDetail)
//for students to enroll


router.get('/courses/:CourseId/enroll/', Controller.enrollCourse)

//for teacher to create course
router.get('/courses/add',(req,res,next) => {
    if(req.session.userRole == 'Teacher'){
        next()
    }else{
        let authNeed = 'only instructors can make course'
        res.redirect(`/courses?error=${authNeed}`)
    }
})

    // router.get('/courses/add', Controller.addForm)
    // router.post('/courses/add', Controller.addCourse)
    // router.get('/courses/:id/details', Controller.userDetail)


module.exports = router
