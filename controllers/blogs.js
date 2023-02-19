const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    response.status(400).send({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  })

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter
