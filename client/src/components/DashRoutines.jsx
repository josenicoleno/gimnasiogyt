import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table, TextInput, Tooltip } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle, HiDownload } from 'react-icons/hi'

export const DashRoutines = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userRoutines, setUserRoutines] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState(null)
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
    const fetchRoutineUser = async () => {
      try {
        const res = await fetch(`/api/routine/user/${currentUser._id}`)
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
    } else {
      fetchRoutineUser();
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
      const res = await fetch(`/api/routine/${routineIdToDelete}`, {
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
      {userRoutines?.length > 0 ?
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Desde</Table.HeadCell>
              <Table.HeadCell>Hasta</Table.HeadCell>
              {/* <Table.HeadCell>Descripción</Table.HeadCell> */}
              {currentUser.isAdmin && (
                <>
                  <Table.HeadCell>Estado</Table.HeadCell>
                  <Table.HeadCell>Creada por</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Editar</span>
                  </Table.HeadCell>
                  <Table.HeadCell>Borrar</Table.HeadCell>
                </>
              )}
              <Table.HeadCell>Descargar</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userRoutines.map(routine =>
                <Table.Row key={routine._id} className={routine.status === 'Published' ? "bg-white dark:border-gray-700 dark:bg-gray-800" : "bg-gray-200 dark:border-gray-300 dark:bg-gray-600"}>
                  <Table.Cell>
                    <Tooltip
                      content={
                        <div dangerouslySetInnerHTML={{ __html: routine.description || "Sin descripción" }} />
                      }
                      placement="right"
                    >
                      <span 
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => {
                          setSelectedRoutine(routine);
                          setShowViewModal(true);
                        }}
                      >
                        {routine.name}
                      </span>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell>{routine.startDate ? new Date(routine.startDate).toLocaleDateString('es-ES') : "-"}</Table.Cell>
                  <Table.Cell>{routine.endDate ? new Date(routine.endDate).toLocaleDateString('es-ES') : "-"}</Table.Cell>
                  {/* <Table.Cell dangerouslySetInnerHTML={{ __html: routine.description }}>
                  </Table.Cell> */}
                  {currentUser.isAdmin && (<>
                    <Table.Cell>{routine.status}</Table.Cell>
                    <Table.Cell className="line-clamp-1">
                      {routine.createdBy.username}
                    </Table.Cell>
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
                  </>
                  )}
                  <Table.Cell>
                    {routine.file && (
                      <a href={routine.file} download className="flex justify-center">
                        <HiDownload href={routine.file} download />
                      </a>
                    )}
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
      <Modal show={showViewModal} onClose={() => setShowViewModal(false)} size="xl">
        <Modal.Header>
          {selectedRoutine?.name}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Fecha de inicio:</span> {selectedRoutine?.startDate ? new Date(selectedRoutine.startDate).toLocaleDateString('es-ES') : "-"}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Fecha de fin:</span> {selectedRoutine?.endDate ? new Date(selectedRoutine.endDate).toLocaleDateString('es-ES') : "-"}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedRoutine?.description || "Sin descripción" }}
              />
            </div>
            {currentUser.isAdmin && selectedRoutine?.users && selectedRoutine?.users?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Usuarios Asignados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRoutine?.users.map((user) => (
                    <div key={user.user._id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img src={user.user.profilePicture} alt="Imagen del usuario" className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium">{user.user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedRoutine?.file && (
              <div className="mt-4">
                <Button gradientDuoTone="purpleToBlue">
                  <a href={selectedRoutine.file} download className="flex items-center gap-2">
                    <HiDownload className="h-5 w-5" />
                    Descargar archivo
                  </a>
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowViewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
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
