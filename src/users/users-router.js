const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()


const serializeUser = user => ({
  id: user.id,
  user_id: user.user_name,
  email: user.email,
})

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, email } = req.body

    for (const field of ['email', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
    

    const passwordError = UsersService.validatePassword(password)
      
    if (passwordError)
      return res.status(400).json({ error: passwordError })

      UsersService.hasUserWithUserName(
        req.app.get('db'),
        user_name)

    UsersService.hasUserWithEmail(
          req.app.get('db'),
          email)
      .then(hasUserWithEmail => {
          if (hasUserWithEmail)
        return res.status(400).json({ error: `Email already taken` })
      })


      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
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
      .all(requireAuth, jsonBodyParser, (req, res, next) => {
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