const express = require('express')
const { handlebars } = require('hbs')
const time = require('./public/js/blog.js')

const app = express()
const port = 5000
let indexGlobal // save nilai variabel index card secara global
let isLogin = true

let blogs = [
    {
        namaProject : 'Project Data Dummy',
        content : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In voluptatum praesentium eum porro libero unde neque. Doloremque porro inventore praesentium fugit ipsum commodi dicta aliquid ea ad, eveniet maiores repudiandae?,',
        durasi : '3 month',
        startDate : '13 januari 2020',
        endDate : '14 maret 2020',
        bootstrap : 'fa-brands fa-bootstrap',
        javascript : 'fa-brands fa-js',
        react : 'fa-brands fa-react',
        node : 'fa-brands fa-node-js',
        // image : data.inputImage
    }
]



app.set('view engine', 'hbs') // set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set public path/folder agar file bisa dibaca oleh handlebars

handlebars.registerHelper('potong', function (aString) {
    return aString.slice(0,100)
})


app.use(express.urlencoded({extended: false}))// ENCODE DATA YANG ADA DI req.body (request.body) agar BISA DIAMBIL ISI OBJECTNYA

app.get('/', function(req, res) {

    let dataProject = blogs.map(function(list){
        return {
            ...list,
            isLogin,       
        }
    })

    res.render('index',{isLogin, blogs : dataProject}) //isLogin : isLogin, blogs : blogs (sebelumnya)
})

app.post('/', function(req, res) {
    let data = req.body
    
    let daftar = {
        namaProject : data.inputProject,
        startDate : time.ftime(data.inputStart),
        endDate :  time.ftime(data.inputEnd),
        content : data.inputContent,
        bootstrap : data.inputBootstrap,
        javascript : data.inputJs,
        react : data.inputReact,
        node : data.inputNode,
        image : data.inputImage,
        durasi : time.gtime(new Date(data.inputEnd) - new Date(data.inputStart))
    }
    
    blogs.push(daftar)
    console.log(blogs);

    res.redirect('/')
})
app.get('/add-project', function(req, res) {
    res.render('add-project')
})
app.get('/update/:index', function(req, res) {
    indexGlobal = req.params.index
    
    
    res.render('update',{blogs})
})

app.post('/update/', function(req, res) {
    let data = req.body

    let daftar = {
        namaProject : data.inputProject,
        startDate : time.ftime(data.inputStart),
        endDate :  time.ftime(data.inputEnd),
        content : data.inputContent,
        bootstrap : data.inputBootstrap,
        javascript : data.inputJs,
        react : data.inputReact,
        node : data.inputNode,
        image : data.inputImage,
        durasi : time.gtime(new Date(data.inputEnd) - new Date(data.inputStart))
    }
    blogs[indexGlobal] = daftar
    console.log(blogs);
    
    res.redirect('/')
})


app.get('/detail-project/:index', function(req, res) {
    
    console.log(req.params);

    let index = req.params.index
    let project = blogs[index]

    res.render('detail-project',project)
})

app.get('/delete-project/:index', function(req, res) {
    console.log(req.params.index);

    let index = req.params.index
    blogs.splice(index,1)
    res.redirect('/')
})

app.get('/contact', function(req, res) {
    res.render('contact')
})
app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})