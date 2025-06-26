import React from 'react'
import PostFrame from './PostFrame.jsx'
import { useSelector } from 'react-redux'
const Posts = () => {
  const { posts } = useSelector((store) => store.post)
  return (
    <div className='w-[75%] h-screen flex flex-col gap-1 items-center'>{
      posts.map((post) => {
        return (
          <PostFrame key={post._id} post={post} />
        )
      })
    }</div>
  )
}

export default Posts
