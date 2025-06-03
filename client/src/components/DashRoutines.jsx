import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export const DashRoutines = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userRoutines, setUserRoutines] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [routineIdToDelete, setRoutineIdToDelete] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await fetch(`/api/routine`)
        const data = await res.json();
        if (res.ok) {
          setUserRoutines(data.routines)
          if (data.routines.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchRoutine();
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    try {
      const startIndex = userRoutines.length;
      const res = await fetch(`/api/routine/?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserRoutines(prev => [...prev, ...data.routines]);
        if (data.routines.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/routine/delete/${routineIdToDelete}/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserRoutines(prev => prev.filter(routine => routine._id !== routineIdToDelete))
      }
    } catch (error) {
      console.log(error.message)
    }
    setShowModal(false)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/routine/?searchTerm=${search}`);
    const data = await res.json();
    setUserRoutines(data.routines);
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
      <div className="flex flex-col gap-4">
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 self-center'>Rutinas</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {currentUser.isAdmin && (
            <Button outline gradientDuoTone="purpleToPink" >
              <Link to="/create-routine">
                Nueva rutina
              </Link>
            </Button>
          )}
          <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSearch}>
            <TextInput
              type="text"
              placeholder="Buscar rutina"
              className="w-full md:w-auto"
              onChange={e => setSearch(e.target.value)}
            />
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Buscar
            </Button>
          </form>
        </div>
      </div>
      {currentUser.isAdmin && userRoutines?.length > 0 ?
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userRoutines.map(routine =>
              <Table.Row key={routine._id} className={routine.status ==='Published' ? "bg-white dark:border-gray-700 dark:bg-gray-800" : "bg-gray-200 dark:border-gray-300 dark:bg-gray-600" }>
                <Table.Cell>{new Date(routine.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/routine/${routine.slug}`}>
                    <img
                      src={routine.image}
                      alt={routine.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell className="line-clamp-1">
                  <Link to={`/routine/${routine.slug}`}>
                    {routine.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{routine.category}</Table.Cell>
                <Table.Cell>{routine.status}</Table.Cell>
                <Table.Cell>
                  <Link className="text-teal-500 hover:underline" to={`/update-routine/${routine._id}`}>
                    <span>
                      Edit
                    </span>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setRoutineIdToDelete(routine._id)
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
      : <p>No tienes rutinas aún!</p>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header>¿Estás seguro de querer eliminar la rutina?</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              ¿Estás seguro de querer eliminar la rutina?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>Sí, estoy seguro</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, no estoy seguro.</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
