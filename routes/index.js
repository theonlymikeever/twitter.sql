'use strict';
var express = require('express');
var router = express.Router();
const client = require('../db').client;
// var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.user_id = users.id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      // console.log(result.rows);
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });

  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){

    client.query('SELECT content FROM users INNER JOIN tweets ON tweets.user_id = users.id WHERE name=$1', [req.params.username], function (err, result) {
        if(err) return next(err);
        var tweetsForName = result.rows;
        // console.log(result.rows);
        res.render('index', { title: 'Twitter.js', tweets: tweetsForName, showform: true, username: req.params.username });
      });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    client.query('SELECT content FROM tweets WHERE id=$1', [req.params.id], function(err, result){
        if(err) return next(err);
        var tweetForId = result.rows;
        console.log(result.rows);
        res.render('index', { title: 'Twitter.js', tweets: tweetForId });
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    client.query('INSERT INTO users (name) VALUES ($1)', [req.body.name], function(err, result){
        if (err) return next(err);
        client.query('SELECT id FROM users WHERE name=$1', [req.body.name], function(err, result){
            if (err) return next(err);
            var id = result.rows;
            console.log(id)
            client.query('INSERT INTO tweets (content, user_id) VALUES ($1, $2)', [req.body.content, id[0].id], function(err, result){
                res.redirect('/');
            });
        });
    });
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
