const {expect} = require('chai')
const supertest = require('supertest')
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '15m'
process.env.NODE_ENV = 'test'

require('dotenv').config()

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || "postgresql://mulia_nguyen@localhost/net-lesson-planner-test"


global.expect = expect
global.supertest = supertest