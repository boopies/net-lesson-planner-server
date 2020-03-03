const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs')


describe('Users Endpoints', function() {
    let db

    const  { testUsers } = helpers.makeUsersFixtures()
    const testUser0 = testUsers[0]
 
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
    
      describe(`GET /api/users`, () => {
        context(`Given no users`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/users')
              .expect(200, [])
          })
        })
    })
    context('Given there are users in the database', () => {
        beforeEach('insert users', () =>
          helpers.seedUsers(
            db,
            testUsers,
          )
        )
  
        it('responds with 200 and all of the categories', () => {
          const expectedUsers = testUsers.map(user =>
            helpers.makeExpectedUser(
                user
            )
          )
          return supertest(app)
            .get('/api/users')
            .expect(200, expectedUsers)
        })
      })

      describe(`GET /api/users/:username`, () => {
        context(`Given no User`, () => {
          beforeEach(() =>
          helpers.seedUsers(
            db,
            testUsers,
          )
          )
    
          it(`responds with 404`, () => {
            const username = 123456
            return supertest(app)
              .get(`/api/users/${username}`)
              .expect(404, { error: `User does not exist` })
          })
        })

        context('Given there are users in the database', () => {
            beforeEach('insert users', () => 
                helpers.seedUsers(
                    db,
                    testUsers,
              )
            )
          
            it('responds with 200 and the user data', () => {
              const username = 'test-user-1'
              const usr = testUsers.find(users =>  
                username === users.username)

                const expectedUser = helpers.makeExpectedUser(usr)

              return supertest(app)
                .get(`/api/users/${username}`)
                .expect(200, expectedUser)
            })
        })
      
    })

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
          beforeEach('insert users', () =>
            helpers.seedUsers(
              db,
              testUsers,
            )
          )
    
          const requiredFields = ['username', 'password', 'email']
    
          requiredFields.forEach(field => {
            const registerAttemptBody = {
              username: 'test user_name',
              password: 'test password',
              email: 'test email',
            }
    
            it(`responds with 400 required error when '${field}' is missing`, () => {
              delete registerAttemptBody[field]
    
              return supertest(app)
                .post('/api/users')
                .send(registerAttemptBody)
                .expect(400, {
                  error: `Missing '${field}' in request body`,
                })
            })
          })
    
          it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
            const userShortPassword = {
              username: 'test username',
              password: '1234567',
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(userShortPassword)
              .expect(400, { error: `Password be longer than 8 characters` })
          })
    
          it(`responds 400 'Password be less than 72 characters' when long password`, () => {
            const userLongPassword = {
              username: 'test username',
              password: '*'.repeat(73),
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(userLongPassword)
              .expect(400, { error: `Password be less than 72 characters` })
          })
    
          it(`responds 400 error when password starts with spaces`, () => {
            const userPasswordStartsSpaces = {
              username: 'test username',
              password: ' 1Aa!2Bb@',
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(userPasswordStartsSpaces)
              .expect(400, { error: `Password must not start or end with empty spaces` })
          })
    
          it(`responds 400 error when password ends with spaces`, () => {
            const userPasswordEndsSpaces = {
              username: 'test username',
              password: '1Aa!2Bb@ ',
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(userPasswordEndsSpaces)
              .expect(400, { error: `Password must not start or end with empty spaces` })
          })
    
          it(`responds 400 error when password isn't complex enough`, () => {
            const userPasswordNotComplex = {
              username: 'test username',
              password: '11AAaabb',
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(userPasswordNotComplex)
              .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
          })
    
          it(`responds 400 'User name already taken' when username isn't unique`, () => {
            const duplicateUser = {
              username: testUser0.username,
              password: '11AAaa!!',
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(duplicateUser)
              .expect(400, { error: `Username already taken` })
          })
        })
    
        context(`Happy path`, () => {
          it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
              username: 'testusername',
              password: '11AAaa!!',
              email: 'test email',
            }
            return supertest(app)
              .post('/api/users')
              .send(newUser)
              .expect(201)
              .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.username).to.eql(newUser.username)
                expect(res.body.email).to.eql(newUser.email)
                expect(res.body).to.not.have.property('password')
                expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                const expectedDate = new Date()
                const actualDate = new Date()
                expect(actualDate).to.eql(expectedDate)
              })
              .expect(res =>
                db
                  .from('net_users')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.username).to.eql(newUser.username)
                    expect(row.email).to.eql(newUser.email)
                    const expectedDate = new Date()
                    const actualDate = new Date()
                    expect(actualDate).to.eql(expectedDate)
    
                    return bcrypt.compare(newUser.password, row.password)
                  })
                  .then(compareMatch => {
                    expect(compareMatch).to.be.true
                  })
              )
          })
        })
      })

})