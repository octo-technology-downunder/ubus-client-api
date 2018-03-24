const request = require('supertest')
const app = require('../src/app')

// --- Unit test

// --- Integration test
describe('Test the root path', () => {
  test('It should answer to the GET method', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })
})

