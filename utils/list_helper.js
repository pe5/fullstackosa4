const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}  

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const most = Math.max.apply(null, likes)
    blogs = blogs.filter(blog => blog.likes === most)
    return blogs[0]
}

const mostBlogs = (blogs) => {
    const authors = lodash.chain(blogs)
        .groupBy('author')
        .map((value, key) => ({author: key, blogs: value})).value()
    const nro = authors.map(auth => auth.blogs.length)
    const most = Math.max.apply(null, nro)
    const best = authors.filter(auth => auth.blogs.length === most)
    const name = best[0].author
    const ret = {
        name: name,
        blogs: best[0].blogs.length
    }
    return ret
}

const mostLikes = (blogs) => {
    const authors = lodash.chain(blogs)
        .groupBy('author')
        .map((value, key) => ({author: key, blogs: value})).value()
    const likes = authors.map(auth => totalLikes(auth.blogs))
    const most = Math.max.apply(null, likes)
    const best = authors.filter(auth => totalLikes(auth.blogs) === most)
    const name = best[0].author
    const ret = {
        name: name,
        likes: most
    }
    return ret
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }