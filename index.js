const express = require('express')
const time = require('./public/js/blog.js')

const app = express()
const port = 5000

app.set('view engine', 'hbs') // set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set public path/folder agar file bisa dibaca oleh handlebars

app.use(express.urlencoded({extended: false}))// ENCODE DATA YANG ADA DI req.body (request.body) agar BISA DIAMBIL ISI OBJECTNYA

app.get('/', function(req, res) {
    res.render('index')
})
app.post('/', function(req, res) {
    let durasi = new Date(req.body.inputEnd) - new Date(req.body.inputStart)
    console.log(req.body);
    console.log(time.gtime(durasi));
})
app.get('/add-project', function(req, res) {
    res.render('add-project')
})

app.get('/contact', function(req, res) {
    res.render('contact')
})
app.get('/detail-project/:id', function(req, res) {
    
    let id = req.params.id

    console.log(req.params);
    res.render('detail-project', {
        blogs:{
            id:id,
            projectName:'dumbways apps 2020',
            startDate: '1 januari 2020',
            EndDate: '10 maret 2020',
            durasi: '3 bulan',
            desc : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil eius, numquam accusamus ipsa unde totam?...'
        }
    })
})
app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})