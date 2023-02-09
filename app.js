const express = require('express');
const router = require('./routers');
const session = require('express-session')
const app = express()
const port = 3000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./'))
app.use(session({
    secret:'hehe cookiess',
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        sameSite:true
    }
}))
app.use(router)


app.listen(port, (err) => {
    err ? console.log(err) : console.log(`listening http://localhost:${port}`);
})