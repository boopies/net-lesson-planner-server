const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Activities Endpoints', function() {
    let db

    const  {testUsers,
            testCategories,
            testActivities,
             } = helpers.makeActivitiesFixtures()
 
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
    
      describe(`GET /api/activities`, () => {
        context(`Given no activities`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/activities')
              .expect(200, [])
          })
        })

        context('Given there are articles in the database', () => {
          beforeEach('insert activities', () =>
            helpers.seedActivitiesTables(
              db,
              testUsers,
              testCategories,
              testActivities,
            )
          )
              
          it('responds with 200 and all of the activities', () => {
            const expectedActivities = testActivities.map(activity =>
              helpers.makeExpectedActivity(
                activity,
              )
            )
            return supertest(app)
              .get('/api/articles')
              .expect(200, expectedActivities)
          })
        })


    })







    })
