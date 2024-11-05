import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment';
import { HiOutlineExclamationCircle } from "react-icons/hi"

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([])
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComment/${postId}`)
                const data = await res.json();
                if (res.ok) {
                    setCommentError(null)
                    setComments(data.comments)
                }
            } catch (error) {
                setCommentError(error)
            }
        }
        fetchComments();
    }, [postId])

    const handleSubmit = async e => {
        e.preventDefault()
        if (comment.length > 200)
            return
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            })
            const data = await res.json();
            if (res.ok) {
                setComment('')
                setCommentError(null)
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentError(error)
        }
    }

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, { method: "PUT" })
            if (res.ok) {
                const data = await res.json();
                setComments(
                    comments.map(comment =>
                        comment._id === commentId ? {
                            ...comment,
                            likes: data.likes,
                            numberOfLikes: data.likes.length
                        }
                            : comment
                    )
                )
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleEdit = (comment, newContent) => {
        setComments(
            comments.map(c =>
                comment._id === c._id ? {
                    ...comment,
                    content: newContent
                }
                    : c
            )
        )
    }

    const handleDelete = async commentId => {
        setShowModal(false)
        if (!currentUser) {
            navigate('/sign-in')
            return
        }
        try {
            const res = await fetch(`/api/comment/delete/${commentId}`, { method: 'DELETE', })
            if (res.ok) {
                setComments(
                    comments.filter(comment => comment._id !== commentId)
                )
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ?
                (
                    <div className="flex items-center gap-1 my-5 text-gray-500">
                        <p>Signed in as: </p>
                        <img className='w-10 h-10 rounded-full object-cover' src={currentUser.profilePicture} alt="profile" />
                        <Link className='text-xs text-cyan-600 hover:underline' to='/dashboard?tab=profile'>
                            @{currentUser.username}
                        </Link>
                    </div>
                )
                : <div className="flex gap-1 text-sm text-teal-500">
                    You must be signed in to comment
                    <Link className='text-blue-500 hover:underline' to='/sign-in'>
                        Sign in
                    </Link>
                </div>
            }
            {comments.length === 0 &&
                <p className='text-sm my-5'>Make the first comment!</p>
            }
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        placeholder='Add a comment...'
                        rows='3'
                        maxLength='200'
                        onChange={e => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
                        <Button
                            type='submit'
                            outline
                            gradientDuoTone='purpleToBlue'
                        >
                            Submit
                        </Button>
                    </div>
                    {commentError &&
                        <Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    }
                </form>
            )}
            {comments.length > 0 &&
                <>
                    <div className='text-sm flex items-center my-5 gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-500 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {
                        comments.map(comment =>
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onLike={handleLike}
                                onEdit={handleEdit}
                                onDelete={commentId => {
                                    setShowModal(true)
                                    setCommentToDelete(commentId)
                                }}
                            />
                        )
                    }
                </>
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header>Delete comment?</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
                            Are you sure you want to delete the comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => handleDelete(commentToDelete)}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, I'm not.</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >

    )
}
