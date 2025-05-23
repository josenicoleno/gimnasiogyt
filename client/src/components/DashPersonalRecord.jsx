import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Select, Spinner, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle, HiOutlineExternalLink, HiOutlineSearch, HiTrash } from 'react-icons/hi'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const DashPersonalRecord = () => {
    const { currentUser } = useSelector(state => state.user)
    const [exercises, setExercises] = useState([]);
    const [users, setUsers] = useState([]);
    const [records, setRecords] = useState([]);
    const [filterData, setFilterData] = useState({
        userId: currentUser._id,
        exerciseId: ""
    })
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [personalRecordIdToDelete, setPersonalRecordIdToDelete] = useState(null)
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [historyVisible, setHistoryVisible] = useState({});
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [username, setUsername] = useState("");
    const [exerciseName, setExerciseName] = useState("");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: `${exerciseName} kg levantados`,
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
            },
        ],
    });
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        const fetchPersonalRecord = async () => {
            try {
                const queryParams = new URLSearchParams(filterData).toString();
                const res = await fetch(`/api/personalRecord/?${queryParams}`);
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

    // Fetch ejercicios y usuarios
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const exerciseRes = await fetch("/api/exercise/getexercises")
                const exerciseData = await exerciseRes.json();
                setExercises(exerciseData.exercises);
                if (currentUser.isAdmin) {
                    const usersRes = await fetch("/api/user/getusers?sort=asc")
                    const userData = await usersRes.json();
                    setUsers(userData.users);
                } else {
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser.isAdmin]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/personalRecord/${personalRecordIdToDelete}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                setExerciseHistory(prev => prev.filter(exerciseHistory => exerciseHistory._id !== personalRecordIdToDelete))
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setShowModal(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const queryParams = new URLSearchParams(filterData).toString();
            const res = await fetch(`/api/personalRecord/?${queryParams}`);
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                setRecords(data);
                setShowMore(true)
                if (data.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }
    const handleChange = (e) => {
        setFilterData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const fetchExerciseHistory = async (exerciseId, userId) => {
        try {
            const res = await fetch(`/api/personalRecord/personalRecords?exerciseId=${exerciseId}&userId=${userId}`);
            const data = await res.json();
            if (res.ok) {
                setExerciseHistory(data);
                updateChartData(data);
            } else {
                console.error("Error fetching exercise history:", data.message);
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const updateChartData = (history) => {
        if (!history || history.length === 0) {
            console.log("No history data available");
            return;
        }

        const sortedHistory = history.sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = sortedHistory.map(record => new Date(record.date).toLocaleDateString());
        const weights = sortedHistory.map(record => record.record.weight);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: `${exerciseName} kg levantados`,
                    data: weights,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                },
            ],
        });
    };

    const handleShowHistory = (exerciseId, userId) => {
        fetchExerciseHistory(exerciseId, userId);
        setShowHistoryModal(true);
    };

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
                        {currentUser.isAdmin && (
                            <Select
                                id="userId"
                                onChange={handleChange}
                                value={filterData.userId}
                            >
                                <option value="">Selecciona un usuario</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.username}
                                    </option>
                                ))}
                            </Select>
                        )}
                        <Select
                            id="exerciseId"
                            onChange={handleChange}
                            value={filterData.exerciseId}
                        >
                            <option value="">Selecciona un ejercicio</option>
                            {exercises?.map((exercise) => (
                                <option key={exercise._id} value={exercise._id}>
                                    {exercise.title}
                                </option>
                            ))}
                        </Select>
                        <Button gradientDuoTone="purpleToBlue" type="submit">
                            Search
                        </Button>
                    </form>
                </div>
            </div>
            {records.length > 0 ?
                loading ?
                    <Spinner /> :
                    <>
                        <Table hoverable className="shadow-md">
                            <Table.Head>
                                <Table.HeadCell className="hidden md:table-cell">#</Table.HeadCell>
                                <Table.HeadCell className="hidden md:table-cell">Fecha</Table.HeadCell>
                                {currentUser.isAdmin && <Table.HeadCell>Username</Table.HeadCell>}
                                <Table.HeadCell>Ejercicio</Table.HeadCell>
                                <Table.HeadCell>Reps</Table.HeadCell>
                                <Table.HeadCell>Peso</Table.HeadCell>
                                {currentUser.isAdmin && <Table.HeadCell>Creado por</Table.HeadCell>}
                                <Table.HeadCell>Cant. registros</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {records.map((record, i) => (
                                    <Table.Row
                                        key={i}
                                        onMouseEnter={() => {
                                            setActiveRow(true);
                                            setUsername(record.username)
                                            setExerciseName(record.title)
                                            fetchExerciseHistory(record.exerciseId, record.userId);
                                        }}
                                        onMouseLeave={() => setActiveRow(false)}
                                    >
                                        <Table.Cell className="hidden md:table-cell">{i + 1}</Table.Cell>
                                        <Table.Cell className="hidden md:table-cell">{new Date(record.date).toLocaleDateString()}</Table.Cell>
                                        {currentUser.isAdmin && <Table.Cell>{record.username}</Table.Cell>}
                                        <Table.Cell>
                                            <Link to={`/exercise/${record.slug}`} className="flex flex-row gap-3 items-center">
                                                <img
                                                    src={record.image}
                                                    alt={record.title}
                                                    className="w-14 h-10 object-cover rounded-lg bg-gray-500 hidden md:table-cell"
                                                />
                                                {record.title}
                                                <HiOutlineExternalLink />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>{record.record.reps}</Table.Cell>
                                        <Table.Cell>{record.record.weight} kg</Table.Cell>
                                        {currentUser.isAdmin && <Table.Cell>{record.createdByUsername}</Table.Cell>}
                                        <Table.Cell className="flex flex-row items-center justify-center gap-2">
                                            {record.count}
                                            {record.count > 1 &&
                                                <HiOutlineSearch onClick={() => handleShowHistory(record.exerciseId, record.userId)} className="w-5 h-5 hover:cursor-pointer" />
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <div className="mt-10 mb-10">
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
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

            <Modal show={showHistoryModal} onClose={() => setShowHistoryModal(false)} size='xl'>
                <Modal.Header>{`${exerciseName} de ${username}`}</Modal.Header>
                <Modal.Body>
                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-md">
                            <Table.Head>
                                <Table.HeadCell>#</Table.HeadCell>
                                <Table.HeadCell>Fecha</Table.HeadCell>
                                <Table.HeadCell>Peso</Table.HeadCell>
                                <Table.HeadCell>Repes</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {exerciseHistory.map((historyRecord, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{new Date(historyRecord.date).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>{historyRecord.record.weight} kg</Table.Cell>
                                        <Table.Cell>{historyRecord.record.reps}</Table.Cell>
                                        <Table.Cell>
                                            <HiTrash
                                                className="font-medium text-red-500 hover:underline 
                                                cursor-pointer"
                                                onClick={() => {
                                                    setPersonalRecordIdToDelete(historyRecord._id);
                                                    setShowModal(true);
                                                }}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    <div className="mt-4">
                        {chartData.labels.length > 0 && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
