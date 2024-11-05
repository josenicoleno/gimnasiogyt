import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react'
import CallToAction from "../components/CallToAction"
import CommentSection from "../components/CommentSection"
import PostCard from "../components/PostCard"

export default function Post() {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [post, setPost] = useState(null)
    const [recentPost, setRecentPost] = useState(null)
    const [typePost, setTypePost] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json();
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                if (res.ok) {
                    setPost(data.posts[0])
                    const resCategory = await fetch(`/api/category/?category=${data.posts[0].category}`)
                    const dataCategory = await resCategory.json();
                    setTypePost(dataCategory[0]?.type || 'post')
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {
                console.log(error.message)
                setError(true)
                setLoading(false)
            }
        }
        fetchPost();
    }, [postSlug])

    useEffect(() => {
        const recentPost = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=3`)
                if (res.ok) {
                    const data = await res.json();
                    setRecentPost(data.posts)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        recentPost();
    }, [])

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
                {typePost === 'post' ?
                    <>
                        <img
                            src={post?.image}
                            alt={post?.title}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="italic">{post && (post.content.length / 1000 + 1).toFixed(0)} mins read</span>
                        </div>
                        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post?.content }}>
                        </div>
                    </>
                    :
                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Columna de imagen */}
                        <div className="flex justify-center items-start">
                            <img
                                src={post?.image}
                                alt={post?.title}
                                className="max-h-[600px] w-full object-cover rounded-lg"
                            />
                        </div>
                        {/* Columna de contenido */}
                        <div className="flex flex-col space-y-4">
                            <div className="post-content" dangerouslySetInnerHTML={{ __html: post?.content }}>
                            </div>
                        </div>
                    </div>
                }
            </main>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection postId={post?._id} />
            <div className="flex flex-col justify-center items-center max-w-8xl p-3">
                <h1 className="text-xl mt-5">Recent articles</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentPost &&
                        recentPost.map(post => <PostCard key={post._id} post={post} />)
                    }
                </div>
            </div>
        </>
    )
}
