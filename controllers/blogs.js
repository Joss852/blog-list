const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.status(200).json(blogs)
})

blogRouter.get('/:id/comments', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const comments = await Comment.find({ blog: request.params.id })

  if (!comments) {
    return response.status(404).end()
  }

  response.status(200).json(comments)
})

blogRouter.post('/:id/comments', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!request.body.content) {
    return response.status(400).send({ error: 'Comment content is required' })
  }

  const comment = new Comment({
    content: request.body.content,
    blog: request.body.id
  })

  const savedComment = await comment.save()

  response.status(200).json(savedComment)
})

blogRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user

  if (!request.body.title || !request.body.url) {
    return response.status(400).send({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json({
    author: savedBlog.author,
    id: savedBlog._id,
    likes: savedBlog.likes,
    title: savedBlog.title,
    url: savedBlog.url,
    user: {
      username: user.username,
      name: user.name,
      id: user._id,
    },
  })
})

blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(204).end()
  }

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (blogToDelete.user && blogToDelete.user.toString() !== request.user.id) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const editedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      likes: body.likes,
    },
    {
      new: true,
    }
  )
  response.status(200).json(editedBlog)
})

module.exports = blogRouter
