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
              .get('/api/activities')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200, expectedActivities)
          })
        })
    })
    
    describe(`GET /api/activities/:activity_id`, () => {
      context(`Given no Activity`, () => {
        beforeEach(() =>
          helpers.seedUsers(db, testUsers)
        )
  
        it(`responds with 404`, () => {
          const activity_id = 123456
          return supertest(app)
            .get(`/api/activities/${activity_id}`)
            .expect(404, { error: `Activity does not exist` })
        })
      })
  
      context('Given there are lessons in the database', () => {
        beforeEach('insert activities', () =>
        helpers.seedActivitiesTables(
          db,
          testUsers,
          testCategories,
          testActivities,
        )
      )
  
        it('responds with 200 and the specified activity', () => {
          const activity_id = 1
          const expectedActivity = helpers.makeExpectedActivity(
              testActivities[activity_id - 1],
          )
  
          return supertest(app)
            .get(`/api/activities/${activity_id}`)
            .expect(200, expectedActivity)
        })
      })
    })

    describe(`POST /api/activities`, () => {
      beforeEach('insert activities', () =>
      helpers.seedActivitiesTables(
        db,
        testUsers,
        testCategories,
        testActivities,
      )
    )

      it(`Saves a Newly Created Activity`, function() {
      this.retries(3)
        const testCategory = testCategories[0]
        const testUser = testUsers[0]
        const newActivity= {
          title: 'First test activity!',
          category_id: testCategory.id,
          user_id: testUser.id,
          duration: 'test time',
          grouping: 'test groups',
          content: 'test Content',
          date_created: new Date(),
          }
        return supertest(app)
          .post('/api/activities')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newActivity)
          .expect(201)
          .expect(res => {
              expect(res.body.user_id).to.eql(testUser.id)
              expect(res.body).to.have.property('id')
              expect(res.body.category_id).to.eql(testCategory.id)
              expect(res.body.title).to.eql(newActivity.title)
              expect(res.body.grouping).to.eql(newActivity.grouping)
              expect(res.body.duration).to.eql(newActivity.duration)
              expect(res.body.content).to.eql(newActivity.content)
              expect(res.headers.location).to.eql(`/api/activities/${res.body.id}`)
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(res.body.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
              })
          .expect(res =>
            db
              .from('net_activities')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                  expect(row.user_id).to.eql(testUser.id)
                  expect(row).to.have.property('id')
                  expect(row.category_id).to.eql(testCategory.id)
                  expect(row.title).to.eql(newActivity.title)
                  expect(row.grouping).to.eql(newActivity.grouping)
                  expect(row.duration).to.eql(newActivity.duration)
                  expect(row.content).to.eql(newActivity.content)
                  const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                  const actualDate = new Date(row.date_created).toLocaleString()
                  expect(actualDate).to.eql(expectedDate)
              })
          )
      })
  
      const requiredFields = ['title', 'content', 'category_id', 'duration', 'grouping']
  
      requiredFields.forEach(field => {
        const testCategory = testCategories[0]
        const newActivity = {
          title: 'First test activity!',
          category_id: testCategory.id,
          duration: 'test time',
          grouping: 'test groups',
          content: 'test Content',
        }
  
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newActivity[field]
  
          return supertest(app)
            .post('/api/activities')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newActivity)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })
    })




    describe(`PATCH /api/activities/:activity_id`, () => {
      context(`Given no lessons`, () => {
        it(`responds with 404`, () => {
          const activity_id = 123456
          return supertest(app)
            .patch(`/api/activities/${activity_id}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, {
              error: 'Activity does not exist'
          })
        })
      })
  
      context('Given there are activities in the database', () => {
        beforeEach('insert activities', () =>
        helpers.seedActivitiesTables(
          db,
          testUsers,
          testCategories,
          testActivities,
        )
      )
   
        it('responds with 204 and updates the activity', () => {
          const idToUpdate = 1
          const updateActivity = {
            title: 'Updated Lesson Title'
          }
          const expectedActivity = {
            ...testActivities[idToUpdate - 1],
            ...updateActivity
          }  
          return supertest(app)
            .patch(`/api/activities/${idToUpdate}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(updateActivity)
            .expect(204)
            .then(res =>
                supertest(app)
                    .get(`/api/activities/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(expectedActivity))
        })
        
        it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 1
            return supertest(app)
              .patch(`/api/activities/${idToUpdate}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .send({ irrelevantField: 'foo' })
              .expect(400, {
                error: {
                    message: `Request body must contain a title, content, category_id, duration, grouping, user_id`
                }
              })
           })

        })
     
      
        })


    })
