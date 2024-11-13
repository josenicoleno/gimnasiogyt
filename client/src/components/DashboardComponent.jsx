import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { HiAnnotation, HiArrowNarrowUp, HiChatAlt2, HiDocumentText, HiHand, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Spinner, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashboardComponent() {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [excercises, setExcercises] = useState([])
    const [comments, setComments] = useState([])
    const [contacts, setContacts] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalExcercises, setTotalExcercises] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [totalContacts, setTotalContacts] = useState(0)
    const [totalUsersLastMonth, setTotalUsersLastMonth] = useState(0)
    const [totalPostsLastMonth, setTotalPostsLastMonth] = useState(0)
    const [totalExcercisesLastMonth, setTotalExcercisesLastMonth] = useState(0)
    const [totalCommentsLastMonth, setTotalCommentsLastMonth] = useState(0)
    const [totalContactsLastMonth, setTotalContactsLastMonth] = useState(0)
    const { currentUser } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/user/getusers?limit=5`)
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users)
                    setTotalUsers(data.totalUser)
                    setTotalUsersLastMonth(data.totalUserLastMonth)
                }
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?limit=5`)
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts)
                    setTotalPosts(data.totalPosts)
                    setTotalPostsLastMonth(data.totalPostsLastMonth)
                }
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        const fetchExcercises = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/excercise/getexcercises?limit=5`)
                if (res.ok) {
                    const data = await res.json();
                    setExcercises(data.excercises)
                    setTotalExcercises(data.totalExcercises)
                    setTotalExcercisesLastMonth(data.totalExcercisesLastMonth)
                }
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        const fetchComments = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/comment?limit=5`)
                if (res.ok) {
                    const data = await res.json();
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setTotalCommentsLastMonth(data.totalCommentsLastMonth)
                }
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        const fetchContacts = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/contact?sort=desc&limit=5`)
                if (res.ok) {
                    const data = await res.json();
                    setContacts(data.contacts)
                    setTotalContacts(data.totalContacts)
                    setTotalContactsLastMonth(data.totalContactsLastMonth)
                }
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchComments();
            fetchPosts();
            fetchExcercises();
            fetchContacts();
        }
    }, [currentUser])

    return (
        <div className="p-3 md:mx-auto">
            {loading ? <Spinner /> :
                <>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <div className="flex flex-col p-3 mb-5 bg-white dark:bg-slate-500 gap-4 md:w-72 w-full rounded-md shadow-md">
                            <div className="flex justify-between">
                                <div className="">
                                    <h3 className="text-gray-500 text-md uppercase dark:text-white">Total Users</h3>
                                    <p className="text-2xl">{totalUsers}</p>
                                </div>
                                <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {totalUsersLastMonth}
                                </span>
                                <div className="text-gray-600 dark:text-white">Last month</div>
                            </div>
                        </div>
                        {/* POSTS */}
                        <div className="flex flex-col p-3 mb-5 bg-white dark:bg-slate-500 gap-4 md:w-72 w-full rounded-md shadow-md">
                            <div className="flex justify-between">
                                <div className="">
                                    <h3 className="text-gray-500 text-md uppercase dark:text-white">Total POSTS</h3>
                                    <p className="text-2xl">{totalPosts}</p>
                                </div>
                                <HiDocumentText className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {totalPostsLastMonth}
                                </span>
                                <div className="text-gray-600 dark:text-white">Last month</div>
                            </div>
                        </div>
                        {/* COMMENTS */}
                        <div className="flex flex-col p-3 mb-5 bg-white dark:bg-slate-500 gap-4 md:w-72 w-full rounded-md shadow-md">
                            <div className="flex justify-between">
                                <div className="">
                                    <h3 className="text-gray-500 text-md uppercase dark:text-white">Total Comments</h3>
                                    <p className="text-2xl">{totalComments}</p>
                                </div>
                                <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {totalCommentsLastMonth}
                                </span>
                                <div className="text-gray-600 dark:text-white">Last month</div>
                            </div>
                        </div>
                        {/* EXCERCISE */}
                        <div className="flex flex-col p-3 mb-5 bg-white dark:bg-slate-500 gap-4 md:w-72 w-full rounded-md shadow-md">
                            <div className="flex justify-between">
                                <div className="">
                                    <h3 className="text-gray-500 text-md uppercase dark:text-white">Total Excercise</h3>
                                    <p className="text-2xl">{totalExcercises}</p>
                                </div>
                                <HiHand className="bg-emerald-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {totalExcercisesLastMonth}
                                </span>
                                <div className="text-gray-600 dark:text-white">Last month</div>
                            </div>
                        </div>
                        {/* CONTACTS */}
                        <div className="flex flex-col p-3 mb-5 bg-white dark:bg-slate-500 gap-4 md:w-72 w-full rounded-md shadow-md">
                            <div className="flex justify-between">
                                <div className="">
                                    <h3 className="text-gray-500 text-md uppercase dark:text-white">Total Contacts</h3>
                                    <p className="text-2xl">{totalContacts}</p>
                                </div>
                                <HiChatAlt2 className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {totalContactsLastMonth}
                                </span>
                                <div className="text-gray-600 dark:text-white">Last month</div>
                            </div>
                        </div>
                    </div>
                    {/* PARTE DE ABAJO */}
                    <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                        {/* Users */}
                        <div className="flex flex-col w-full md:w-auto shadow-md mb-5 p-2 rounded-md bg-white dark:bg-gray-800">
                            <div className="flex justify-between p-3 text-sm font-semibold">
                                <h1 className="text-center p-2">Recent users</h1>
                                <Button outline gradientDuoTone="purpleToPink">
                                    <Link to="/dashboard?tab=users">
                                        See all
                                    </Link>
                                </Button>
                            </div>
                            <Table hoverable>
                                <Table.Head >
                                    <Table.HeadCell>User Image</Table.HeadCell>
                                    <Table.HeadCell>Username</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {users && users.map(user =>
                                        <Table.Row
                                            key={user._id}
                                            className="dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell>
                                                <img
                                                    src={user.profilePicture}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full bg-gray-500"
                                                />
                                            </Table.Cell>
                                            <Table.Cell>{user.username}</Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                        {/* POSTS */}
                        <div className="flex flex-col w-full md:w-auto shadow-md mb-5 p-2 rounded-md bg-white dark:bg-gray-800">
                            <div className="flex justify-between p-3 text-sm font-semibold">
                                <h1 className="text-center p-2">Recent posts</h1>
                                <Button outline gradientDuoTone="purpleToPink">
                                    <Link to="/dashboard?tab=posts">
                                        See all
                                    </Link>
                                </Button>
                            </div>
                            <Table hoverable>
                                <Table.Head >
                                    <Table.HeadCell>Post Image</Table.HeadCell>
                                    <Table.HeadCell>Title</Table.HeadCell>
                                    <Table.HeadCell>Category</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {posts && posts.map(post =>
                                        <Table.Row
                                            key={post._id}
                                            className="dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell>
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-14 h-10 rounded-md bg-gray-500"
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="w-96">
                                                <Link to={`/post/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="w-5">{post.category}</Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                        {/* COMMENTS */}
                        <div className="flex flex-col w-full md:w-auto shadow-md mb-5 p-2 rounded-md bg-white dark:bg-gray-800">
                            <div className="flex justify-between p-3 text-sm font-semibold">
                                <h1 className="text-center p-2">Recent comments</h1>
                                <Button outline gradientDuoTone="purpleToPink">
                                    <Link to="/dashboard?tab=comments">
                                        See all
                                    </Link>
                                </Button>
                            </div>
                            <Table hoverable>
                                <Table.Head >
                                    <Table.HeadCell>Comment</Table.HeadCell>
                                    <Table.HeadCell>Likes</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {comments && comments.map(comment =>
                                        <Table.Row
                                            key={comment._id}
                                            className="dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell className="w-96">
                                                <Link to={`/post/${comment.postSlug}`}>
                                                    <p className="line-clamp-2">
                                                        {comment.content}
                                                    </p>
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="w-5">{comment.numberOfLikes}</Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                        {/* EXCERCISE */}
                        <div className="flex flex-col w-full md:w-auto shadow-md mb-5 p-2 rounded-md bg-white dark:bg-gray-800">
                            <div className="flex justify-between p-3 text-sm font-semibold">
                                <h1 className="text-center p-2">Recent excercise</h1>
                                <Button outline gradientDuoTone="purpleToPink">
                                    <Link to="/dashboard?tab=excercises">
                                        See all
                                    </Link>
                                </Button>
                            </div>
                            <Table hoverable>
                                <Table.Head >
                                    <Table.HeadCell>Image</Table.HeadCell>
                                    <Table.HeadCell>Title</Table.HeadCell>
                                    <Table.HeadCell>Category</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {excercises && excercises.map(excercise =>
                                        <Table.Row
                                            key={excercise._id}
                                            className="dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell>
                                                <img
                                                    src={excercise.image}
                                                    alt={excercise.title}
                                                    className="w-14 h-10 rounded-md bg-gray-500"
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="w-96">
                                                <Link to={`/excercise/${excercise.slug}`}>
                                                    {excercise.title}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="w-5">{excercise.category}</Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                        {/* CONTACT */}
                        <div className="flex flex-col w-full md:w-auto shadow-md mb-5 p-2 rounded-md bg-white dark:bg-gray-800">
                            <div className="flex justify-between p-3 text-sm font-semibold">
                                <h1 className="text-center p-2">Recent contacts</h1>
                                <Button outline gradientDuoTone="purpleToPink">
                                    <Link to="/dashboard?tab=contacts">
                                        See all
                                    </Link>
                                </Button>
                            </div>
                            <Table hoverable>
                                <Table.Head >
                                    <Table.HeadCell>Username</Table.HeadCell>
                                    <Table.HeadCell>Contact</Table.HeadCell>
                                    <Table.HeadCell>Message</Table.HeadCell>
                                    <Table.HeadCell>Phone</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {contacts && contacts.map(contact =>
                                        <Table.Row
                                            key={contact._id}
                                            className="dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell className="w-5">{contact.userUsername || contact.name}</Table.Cell>
                                            <Table.Cell className="w-5">{contact.email}</Table.Cell>
                                            <Table.Cell className="w-96">
                                                <p className="line-clamp-2">
                                                    {contact.content}
                                                </p>
                                            </Table.Cell>
                                            <Table.Cell className="w-5">
                                                <Link
                                                    to={`https://wa.me/${contact?.phone}`}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                >
                                                    {contact?.phone}
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </>
            }
        </div >
    )
}
