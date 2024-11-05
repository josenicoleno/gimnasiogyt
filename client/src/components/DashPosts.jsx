import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts`)
        /*   const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`) */
        const data = await res.json();
        if (res.ok) {
          setUserPost(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    try {
      const startIndex = userPost.length;
      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPost(prev => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`api/post/delete/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPost(prev => prev.filter(post => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error.message)
    }
    setShowModal(false)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/post/getposts?searchTerm=${search}`);
    const data = await res.json();
    setUserPost(data.posts);
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
      <div className="flex flex-col gap-4">
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 self-center'>Posts</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {currentUser.isAdmin && (
            <Button outline gradientDuoTone="purpleToPink" >
              <Link to="/create-post">
                Create Post
              </Link>
            </Button>
          )}
          <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSearch}>
            <TextInput
              type="text"
              placeholder="Search post"
              className="w-full md:w-auto"
              onChange={e => setSearch(e.target.value)}
            />
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Search
            </Button>
          </form>
        </div>
      </div>
      {currentUser.isAdmin && userPost.length > 0 ?
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userPost.map(post =>
              <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell className="line-clamp-1">
                  <Link to={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                    <span>
                      Edit
                    </span>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setPostIdToDelete(post._id)
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
      : <p>You have not posts yet!</p>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header>Delete post?</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete the post?
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
