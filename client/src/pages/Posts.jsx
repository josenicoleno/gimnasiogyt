import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { Spinner } from 'flowbite-react'

export default function Posts() {
    const { category } = useParams()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch(`/api/post/getposts?category=${category}`)
            const data = await res.json()
            setPosts(data.posts)
        }
        fetchPosts()
    }, [category])
    
    return (
        <div>
            <div className='min-h-screen p-7'>
                <h1 className='flex items-center gap-2 text-3xl font-semibold sm:border-b sm:border-gray-500 pb-4'>
                    Post <p className='text-teal-500'>{category}</p>
                </h1>
                {loading &&
                    <div className='flex justify-center items-center min-h-screen'>
                        <Spinner size='xl' />
                    </div>
                }
                {!loading && posts.length === 0 &&
                    <p className='text-xl text-gray-500'>No posts found.</p>
                }
                <div className='flex flex-wrap gap-4 m-4'>
                    {!loading && posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
                {showMore &&
                    <p onClick={handleShowMore} className='text-center text-sm text-teal-500 cursor-pointer hover:underline'>Show more</p>
                }
            </div>
        </div>
    )
}
