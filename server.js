require('dotenv').config()
const express = require('express'),
      ejs = require('ejs'),
      path = require('path'),
      fileUpload = require('express-fileupload'),
      mysql = require('mysql2'),
      bp = require('body-parser'),
      ex = express()

var connection = mysql.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.pass,
    database:process.env.database
})

ex.listen(process.env.port,()=>{
    console.log('Running at port 3000');
})

ex.set('view engine','ejs')
ex.use(bp.urlencoded({extended:true}))
ex.use(express.static('public'))
ex.use(fileUpload())


ex.get('/',(req,res)=>{
    res.render('index')
})
ex.post('/',(req,res)=>{
    var post = req.body,
        first_name = post.first_name,
        last_name = post.last_name,
        mobile_num = post.mobile_num,
        user_name = post.user_name,
        password = post.password
    var file = req.files.image
    var image_name = file.name
    var mime_type = file.mimetype
    connection.query(
        'insert into im_saver values(?,?,?,?,?,?,?,?)',[null,first_name,last_name,image_name,mobile_num,user_name,password,mime_type]
    )
    connection.query(
        'select id from im_saver where user_name = ?',[user_name],(err,result)=>{
            file.mv('public/'+image_name)
        }
    )
})

ex.get('/login',(req,res)=>{
    var ID = req.query.id;
        connection.query(
            'select * from im_saver where id = ?',[ID],(err,result)=>{
                if(result.length !== 0){
                    res.render('front',{data:result})
                }else{
                    res.send('This id doesnot exists')
                }
            }
        )
})


