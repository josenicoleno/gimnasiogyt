import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export const DashExercise = () => {
  const { currentUser } = useSelector(state => state.user)
  const [exercises, setExercises] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [exerciseIdToDelete, setExerciseIdToDelete] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await fetch(`/api/exercise/getexercises`)
        /*   const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`) */
        const data = await res.json();
        if (res.ok) {
          setExercises(data.exercises)
          if (data.exercises.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchExercise();
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    try {
      const startIndex = exercises.length;
      const res = await fetch(`/api/exercise/getexercises?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setExercises(prev => [...prev, ...data.exercises]);
        if (data.exercises.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`api/exercise/delete/${exerciseIdToDelete}/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        setExercises(prev => prev.filter(exercise => exercise._id !== exerciseIdToDelete))
      }
    } catch (error) {
      console.log(error.message)
    }
    setShowModal(false)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/exercise/getexercises?searchTerm=${search}`);
    const data = await res.json();
    setExercises(data.exercises);
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
      <div className="flex flex-col gap-4">
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 self-center'>Exercises</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {currentUser.isAdmin && (
            <Button outline gradientDuoTone="purpleToPink" >
              <Link to="/create-exercise">
                Create Exercise
              </Link>
            </Button>
          )}
          <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSearch}>
            <TextInput
              type="text"
              placeholder="Search exercise"
              className="w-full md:w-auto"
              onChange={e => setSearch(e.target.value)}
            />
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Search
            </Button>
          </form>
        </div>
      </div>
      {currentUser.isAdmin && exercises.length > 0 ?
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
              {exercises.map(exercise =>
                <Table.Row key={exercise._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(exercise.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/exercise/${exercise.slug}`}>
                      <img
                        src={exercise.image}
                        alt={exercise.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="line-clamp-1">
                    <Link to={`/exercise/${exercise.slug}`}>
                      {exercise.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{exercise.category}</Table.Cell>
                  <Table.Cell>
                    <Link className="text-teal-500 hover:underline" to={`/update-exercise/${exercise._id}`}>
                      <span>
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setExerciseIdToDelete(exercise._id)
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
        : <p>You have not exercises yet!</p>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header>Delete exercise?</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete the exercise?
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
