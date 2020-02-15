const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()


const serializeUser = user => ({
  id: user.id,
  username: user.username,
})

usersRouter
  .get('/', (req, res, next) => {
      UsersService.getUsers(req.app.get('db'))
        .then(users => {
          res.json(users.map(serializeUser))
        })
    .catch(next)
  })
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, username, email } = req.body

    for (const field of ['email', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
    

    const passwordError = UsersService.validatePassword(password)
      
    if (passwordError)
      return res.status(400).json({ error: passwordError })

      UsersService.hasUserWithUserName(
        req.app.get('db'),
        username)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              email,
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
  })
    
usersRouter
      .route('/:username')
      .all(jsonBodyParser, (req, res, next) => {
        UsersService.getUserWithUserName(
          req.app.get('db'),
          req.params.username
        )
          .then(user=> {
            if (!user) {
              return res.status(404).json({
                error: { message: `User doesn't exist` }
              })
            }
            res.user = user
            next()
          })
          .catch(next)
      })
      .get((req, res, next) => {
        res.json(serializeUser(res.user))
      })

module.exports = usersRouter