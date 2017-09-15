const Sequelize = require('sequelize');
const db = require('../db');
const bcrypt = require('bcrypt-nodejs');
class AuthenticationError extends Error{}

const User = db.define('user', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  }
})

// //synchronous version of hashPassword
// User.prototype.hashPassword = function(password) {
//   this.password = bcrypt.hashSync(password);
//   return this;
// }

//async hashPassword
User.hashPassword = function(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  }).then(salt => {
    return new Promise(function(resolve, reject) {
      bcrypt.hash(password, salt, null, function(err, res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      })
    })
  })
}

User.comparePassword = function(username, password) {
  return User.findOne({ where: { username: username}} )
  .then(user => {
    if (!user) {
      throw new AuthenticationError('user not found');
    } else {
      return [user, user.password];
    }
  })
  .spread((user, hashedPassword) => {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, hashedPassword, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve([user, res]);
        }
    });
    })
  })
}

module.exports = User;
