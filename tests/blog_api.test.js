const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(3)
})

test('id is defined', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a blog can be added ', async () => {
  const newBlog = new Blog({
    title: 'test1',
    author: 'testdude',
    url: 'test.test.com',
    likes: 19
  })

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map(b => b.title)
  expect(title).toContain(
    'test1'
  )
})

test('blog without likes is assigned 0 likes', async () => {
  const newBlog = {
    title: 'test1',
    author: 'testdude',
    url: 'test.test.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const likes = blogsAtEnd.map(b => b.likes)
  expect(likes[likes.length - 1]).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'testdude',
    url: 'test.test.com',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'testtitle',
    author: 'testdude',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})