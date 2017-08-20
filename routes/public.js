const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const conn = require('../lib/conn')

router.get('/join', function(req,res, next){
  res.render("join")
 })

 router.get('/likes', function(req,res, next){
   res.render("likes")
  })

router.post('/index', function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
    SELECT password FROM logins
    WHERE username = ?
  `
  conn.query(sql, [username], function(err, results, fields){
  const hashedPassword = results[0].password

  bcrypt.compare(password, hashedPassword).then(function(result){
      if(result){
        req.session.isLoggedIn = true
        res.redirect('/chat')
      } else {
        res.send('Invalid username or password')
      }
    })
  })
})

router.post('/join/newuser',function(req,res,next){
  const username = req.body.username
  const password = req.body.password
  const alias = req.body.alias

  const sql =`
  INSERT INTO logins (username, password, alias)
  VALUES (?, ?, ?)
  `
  bcrypt.hash(password, 10).then(function(hashedPassword){
    conn.query(sql, [username,hashedPassword, alias], function(err, results, fields){
    if(!err){

      res.redirect('/chat')
    } else {
      console.log(err)
      res.send("Error registering your details")
      }
    })
  })
})

module.exports = router
