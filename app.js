const express = require('express');
const router = require('./routers');
const app = express()
const port = 3000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./'))
app.use(router)


app.listen(port, (err) => {
    err ? console.log(err) : console.log(`listening http://localhost:${port}`);
})