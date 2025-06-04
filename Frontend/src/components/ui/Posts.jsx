import React from 'react'
import PostFrame from './PostFrame.jsx'
const Posts = () => {
  return (
    <div className='h-screen flex flex-col gap-1 items-center'>{
      [1, 2, 3, 4, 5].map((post) => {
        return (
          <PostFrame key={post} />
        )
      })
    }</div>
  )
}

export default Posts
