const path = require('path')
const express = require('express')
const xss = require('xss')
const ActivitiesService = require('./activities-service')

const activitiesRouter = express.Router()
const jsonParser = express.json()

const serializeActivity = activity => ({
  id: activity.id,
  title: xss(activity.title),
  content: xss(activity.content),
  category_id: activity.category_id,
  duration: activity.duration,
  group: activity.group
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
  .post(jsonParser, (req, res, next) => {
    const { title, content, category_id, duration, group} = req.body
    const newActivity = { title, content, category_id, duration, group }

    for (const [key, value] of Object.entries(newActivity))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

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
  .all((req, res, next) => {
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
  .delete((req, res, next) => {
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
    const { title, content, category_id, duration, group } = req.body
    const activityToUpdate = { title, content, category_id, duration, group }

    const numberOfValues = Object.values(activityToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'text', 'content', or a new 'folder_id'`
        }
      })

      ActivitiesService.updateActivity(
      req.app.get('db'),
      req.params.note_id,
      activityoUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = activitiesRouter