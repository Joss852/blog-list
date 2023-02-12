const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return blogs.length === 0 ? 0 : likes
}

module.exports = {
  dummy,
  totalLikes,
}
