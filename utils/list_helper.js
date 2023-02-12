const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return blogs.length === 0 ? 0 : likes
}

const favoriteBlog = blogs => {
  const mappedBlogs = blogs.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    }
  })

  const reducer = (acc, curr, index) => {
    if (index === 0) {
      return curr
    }

    return acc.likes > curr.likes ? acc : curr
  }

  return mappedBlogs.reduce(reducer)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
