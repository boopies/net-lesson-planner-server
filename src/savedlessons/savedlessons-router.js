const path = require('path')
const express = require('express')
const SavedlessonsService = require('./savedlessons-service')
const { requireAuth } = require('../middleware/jwt-auth')

const savedlessonsRouter = express.Router()
const jsonParser = express.json()

const serializeSavedlesson = savedlesson => ({
  id: savedlesson.id,
  user_id: savedlesson.user_id, 
  title: savedlesson.title, 
  date: savedlesson.date, 
  day: savedlesson.day,
  duration: savedlesson.duration,
  classlevel: savedlesson.classlevel, 
  period: savedlesson.period, 
  topic: savedlesson.topic, 
  goal: savedlesson.goal, 
  class_size: savedlesson.class_size, 
  objective_one: savedlesson.objective_one, 
  objective_two: savedlesson.objective_two, 
  objective_three: savedlesson.objective_three, 
  materials: savedlesson.materials, 
  warmup_id: savedlesson.warmup_id, 
  presentation_one_id: savedlesson.presentation_one_id, 
  presentation_two_id: savedlesson.presentation_two_id, 
  practice_one_id: savedlesson.practice_one_id, 
  practice_two_id: savedlesson.practice_two_id,
  practice_three_id: savedlesson.practice_three_id, 
  product_one_id: savedlesson.product_one_id, 
  product_two_id: savedlesson.product_two_id, 
  cooldown_id: savedlesson.cooldown_id, 
  reflection_one: savedlesson.reflection_one, 
  reflection_two: savedlesson.reflection_two,
  reflection_three: savedlesson.reflection_three,
})

savedlessonsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SavedlessonsService.getAllSavedlessons(knexInstance)
      .then(savedlessons => {
        res.json(savedlessons.map(serializeSavedlesson))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { user_id, title, date, day, duration, classlevel, period, topic, goal, class_size, 
      objective_one, objective_two, objective_three, materials, warmup_id, 
      presentation_one_id, presentation_two_id, practice_one_id, practice_two_id,
      practice_three_id, product_one_id, product_two_id, cooldown_id, reflection_one, reflection_two,
      reflection_three } = req.body
    const newSavedlesson = { user_id, title, date, duration, day, classlevel, period, topic, goal, class_size, 
      objective_one, objective_two, objective_three, materials, warmup_id, 
      presentation_one_id, presentation_two_id, practice_one_id, practice_two_id,
      practice_three_id, product_one_id, product_two_id, cooldown_id, reflection_one, reflection_two,
      reflection_three }

    newSavedlesson.user_id = req.user.id    

    for (const [key, value] of Object.entries(newSavedlesson))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    SavedlessonsService.insertSavedlesson(
      req.app.get('db'),
      newSavedlesson
    )
      .then(savedlesson => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${savedlesson.id}`))
          .json(serializeSavedlesson(savedlesson))
      })
      .catch(next)
  })

savedlessonsRouter
  .route('/:savedlesson_id')
  .all(requireAuth, (req, res, next) => {
    SavedlessonsService.getById(
      req.app.get('db'),
      req.params.savedlesson_id
    )
      .then(savedlesson => {
        if (!savedlesson) {
          return res.status(404).json({
            error: { message: `Saved Lesson doesn't exist` }
          })
        }
        res.savedlesson = savedlesson
        next()
      })
      .catch(next)
  })
  .get(requireAuth, (req, res, next) => {
    res.json(serializeSavedlesson(res.savedlesson))
  })
  .delete(jsonParser, (req, res, next) => {
    SavedlessonsService.deleteSavedlesson(
      req.app.get('db'),
      req.params.savedlesson_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_id, title, date, duration, day, classlevel, period, topic, goal, class_size, 
      objective_one, objective_two, objective_three, materials, warmup_id, 
      presentation_one_id, presentation_two_id, practice_one_id, practice_two_id,
      practice_three_id, product_one_id, product_two_id, cooldown_id, reflection_one, reflection_two,
      reflection_three  } = req.body
    const savedlessonToUpdate = { user_id, title, date, duration, day, classlevel, period, topic, goal, class_size, 
      objective_one, objective_two, objective_three, materials, warmup_id, 
      presentation_one_id, presentation_two_id, practice_one_id, practice_two_id,
      practice_three_id, product_one_id, product_two_id, cooldown_id, reflection_one, reflection_two,
      reflection_three }
    const savedlessonToUpdateReq = { user_id, title, date, duration, day, classlevel, period, topic, goal, class_size, 
        objective_one, materials, warmup_id, presentation_one_id, 
        product_one_id, reflection_one }

    const numberOfValues = Object.values(savedlessonToUpdateReq).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain title, date, day, classlevel, period, topic, goal, class size, 
          objective_one, materials, warmup_id, presentation_one_id, 
          product_one_id, reflection_one`
        }
      })

      SavedlessonsService.updateSavedlesson(
      req.app.get('db'),
      req.params.savedlesson_id,
      savedlessonToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = savedlessonsRouter