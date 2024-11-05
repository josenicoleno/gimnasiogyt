import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export const DashComments = () => {
  const { currentUser } = useSelector(state => state.user)
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/`)
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments)
          if (data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`api/comment/delete/${commentIdToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        setComments(prev => prev.filter(comment => comment._id !== commentIdToDelete))
      }
    } catch (error) {
      console.log(error.message)
    }
    setShowModal(false)
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ?
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map(comment =>
                <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className="line-clamp-1">
                    {comment?.content}
                  </Table.Cell>
                  <Table.Cell >
                    {comment?.userUsername ? comment?.userUsername : 'anonymous'}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${comment?.postSlug}`}>
                      <img
                        src={comment?.postImage}
                        alt={comment?.postTitle}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell className="line-clamp-2">
                    <Link to={`/post/${comment?.postSlug}`}>
                      {comment?.postTitle}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{comment?.postCategory}</Table.Cell>
                  <Table.Cell>
                    <Link className="text-teal-500 hover:underline" to={`/post/${comment?.postSlug}`}>
                      <span>
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setCommentIdToDelete(comment._id)
                        setShowModal(true)
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {showMore && <>
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          </>
          }
        </>
        : <p>You have not comments yet!</p>
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
              <Button color="failure" onClick={handleDelete}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, I'm not.</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
