const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Categories Endpoints', function() {
    let db

    const  { testCategories } = helpers.makeCategoriesFixtures()
 
    it('GET / responds with 200 containing "Hello, world!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
    })

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })
    
      after('disconnect from db', () => db.destroy())

      before('cleanup', () => helpers.cleanTables(db))
    
      afterEach('cleanup', () => helpers.cleanTables(db))
    
      describe(`GET /api/categories`, () => {
        context(`Given no categories`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/categories')
              .expect(200, [])
          })
        })
    })
    context('Given there are categories in the database', () => {
        beforeEach('insert categories', () =>
          helpers.seedCategoriesTables(
            db,
            testCategories,
          )
        )
  
        it('responds with 200 and all of the categories', () => {
          const expectedCategories = testCategories.map(category =>
            helpers.makeExpectedCategory(
                category
            )
          )
          return supertest(app)
            .get('/api/categories')
            .expect(200, expectedCategories)
        })
      })

describe(`GET /api/categories/:category_id`, () => {
    context(`Given no Category`, () => {
      beforeEach(() =>
      helpers.seedCategoriesTables(
        db,
        testCategories,
      )
      )

      it(`responds with 404`, () => {
        const articleId = 123456
        return supertest(app)
          .get(`/api/categories/${articleId}`)
          .expect(404, { error: `Category does not exist` })
      })
    })


    context('Given there are articles in the database', () => {
        beforeEach('insert articles', () =>
        helpers.seedCategoriesTables(
            db,
            testCategories,
          )
        )
  
        it('responds with 200 and the specified category', () => {
          const categoryId = 2
          const expectedCategory = helpers.makeExpectedCategory(
                testCategories[categoryId - 1],
          )
  
          return supertest(app)
            .get(`/api/categories/${categoryId}`)
            .expect(200, expectedCategory)
        })
      })
  
})

})
