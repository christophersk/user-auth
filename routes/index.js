const express = require('express');
const router = express.Router();
const { User } = require('../db');


router.get('/', function (req, res, next) {
  res.render('signup');
})

router.get('/signup', function (req, res, next) {
  res.render('signup');
})

router.post('/signup', function (req, res, next) {
  console.log(User);
  User.findOne({ where: { username: req.body.username }})
  .then(user => {
    if (!user) {
      return User.build({
        username: req.body.username,
      })
    } else {
      throw new Error('user already exists');
    }
  })
  .then(user => {
    return Promise.all([user, User.hashPassword(req.body.password)]);
  })
  .spread((user, password) => {
    user.password = password;
    return user.save();
  })
  .then(user => {
    req.session.user = user;
    res.redirect('/dashboard');
  })
  .catch(next);
})

router.get('/login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
})

router.post('/login', function (req, res, next) {
  User.comparePassword(req.body.username, req.body.password)
  .spread((user, compareResult) => {
    if (compareResult === true) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.render('login', { message: 'incorrect username or password' })
    }
  })
  .catch(next);
})

router.delete('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) { next(err) }
    else { res.redirect('/login'); }
  })

})

router.get('/dashboard', function (req, res, next) {
  if (!req.session.user) {
    res.render('login', { message: 'you are not logged in'});
  } else {
    res.render('dashboard', { user: req.session.user });
  }
})

module.exports = router;
