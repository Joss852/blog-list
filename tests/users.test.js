const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    passwordHash:
      '$2b$10$YkCBOKDk2/4WfVhp6pHzl.3x5JFbKm/.Kf3RdbP2V1.uM0u79Izli',
    blogs: [],
  },
]

beforeEach(async () => {
  await User.deleteMany({})

  for (let user of initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
})

test('invalid user is not added', async () => {
  const newUser = {
    username: 'jm',
    name: 'John',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(response.body.error).toBe(
    'password must be at least 3 characters long'
  )

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body).toHaveLength(initialUsers.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
