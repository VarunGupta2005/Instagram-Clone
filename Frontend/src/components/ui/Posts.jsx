import React, { useEffect, useCallback, useRef } from 'react'
import PostFrame from './PostFrame.jsx'
import { useSelector } from 'react-redux'

const Posts = ({ fetchMorePosts, hasMorePosts, isLoadingPosts }) => {
  const { posts } = useSelector((store) => store.post)
  const observerRef = useRef(null)
  const loadingRef = useRef(null)

  // Intersection Observer callback
  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && hasMorePosts && !isLoadingPosts) {
      fetchMorePosts()
    }
  }, [fetchMorePosts, hasMorePosts, isLoadingPosts])

  // Set up Intersection Observer
  useEffect(() => {
    const option = {
      threshold: 0.1,
      rootMargin: '0px 0px 100px 0px' // Start loading 100px before reaching the bottom
    }
    observerRef.current = new IntersectionObserver(handleObserver, option)

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  return (
    <div className='w-[75%] h-screen flex flex-col gap-1 items-center overflow-y-auto'>
      {posts.map((post) => (
        <PostFrame key={post._id} post={post} />
      ))}

      {/* Loading indicator and intersection observer target */}
      <div ref={loadingRef} className="w-full p-4 flex justify-center">
        {isLoadingPosts && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            <span className="text-gray-600 dark:text-gray-300">Loading more posts...</span>
          </div>
        )}
        {!hasMorePosts && posts.length > 0 && (
          <span className="text-gray-500 dark:text-gray-400">No more posts to load</span>
        )}
      </div>
    </div>
  )
}

export default Posts
