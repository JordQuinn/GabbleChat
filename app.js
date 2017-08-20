const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const expressSession = require('express-session')
const shortid = require('shortid')
const moment = require('moment')
const userRouter = require("./routes/public")
const conn = require('./lib/conn')

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(expressSession({secret: "secretsquirrel"}))
app.use(express.static(path.join(__dirname, 'static')))


  //once logged in the chat page renders and when "submit" is pressed,
  //the database updates with a timestamp and the chat
//how do I get the userid to input into db??
   app.post('/chat', function(req,res,next){
     const chatBox= req.body.chatBox
     const userid = req.body.userid

   const sql2 = `INSERT INTO gabs (gab, userid)
   VALUES(?, ?)
   `

conn.query(sql2, [chatBox, userid], function(err,results,fields){
  if(!err){
    res.redirect('chat')
  } else{
    res.send("Ewe have another error")
    console.log(err)
    }
  })
})

   app.get("/", function(req,res,next){
    res.render("index")
   })

   app.get("/likes", function(req,res,next){
    res.render("likes")
   })

   app.get("/chat", function(req,res,next){
     const sql = `SELECT gab, time FROM gabs
     WHERE id > 0
     ORDER BY time DESC
     `
//DATE_FORMAT(time,'%W, %M %e, %Y @ %h:%i %p') as formattedTime (insert this
//after the gab, if you wnat to use SQL formatted time and delete the word "time"above)

     conn.query(sql, function(err, results, fields){
       if(!err){
         results = results.map(function(item){
           return {
             time: moment(item.time).format("dddd, MMMM Do YYYY, h:mm a"),
             gab: item.gab
           }
         })

         res.render("chat", {chatbox: results})
       } else {
         res.send("Ewe have an error with submitted chat posts")
       }
     })
  })


//post likes into the db
 // app.post("/chat/like", function(req, res, next){
 //   const userid = req.body.userid//using hidden input
 //   const gabid = req.body.gabid
 //
 //   const sql = `INSERT INTO likes (userid, gabid)
 //   VALUES (?, ?)
 //   `
 //   conn.query(sql, [userid, gabid], function(err,results,fields){
 //     if(!err){
 //       res.redirect("chat")
 //     } else {
  //      console.log(err)
 //       res.send("Ewe have an error with likes")
 //
 //       }
 //     })
 //   })
//app.get("/chat/delete", function(req, res, next){
  //const sql = `DELECT FROM gabs gabs
  //WHERE gabid = ?`
//})







//*****Ask about access rights on db when I put in a username and password

app.use(userRouter)


app.listen(3000, function(){
  console.log("App running on port 3000")
})
