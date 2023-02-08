const express = require('express');
const Controller = require('./controllers');
const app = express()
const port = 3000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./'))

app.get('/', Controller.homepage)

app.listen(port, (err) => {
    err ? console.log(err) : console.log(`listening http://localhost:${port}`);
})