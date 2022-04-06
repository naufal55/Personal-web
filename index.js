const express = require('express')
const { handlebars } = require('hbs')
const time = require('./public/js/blog.js')
const db = require('./connection/db')

const app = express()
const port = 5000
let indexGlobal // save nilai variabel index card secara global
let isLogin = true

app.set('view engine', 'hbs') // set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set public path/folder agar file bisa dibaca oleh handlebars

// slicing dskripsi project sampai 100 kata
handlebars.registerHelper('potong', function (aString) { 
    const r = (aString || '').slice(0,100); //pakai OR untuk menghindar value undefined (undefined OR string) = string
    return r
})

// untuk dapatin durasi waktu
handlebars.registerHelper('durasi', function (edate,sdate) { 
    const duration = new Date(edate) - new Date(sdate)
    return time.gtime(duration)
})

//untuk buat format tanggal
handlebars.registerHelper('tgllengkap', function (date) { 
    
    return time.ftime(date)
})

app.use(express.urlencoded({extended: false}))// ENCODE DATA YANG ADA DI req.body (request.body) agar BISA DIAMBIL ISI OBJECTNYA

app.get('/', function(req, res) {

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query('SELECT * FROM tb_projects', function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 

            console.log(result.rows);
            let data=result.rows
            
            data = data.map(function (list) {
                return {
                    ...list, //export isi dari row sql di var data
                    isLogin //islogin : islogin 
                }
            })
            res.render('index',{isLogin,blogs: data}) //isLogin : isLogin, blogs : blogs (sebelumnya)


        })

    })

})

app.get('/detail-project/:index', function(req, res) {
    
    console.log(req.params);

    let index = Number(req.params.index)+1
    //console.log(index);

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query('SELECT id, name, start_date, end_date, description, technologies, image FROM public.tb_projects WHERE id ='+index, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 

            console.log(result.rows);
            let data=result.rows
            console.log(data[0].name);
            res.render('detail-project',{blogs: data}) //isLogin : isLogin, blogs : blogs (sebelumnya)
        })

    })

   
})

app.post('/', function(req, res) {
    // let data = req.body
    
    // let daftar = {
    //     namaProject : data.inputProject,
    //     startDate : time.ftime(data.inputStart),
    //     endDate :  time.ftime(data.inputEnd),
    //     content : data.inputContent,
    //     bootstrap : data.inputBootstrap,
    //     javascript : data.inputJs,
    //     react : data.inputReact,
    //     node : data.inputNode,
    //     image : data.inputImage,
    // }
    
    // blogs.push(daftar)
    // console.log(blogs);

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

app.get('/delete-project/:index', function(req, res) {

    res.redirect('/')
})

app.get('/contact', function(req, res) {
    res.render('contact')
})
app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})