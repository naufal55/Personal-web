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

            
            let data=result.rows
            
            data = data.map(function (list) {
                return {
                    ...list, //export isi dari row sql di var data
                    description : list.description.slice(0,100)+". . .",
                    isLogin //islogin : islogin 
                }
            })
            console.log(data);
            res.render('index',{isLogin,blogs: data}) //isLogin : isLogin, blogs : blogs (sebelumnya)


        })

    })

})

app.get('/detail-project/:id', function(req, res) {
    
    console.log(req.params);

    let id = req.params.id
    //console.log(index);

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query('SELECT * FROM tb_projects WHERE id ='+id, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 

            console.log('ini isi result',result.rows);

            let data=result.rows
            // console.log(data[0].name);
            res.render('detail-project',{blogs: data}) //isLogin : isLogin, blogs : blogs (sebelumnya)
        })

    })

   
})


app.post('/add-project', function(req, res) {

    let data = req.body
    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database
        
        if (!data.inputBootstrap) {
            data.inputBootstrap = ''
        }
        if (!data.inputJs) {
            data.inputJs = ''
        }
        if (!data.inputReact) {
            data.inputReact = ''
        }
        if (!data.inputNode) {
            data.inputNode = ''
        }
        

        client.query(`INSERT INTO public.tb_projects(
            name, start_date, end_date, description, technologies, image)
           VALUES ( '${data.inputProject}', '${data.inputStart}', '${data.inputEnd}', '${data.inputContent}',
             '{"${data.inputBootstrap}","${data.inputJs}","${data.inputReact}","${data.inputNode}"}', '${data.inputImage}')`, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 
            
            res.redirect('/')
        })

    })
    
})

app.post('/update', function(req, res) {
    // let id = req.params.id
    let data = req.body

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        if (!data.inputBootstrap) {
            data.inputBootstrap = ''
        }
        if (!data.inputJs) {
            data.inputJs = ''
        }
        if (!data.inputReact) {
            data.inputReact = ''
        }
        if (!data.inputNode) {
            data.inputNode = ''
        }

        client.query(`UPDATE public.tb_projects SET 
            name='${data.inputProject}',
            start_date='${data.inputStart}',
            end_date='${data.inputEnd}',
            description='${data.inputContent}',
            technologies='{"${data.inputBootstrap}","${data.inputJs}","${data.inputReact}","${data.inputNode}"}',
            image='${data.inputImage}'
            WHERE id = ${indexGlobal}`, function(err, result) {
                if (err) throw err // kondisi untuk menampilkan error query 
                done() 
            
                res.redirect('/')
            })
    })

})
app.get('/update/:id', function(req, res) {
    indexGlobal = req.params.id
    
    res.render('update')
})
app.get('/add-project', function(req, res) {
    res.render('add-project')
})

app.get('/delete-project/:id', function(req, res) {

    let id = req.params.id
    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query(`DELETE FROM public.tb_projects WHERE id = ${id}`, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 

            res.redirect('/')
        })
    })
})

app.get('/contact', function(req, res) {
    res.render('contact')
})
app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})