const express = require('express')
const { handlebars } = require('hbs')
const time = require('./public/js/blog.js')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const db = require('./connection/db')

const upload = require('./middlewares/fileUpload')

const app = express()
const port = process.env.PORT || 5000

// let isLogin = true

app.set('view engine', 'hbs') // set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set public path/folder agar file bisa dibaca oleh handlebars
app.use('/uploads', express.static(__dirname + '/uploads')) // set public path/folder agar file bisa dibaca oleh handlebars

app.use(flash())
app.use(session({
    secret: 'tag',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 2 * 60 * 60 * 1000 //2jam
     }
  }))

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
    console.log(req.session);

    const query = `SELECT tb_projects.id, tb_projects.author_id, tb_user.name as author, tb_user.email, tb_projects.name, tb_projects.start_date, tb_projects.end_date, tb_projects.description, tb_projects.technologies, tb_projects.image
	FROM tb_projects LEFT JOIN tb_user ON tb_projects.author_id = tb_user.id`
    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query(query, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 
            
            let data=result.rows
            
            data = data.map(function (list) {
                return {
                    ...list, //export isi dari row sql di var data
                    description : list.description.slice(0,100)+". . .",
                    isLogin: req.session.isLogin
                }
            })
            console.log(data);
            res.render('index',{ 
                isLogin: req.session.isLogin,
                user:req.session.user,
                blogs: data
            }) //isLogin : isLogin, blogs : blogs (sebelumnya)


        })

    })

})

app.get('/detail-project/:id', function(req, res) {
    
    console.log(req.params);

    let id = req.params.id
    //console.log(index);

    const query = `SELECT tb_projects.id, tb_projects.author_id, tb_user.name as author, tb_user.email, 
    tb_projects.name, tb_projects.start_date, tb_projects.end_date, tb_projects.description, tb_projects.technologies,
    tb_projects.image FROM tb_projects LEFT JOIN tb_user ON tb_projects.author_id = tb_user.id where tb_projects.id=${id}`

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query(query, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 

            console.log('ini isi result',result.rows);

            let data=result.rows
            // console.log(data[0].name);
            res.render('detail-project',{
                blogs: data,
                isLogin: req.session.isLogin,
                user:req.session.user}) //isLogin : isLogin, blogs : blogs (sebelumnya)
        })

    })

   
})


app.post('/add-project',upload.single('inputImage'), function(req, res) {

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

        const image = req.file.filename
        
        const query = `INSERT INTO public.tb_projects(
            name, start_date, end_date, description, technologies, image , author_id)
           VALUES ( '${data.inputProject}', '${data.inputStart}', '${data.inputEnd}', '${data.inputContent}',
           '{"${data.inputBootstrap}","${data.inputJs}","${data.inputReact}","${data.inputNode}"}',
            '${image}','${req.session.user.id}')`

        client.query(query, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 
            
            res.redirect('/')
        })

    })
    
})

app.post('/update/:id',upload.single('inputImage'), function(req, res) {
     let id = req.params.id
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

        const image = req.file.filename

        client.query(`UPDATE public.tb_projects SET 
            name='${data.inputProject}',
            start_date='${data.inputStart}',
            end_date='${data.inputEnd}',
            description='${data.inputContent}',
            technologies='{"${data.inputBootstrap}","${data.inputJs}","${data.inputReact}","${data.inputNode}"}',
            image='${image}'
            WHERE id = ${id}`, function(err, result) {
                if (err) throw err // kondisi untuk menampilkan error query 
                done() 
            
                res.redirect('/')
            })
    })

})

app.post('/login', function(req, res) {
    
    const {inputan} = req.body // destruct property to new variabel
    // console.log('ini data register',inputan[0]);
    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database
        
        client.query(`SELECT * FROM tb_user WHERE email = '${inputan[0]}'`, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 
            
            console.log(result.rows[0]);

            if(result.rows.length == 0){
                //  console.log('Email belum terdaftar!!');
                req.flash('danger', 'Email belum terdaftar!!')

                return res.redirect('/login') // berpindah halaman ke route /blog
            } 
            
            const isMatch = bcrypt.compareSync(inputan[1],result.rows[0].password)

            if (isMatch) {
                //console.log('login berhasil');
                //memasukan data kedalam session
                req.session.isLogin = true,
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }
                req.flash('success', 'Login Success')
                res.redirect('/')
            }else{
                req.flash('danger', 'Password salah')
                res.redirect('/login')
                
            }
        })
        
    }) 
    

})
app.post('/register', function(req, res) {
    
    const {inputan} = req.body // destruct property to new variabel
    
    const hashedpass = bcrypt.hashSync(inputan[2],10)

   
    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database
        
        client.query(`INSERT INTO public.tb_user(name, email, password) 
        VALUES ('${inputan[0]}','${inputan[1]}', '${hashedpass}')`, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 
            
            res.redirect('/') 
        })
        
    })
    console.log('ini data register',inputan);
    
})

app.get('/delete-project/:id', function(req, res) {

    let id = req.params.id
    if(!req.session.isLogin){
        req.flash('danger', 'Page not found, Please login !')
        return res.redirect('/')
    }
    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query(`DELETE FROM public.tb_projects WHERE id = ${id}`, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 
            done() 

            res.redirect('/')
        })
    })
})
app.get('/logout', function(req, res){
    req.session.destroy()

    res.redirect('/')
})
app.get('/update/:id', function(req, res) {
    let id = req.params.id      
    if(!req.session.isLogin){
        req.flash('danger', 'Page not found, Please login !')
        return res.redirect('/')
    }

    res.render('update',{
        id,
        isLogin: req.session.isLogin,
        user:req.session.user,
    })
})
app.get('/add-project', function(req, res) {
    if(!req.session.isLogin){
        req.flash('danger', 'Page not found, Please login !')
        return res.redirect('/')
    }

    res.render('add-project',{
        isLogin: req.session.isLogin,
        user:req.session.user,
    })
})
app.get('/register', function(req, res) {
    res.render('register')
})
app.get('/login', function(req, res) {
    res.render('login')
})
app.get('/contact', function(req, res) {
    res.render('contact',{
        isLogin: req.session.isLogin,
        user:req.session.user
    })
})
app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})