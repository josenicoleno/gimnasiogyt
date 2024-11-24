import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export const DashPersonalRecord = () => {
    const { currentUser } = useSelector(state => state.user)
    const [records, setRecords] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [personalRecordIdToDelete, setPersonalRecordIdToDelete] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchPersonalRecord = async () => {
            try {
                const res = await fetch(`/api/personalRecord/${currentUser._id}`)
                const data = await res.json();
                if (res.ok) {
                    setRecords(data)
                    if (data.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchPersonalRecord();
    }, [currentUser._id])

    const handleShowMore = async () => {
        try {
            const startIndex = records.length;
            const res = await fetch(`/api/personalRecord/getpersonalRecords?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setRecords(prev => [...prev, ...data]);
                if (data.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/personalRecord/${personalRecordIdToDelete}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                setRecords(prev => prev.filter(personalRecord => personalRecord._id !== personalRecordIdToDelete))
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setShowModal(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/personalRecord/getPersonalRecords?searchTerm=${search}`);
        const data = await res.json();
        setRecords(data);
    }

    return (
        <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
            <div className="flex flex-col gap-4">
                <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 self-center'>Mis Marcas</h1>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Link to="/create-personal-record">
                        <Button outline gradientDuoTone="purpleToPink" >
                            Nueva marca
                        </Button>
                    </Link>
                    <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSearch}>
                        <TextInput
                            type="text"
                            placeholder="Search marcas"
                            className="w-full md:w-auto"
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Button gradientDuoTone="purpleToBlue" type="submit">
                            Search
                        </Button>
                    </form>
                </div>
            </div>
            {records.length > 0 ?
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Fecha</Table.HeadCell>
                            {currentUser.isAdmin && <Table.HeadCell>Username</Table.HeadCell>}
                            <Table.HeadCell>Ejercicio</Table.HeadCell>
                            <Table.HeadCell>Peso</Table.HeadCell>
                            <Table.HeadCell>Repes</Table.HeadCell>
                            <Table.HeadCell>Creado por</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {records.map((record) => (
                                <Table.Row key={record._id}>
                                    <Table.Cell>{new Date(record.date).toLocaleDateString()}</Table.Cell>
                                    {currentUser.isAdmin && <Table.Cell>{record.userId.username}</Table.Cell>}
                                    <Table.Cell className="flex flex-row gap-5 items-center">
                                        <img
                                            src={record.exerciseId.image}
                                            alt={record.exerciseId.title}
                                            className="w-14 h-10 object-cover rounded-lg bg-gray-500"
                                        />
                                        {record.exerciseId.title}
                                    </Table.Cell>
                                    <Table.Cell>{record.record.weight} kg</Table.Cell>
                                    <Table.Cell>{record.record.reps}</Table.Cell>
                                    <Table.Cell>{record.createdBy.username}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                            onClick={() => {
                                                setPersonalRecordIdToDelete(record._id);
                                                setShowModal(true);
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && <>
                        <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                            Show more
                        </button>
                    </>
                    }
                </>
                : <p>Aún no tienes marcas!</p>
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header>Delete record?</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
                            Are you sure you want to delete this record?
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
