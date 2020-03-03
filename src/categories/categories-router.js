const express = require('express')
const xss = require('xss')
const CategoriesService = require('./categories-service')
const path = require('path')
const logger = require('../logger')

const categoriesRouter = express.Router()
const jsonParser = express.json()

const serializeCategory = category => ({
  id: category.id,
  title: xss(category.title),
})

categoriesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CategoriesService.getAllCategories(knexInstance)
      .then(categories => {
        res.json(categories.map(serializeCategory))
      })
      .catch(next)
  })

//This is not used. Put in for future use
/*  .post(jsonParser, (req, res, next) => {
    const { title } = req.body
    const newCategory = { title }

    for (const [key, value] of Object.entries(newCategory))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    CategoriesService.insertCategory(
      req.app.get('db'),
      newCategory
    )
      .then(category => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${category.id}`))
          .json(serializeCategory(category))
      })
      .catch(next)
  })
*/

categoriesRouter
  .route('/:category_id')
  .all((req, res, next) => {
    CategoriesService.getById(
      req.app.get('db'),
      req.params.category_id
    )
      .then(category => {
        if (!category) {
          return res.status(404).json({
            error: `Category does not exist`
          })
        }
        res.category = category // save the category for the next middleware
        next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCategory(res.category))
      })

//For future use.      
/*
  .delete((req, res, next) => {
    CategoriesService.deleteCategory(
        req.app.get('db'),
        req.params.category_id
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
      })
  .patch(jsonParser, (req, res, next) => {
        const { title } = req.body
        const categoryToUpdate = { title}
        const numberOfValues = Object.values(categoryToUpdate).filter(Boolean).length
           if (numberOfValues === 0) {
             return res.status(400).json({
               error: {
                 message: `Request body must contain a 'title'`
               }
             })
           }
        CategoriesService.updateCategory(
          req.app.get('db'),
          req.params.category_id,
          folderToUpdate
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)     
        })
  */

module.exports = categoriesRouter