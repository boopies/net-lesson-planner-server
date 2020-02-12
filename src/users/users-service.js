const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(db, username) {
    return db('net_users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  hasUserWithEmail(db, email) {
    return db('net_users')
      .where({ email })
      .first()
      .then(email => !!email)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('net_users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      email: xss(user.email),
    }
  },
    getUserWithUserName(knex, username) {
      return knex
        .from('net_users')
        .select('*')
        .where( 'username', username )
        .first()
    },
    getUsers(knex) {
      return knex.select('*').from('net_users')
    },
}

module.exports = UsersService