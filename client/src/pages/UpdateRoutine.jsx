import { Alert, Button, FileInput, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function UpdateRoutine() {
    const [file, setFile] = useState(null)
    const [fileUploadProgress, setFileUploadProgress] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [directLink, setDirectLink] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        file: '',
        status: "Published",
        startDate: "",
        endDate: ""
    });
    const [publishError, setPublishError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const { routineId } = useParams();

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const res = await fetch(`/api/routine/?routineId=${routineId}`);
                const data = await res.json();
                if (res.ok) {
                    const routine = data.routines[0];
                    setFormData({
                        name: routine.name,
                        description: routine.description,
                        file: routine.file,
                        startDate: routine.startDate ? new Date(routine.startDate).toISOString().split('T')[0] : "",
                        endDate: routine.endDate ? new Date(routine.endDate).toISOString().split('T')[0] : "",
                        status: routine.status
                    });
                    setDirectLink(routine.file);
                    const userIds = routine.users.map(user => user.user._id || user.user);
                    setSelectedUsers(userIds);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchRoutine();
    }, [routineId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers?sort=asc');
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser.isAdmin]);

    const handleUserSelection = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user._id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleDirectLinkChange = (e) => {
        setDirectLink(e.target.value);
        setFormData({ ...formData, file: e.target.value });
    };

    const handledUploadFile = () => {
        try {
            if (!file) {
                return setFileUploadError('Selecciona una archivo Excel o PDF')
            }
            setFileUploadError(null);
            const storage = getStorage(app);
            const folder = '/routines/'
            const fileName = folder + new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setFileUploadProgress(progress.toFixed(0))
                },
                error => {
                    setFileUploadError('Error al subir el archivo')
                    setFileUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        setFileUploadError(null);
                        setFileUploadProgress(null);
                        setDirectLink(downloadURL);
                        setFormData({ ...formData, file: downloadURL })
                    })
                }
            )
        } catch (error) {
            setFileUploadError('Error al subir el archivo');
            setFileUploadProgress(null);
        }
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setPublishError(null)
        setLoading(true);
        try {
            const res = await fetch(`/api/routine/${routineId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, users: selectedUsers })
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/dashboard?tab=routines`)
            }
        } catch (error) {
            setPublishError('Algo salió mal')
        } finally {
            setLoading(false);
        }
    }

    return (
        loading ?
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div> :
            <div className="p-3 max-w-3xl mx-auto min-h-screen">
                <h1 className="text-center text-3xl my-7 font-semibold">
                    Actualizar rutina
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row justify-between">
                        <TextInput
                            id="name"
                            type="text"
                            placeholder="Nombre de la rutina"
                            required
                            className="flex-1"
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-4 sm:flex-row items-center">
                            <label htmlFor="startDate" className="text-sm">Fecha de inicio</label>
                            <input
                                id="startDate"
                                type="date"
                                className="flex-1 border-2 border-gray-300 rounded-md p-2 dark:bg-gray-600"
                                onChange={handleChange}
                                value={formData.startDate}
                            />
                            <label htmlFor="endDate" className="text-sm">Fecha de fin</label>
                            <input
                                id="endDate"
                                type="date"
                                className="flex-1 border-2 border-gray-300 rounded-md p-2 dark:bg-gray-600"
                                onChange={handleChange}
                                value={formData.endDate}
                            />
                        </div>
                        <input
                            type="checkbox"
                            id="status"
                            className="w-4 h-4 dark:bg-gray-600"
                            checked={formData.status === "Published"}
                            onChange={e => setFormData({ ...formData, status: e.target.checked ? "Published" : "Draft" })}
                        />
                        <label htmlFor="status" className="text-sm">
                            Publicado?
                        </label>
                    </div>
                    <div className="flex flex-col gap-4 border-teal-500 border-dotted p-3 border-4">
                        <div className="flex gap-4 items-center justify-between">
                            <FileInput
                                type='file'
                                accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={e => setFile(e.target.files[0])}
                                className="flex-2"
                            />
                            <Button
                                type='button'
                                gradientDuoTone="purpleToBlue"
                                size="sm"
                                outline
                                onClick={handledUploadFile}
                                disabled={fileUploadProgress}
                                className=""
                            >
                                {fileUploadProgress
                                    ? <div className="w-16 h-16">
                                        <CircularProgressbar
                                            value={fileUploadProgress}
                                            text={`${fileUploadProgress || 0}%`}
                                        />
                                    </div>
                                    : 'Subir archivo'}
                            </Button>
                        </div>
                        <TextInput
                            type="text"
                            placeholder="Ingresa el enlace del archivo o sube uno nuevo"
                            value={directLink}
                            onChange={handleDirectLinkChange}
                            className="w-full"
                        />
                    </div>
                    {fileUploadError && (
                        <Alert color="failure" className="mt-4" >
                            {fileUploadError}
                        </Alert>
                    )}
                    {formData.file && (
                        <a href={formData.file} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-200 border-2 border-gray-300 rounded-md p-2">
                            <i className="fas fa-file-pdf text-2xl text-gray-600"></i>
                            <p className="ml-2 text-gray-600">Ver archivo</p>
                        </a>
                    )}
                    <ReactQuill
                        id="description"
                        theme="snow"
                        placeholder="Escribe algo..."
                        className="h-72 mb-12"
                        required
                        onChange={value => setFormData({ ...formData, description: value })}
                        value={formData.description}
                    />
                    {currentUser.isAdmin && (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Seleccionar usuarios</h2>
                            <div className="flex flex-col gap-2 border rounded-lg p-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <input
                                        type="checkbox"
                                        id="selectAll"
                                        checked={selectedUsers.length === users.length}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="selectAll" className="font-medium">
                                        Seleccionar todos
                                    </label>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {users.map(user => (
                                        <div key={user._id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`user-${user._id}`}
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => handleUserSelection(user._id)}
                                                className="w-4 h-4"
                                            />
                                            <label htmlFor={`user-${user._id}`} className="flex items-center gap-2">
                                                <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full" />
                                                {user.username}
                                                <span className="text-sm text-gray-500">{user.email}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <Button type="submit" gradientDuoTone="purpleToPink">Actualizar</Button>
                    {publishError &&
                        <Alert color="failure" className="mt-4">
                            {publishError}
                        </Alert>
                    }
                </form>
            </div>
    )
}
