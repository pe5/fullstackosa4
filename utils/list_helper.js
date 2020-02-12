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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }