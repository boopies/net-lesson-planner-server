require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const categoriesRouter = require('./categories/categories-router')
const activitiesRouter = require('./activities/activities-router.js')
const savedlessonsRouter = require('./savedlessons/savedlessons-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/categories', categoriesRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/savedlessons', savedlessonsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: 'Server error' }
    } else {
      console.error(error)
      response = { error: error.message, object: error }
    }
    res.status(500).json(response)
  })

module.exports = app