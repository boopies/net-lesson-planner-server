const path = require('path')
const express = require('express')
const xss = require('xss')
const ActivitiesService = require('./activities-service')
const { requireAuth } = require('../middleware/jwt-auth')

const activitiesRouter = express.Router()
const jsonParser = express.json()

const serializeActivity = activity => ({
  id: activity.id,
  title: xss(activity.title),
  content: xss(activity.content),
  category_id: activity.category_id,
  duration: activity.duration,
  grouping: activity.grouping,
  user_id: activity.user_id,
})

activitiesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ActivitiesService.getAllActivities(knexInstance)
      .then(activities => {
        res.json(activities.map(serializeActivity))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { title, content, category_id, duration, grouping, user_id} = req.body
    const newActivity = { title, content, category_id, duration, grouping, user_id}

    for (const [key, value] of Object.entries(newActivity))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

        newActivity.user_id = req.user.id
    
    ActivitiesService.insertActivity(
      req.app.get('db'),
      newActivity
    )
      .then(activity => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(serializeActivity(activity))
      })
      .catch(next)
  })

activitiesRouter
  .route('/:activity_id')
  .all(checkActivitiesExists)
  .all(jsonParser, (req, res, next) => {
    ActivitiesService.getById(
      req.app.get('db'),
      req.params.activity_id
    )
      .then(activity => {
        if (!activity) {
          return res.status(404).json({
            error: { message: `Activity doesn't exist` }
          })
        }
        res.activity = activity
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeActivity(res.activity))
  })
  .delete(requireAuth, (req, res, next) => {
    ActivitiesService.deleteActivity(
      req.app.get('db'),
      req.params.activity_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, content, category_id, duration, grouping, user_id } = req.body
    const activityToUpdate = { title, content, category_id, duration, grouping, user_id }

    const numberOfValues = Object.values(activityToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'text', 'content', or a new 'folder_id'`
        }
      })

      ActivitiesService.updateActivity(
      req.app.get('db'),
      req.params.activity_id,
      activityToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkActivitiesExists(req, res, next) {
  try {
    const activity = await ActivitiesService.getById(
      req.app.get('db'),
      req.params.activity_id
    )

    if (!activity)
      return res.status(404).json({
        error: `Activity doesn't exist`
      })

    res.activity = activity
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = activitiesRouter