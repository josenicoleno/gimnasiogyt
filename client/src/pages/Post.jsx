import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react'
import CallToAction from "../components/CallToAction"
import CommentSection from "../components/CommentSection"
import PostCard from "../components/PostCard"
import { useSelector } from "react-redux"
import 'react-quill-new/dist/quill.snow.css';
import { HiViewList, HiViewGrid } from "react-icons/hi"


export default function Post() {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [post, setPost] = useState(null)
    const [recentPost, setRecentPost] = useState(null)
    const [typePost, setTypePost] = useState(null)
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json();
                if (!res.ok) {
                    setError(true)
                    return
                }
                setPost(data.posts[0])
                if (data.posts[0].status !== 'Published' && (!currentUser || !currentUser.isAdmin)) {
                    navigate('/')
                    return
                }
                const resCategory = await fetch(`/api/category/?category=${data.posts[0].category}`)
                const dataCategory = await resCategory.json();
                setTypePost(dataCategory[0]?.type || 'post')
                setError(false)
            } catch (error) {
                console.log(error.message)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        const fetchRecentPost = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=4&status=Published`)
                if (res.ok) {
                    const data = await res.json();
                    setRecentPost(data.posts
                        .filter(post => post.slug !== postSlug)
                        .slice(0, 3)
                    )
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchRecentPost();
        fetchPost();
    }, [postSlug])

    if (loading)
        return <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>

    return (
        <>
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                    {post?.title}
                </h1>
                <Link
                    to={`/search?category=${post?.category}`}
                    className="self-center mt-5"
                >
                    <Button color="gray" pill size="xs">{post?.category}</Button>
                </Link>
                <div className="hidden md:flex justify-end items-center gap-4">
                    <Button
                        color={typePost === 'post' ? 'blue' : 'gray'}
                        onClick={() => setTypePost('post')}
                        size="sm"
                    >
                        <HiViewList className="h-5 w-5" />
                    </Button>
                    <Button
                        color={typePost === 'card' ? 'blue' : 'gray'}
                        onClick={() => setTypePost('card')}
                        size="sm"
                    >
                        <HiViewGrid className="h-5 w-5" />
                    </Button>
                </div>
                {typePost === 'post' ?
                    <>
                        <img
                            src={post?.image}
                            alt={post?.title}
                            className="mt-10 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between items-baseline p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                            <div className="flex items-center gap-1 mt-5 text-gray-500">
                                <p>Escrito por: </p>
                                <img className='w-10 h-10 rounded-full object-cover' src={post?.userId.profilePicture} alt="profile" />
                                <Link className='text-xs text-cyan-600 hover:underline' to='/dashboard?tab=profile'>
                                    {post?.userId.username}
                                </Link>
                            </div>
                            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="italic">{post && (post.content.length / 1000 + 1).toFixed(0)} mins read</span>
                        </div>
                        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post?.content }}>
                        </div>
                    </>
                    : //Card
                    <>
                        <div className="grid md:grid-cols-2 gap-8 mt-10">
                            {/* Columna de imagen */}
                            <div className="flex flex-col justify-center items-start">
                                <img
                                    src={post?.image}
                                    alt={post?.title}
                                    className="max-h-[600px] w-full object-cover rounded-lg"
                                />
                                <div className="flex justify-between items-baseline p-3 border-slate-500 mx-auto w-full max-w-2xl text-xs">
                                    <div className="flex items-center gap-1 mt-5 text-gray-500">
                                        <p>Escrito por: </p>
                                        <img className='w-10 h-10 rounded-full object-cover' src={post?.userId.profilePicture} alt="profile" />
                                        <Link className='text-xs text-cyan-600 hover:underline' to='/dashboard?tab=profile'>
                                            {post?.userId.username}
                                        </Link>
                                    </div>
                                    <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span className="italic">{post && (post.content.length / 1000 + 1).toFixed(0)} mins read</span>
                                </div>
                            </div>
                            {/* Columna de contenido */}
                            <div className="flex flex-col space-y-4">
                                <div className="post-content prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post?.content }} />
                            </div>
                        </div>

                    </>
                }
            </main>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection postId={post?._id} />
            <div className="flex flex-col justify-center items-center max-w-8xl p-3">
                <h1 className="text-xl mt-5">Recent posts</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentPost &&
                        recentPost.map(post => <PostCard key={post._id} post={post} />)
                    }
                </div>
            </div>
        </>
    )
}
