const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Saved Lessons Endpoints', function() {
    let db

    const  {testUsers,
            testCategories,
            testActivities,
            testSavedLessons, 
             } = helpers.makeSavedLessonsFixtures()
 
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
    
      describe(`GET /api/savedlessons`, () => {
        context(`Given no Saved Lessons`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/savedlessons')
              .expect(200, [])
          })
        })
    })

        context('Given there are saved lessons in the database', () => {
            beforeEach('insert saved lessons', () =>
              helpers.seedSavedLessonsTables(
                db,
                testUsers,
                testCategories,
                testActivities,
                testSavedLessons, 
            )
            )

            it('responds with 200 and all of the saved lessons', () => {
                const  {testSavedLessons} = helpers.makeSavedLessonsFixtures()
                const expectedSavedLessons = testSavedLessons.map(savedlesson =>
                  helpers.makeExpectedSavedLesson(
                    savedlesson
                  )
                )
                return supertest(app)
                  .get('/api/savedlessons')
                  .expect(200, expectedSavedLessons)
              })
            })    

    describe(`GET /api/savedlessons/:lesson_id`, () => {
                context(`Given no lessons`, () => {
                  beforeEach(() =>
                    helpers.seedUsers(db, testUsers)
                  )
            
                  it(`responds with 404`, () => {
                    const lesson_id = 123456
                    return supertest(app)
                      .get(`/api/savedlessons/${lesson_id}`)
                      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                      .expect(401, { error: `Lesson does not exist` })
                  })
                })
            
                context('Given there are lessons in the database', () => {
                  beforeEach('insert lessons', () =>
                  helpers.seedSavedLessonsTables(
                    db,
                    testUsers,
                    testCategories,
                    testActivities,
                    testSavedLessons, 
                )
                  )
            
                  it('responds with 200 and the specified article', () => {
                    const lessonId = 1
                    const expectedArticle = helpers.makeExpectedSavedLesson(
                        testSavedLessons[lessonId - 1],
                    )
            
                    return supertest(app)
                      .get(`/api/savedlessons/${lessonId}`)
                      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                      .expect(200, expectedArticle)
                  })
                })
              })

    
    describe(`POST /api/savedlessons`, () => {
                beforeEach('insert saved lessons', () =>
                helpers.seedSavedLessonsTables(
                db,
                testUsers,
                testCategories,
                testActivities,
                testSavedLessons, 
                )
                )

                it(`Saves a Newly Created Lesson`, function() {
                this.retries(3)
                  const testActivity = testActivities[0]
                  const testUser = testUsers[0]
                  const newLesson = {
                        user_id: testUser.id,
                        title: 'test new lesson',
                        date: 'test new lesson',
                        day: 'test new lesson',
                        duration: 'test new lesson',
                        classlevel: 'test new lesson',
                        period: 'test new lesson',
                        topic: 'test new lesson',
                        goal: 'test new lesson',
                        class_size: 3,
                        objective_one: 'test new lesson',
                        objective_two: 'test new lesson',
                        objective_three: 'test new lesson',
                        materials: 'test new lesson',
                        warmup_id: testActivity.id,
                        presentation_one_id: testActivity.id,
                        presentation_two_id: testActivity.id,
                        practice_one_id: testActivity.id,
                        practice_two_id: testActivity.id,
                        practice_three_id: testActivity.id,
                        product_one_id: testActivity.id,
                        product_two_id: testActivity.id,
                        cooldown_id: testActivity.id,
                        reflection_one: 'test new lesson',
                        reflection_two: 'test new lesson',
                        reflection_three: 'test new lesson',
                        date_created: new Date(),
                    }
                  return supertest(app)
                    .post('/api/savedlessons')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(newLesson)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.user_id).to.eql(testUser.id)
                        expect(res.body).to.have.property('id')
                        expect(res.body.title).to.eql(newLesson.title)
                        expect(res.body.date).to.eql(newLesson.date)
                        expect(res.body.day).to.eql(newLesson.day)
                        expect(res.body.duration).to.eql(newLesson.duration)
                        expect(res.body.classlevel).to.eql(newLesson.classlevel)
                        expect(res.body.period).to.eql(newLesson.period)
                        expect(res.body.topic).to.eql(newLesson.topic)
                        expect(res.body.goal).to.eql(newLesson.goal)
                        expect(res.body.class_size).to.eql(newLesson.class_size)
                        expect(res.body.objective_one).to.eql(newLesson.objective_one)
                        expect(res.body.objective_two).to.eql(newLesson.objective_two)
                        expect(res.body.objective_three).to.eql(newLesson.objective_three)
                        expect(res.body.materials).to.eql(newLesson.materials)
                        expect(res.body.warmup_id).to.eql(testActivity.id)
                        expect(res.body.presentation_one_id).to.eql(testActivity.id)
                        expect(res.body.presentation_two_id).to.eql(testActivity.id)
                        expect(res.body.practice_one_id).to.eql(testActivity.id)
                        expect(res.body.practice_two_id).to.eql(testActivity.id)
                        expect(res.body.practice_three_id).to.eql(testActivity.id)
                        expect(res.body.product_one_id).to.eql(testActivity.id)
                        expect(res.body.product_two_id).to.eql(testActivity.id)
                        expect(res.body.cooldown_id).to.eql(testActivity.id)
                        expect(res.body.reflection_one).to.eql(newLesson.reflection_one)
                        expect(res.body.reflection_two).to.eql(newLesson.reflection_two)
                        expect(res.body.reflection_three).to.eql(newLesson.reflection_three)
                        expect(res.headers.location).to.eql(`/api/savedlessons/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                        })
                    .expect(res =>
                      db
                        .from('net_savedlessons')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.title).to.eql(newLesson.title)
                            expect(row.date).to.eql(newLesson.date)
                            expect(row.day).to.eql(newLesson.day)
                            expect(row.duration).to.eql(newLesson.duration)
                            expect(row.classlevel).to.eql(newLesson.classlevel)
                            expect(row.period).to.eql(newLesson.period)
                            expect(row.topic).to.eql(newLesson.topic)
                            expect(row.goal).to.eql(newLesson.goal)
                            expect(row.class_size).to.eql(newLesson.class_size)
                            expect(row.objective_one).to.eql(newLesson.objective_one)
                            expect(row.objective_two).to.eql(newLesson.objective_two)
                            expect(row.objective_three).to.eql(newLesson.objective_three)
                            expect(row.materials).to.eql(newLesson.materials)
                            expect(row.warmup_id).to.eql(testActivity.id)
                            expect(row.presentation_one_id).to.eql(testActivity.id)
                            expect(row.presentation_two_id).to.eql(testActivity.id)
                            expect(row.practice_one_id).to.eql(testActivity.id)
                            expect(row.practice_two_id).to.eql(testActivity.id)
                            expect(row.practice_three_id).to.eql(testActivity.id)
                            expect(row.product_one_id).to.eql(testActivity.id)
                            expect(row.product_two_id).to.eql(testActivity.id)
                            expect(row.cooldown_id).to.eql(testActivity.id)
                            expect(row.reflection_one).to.eql(newLesson.reflection_one)
                            expect(row.reflection_two).to.eql(newLesson.reflection_two)
                            expect(row.reflection_three).to.eql(newLesson.reflection_three)
                            expect(row.user_id).to.eql(testUser.id)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(row.date_created).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                    )
                })
            
                const requiredFields = ['title', 'date', 'day', 'duration', 'classlevel',
                                        'period', 'topic', 'goal', 'class_size', 'objective_one',
                                        'warmup_id', 'presentation_one_id', 'practice_one_id', 'product_one_id',
                                        'reflection_one']
            
                requiredFields.forEach(field => {
                  const testActivity = testActivities[0]
                  const newLesson = {
                    title: 'test new lesson',
                    date: 'test new lesson',
                    day: 'test new lesson',
                    duration: 'test new lesson',
                    classlevel: 'test new lesson',
                    period: 'test new lesson',
                    topic: 'test new lesson',
                    goal: 'test new lesson',
                    class_size: 3,
                    objective_one: 'test new lesson',
                    warmup_id: testActivity.id,
                    presentation_one_id: testActivity.id,
                    practice_one_id: testActivity.id,
                    product_one_id: testActivity.id,
                    cooldown_id: testActivity.id,
                    reflection_one: 'test new lesson',
                    date_created: '2029-01-22T16:28:32.615Z',
                  }
            
                  it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                    delete newLesson[field]
            
                    return supertest(app)
                      .post('/api/savedlessons')
                      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                      .send(newLesson)
                      .expect(400, {
                        error: `Missing '${field}' in request body`,
                      })
                  })
                })
              })


    describe(`DELETE /api/savedlessons/:id`, () => {
        context('Given there are lessons in the database', () => {
            beforeEach('insert saved lessons', () =>
            helpers.seedSavedLessonsTables(
            db,
            testUsers,
            testCategories,
            testActivities,
            testSavedLessons, 
            )
            )

            it('responds with 204 and removes the lesson', () => {
                const testUser = testUsers[0]
                const idToRemove = 1
                const expectedSavedLesson = testSavedLessons.filter(lesson => lesson.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/savedlessons/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(res => supertest(app).get(`/api/savedlessons`).expect(expectedSavedLesson))
            })
        })

        context(`Given no Lessons`, () => {
            it(`responds with 401`, () => {
                const lessonId = 123456
                return supertest(app)
                    .delete(`/api/savedlessons/${lessonId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(401, {
                        error: 'Sorry you cannot do that.'
                    })
            })
        })
    })

    describe(`PATCH /api/savedlessons/:lesson_id`, () => {
        context(`Given no lessons`, () => {
          it(`responds with 404`, () => {
            const lessonId = 123456
            return supertest(app)
              .patch(`/api/savedlessons/${lessonId}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(401, {
                error: 'Sorry you cannot do that.'
            })
          })
        })
    
        context('Given there are lessons in the database', () => {
            beforeEach('insert saved lessons', () =>
            helpers.seedSavedLessonsTables(
                db,
                testUsers,
                testCategories,
                testActivities,
                testSavedLessons, 
            )
            )
       
            it('responds with 204 and updates the lesson', () => {
              const idToUpdate = 1
              const updateLesson = {
                title: 'Updated Lesson Title'
              }
              const expectedLesson = {
                ...testSavedLessons[idToUpdate - 1],
                ...updateLesson
              }  
              return supertest(app)
                .patch(`/api/savedlessons/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updateLesson)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/savedlessons/${idToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedLesson))
            })
            
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 1
                return supertest(app)
                  .patch(`/api/savedlessons/${idToUpdate}`)
                  .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                  .send({ irrelevantField: 'foo' })
                  .expect(400, {
                    error: {
                        message: `Request body must contain title, date, day, classlevel, period, topic, goal, class size, objective_one, materials, warmup_id, presentation_one_id, product_one_id, reflection_one`
                    }
                  })
               })
    
            })
        
          })


})

