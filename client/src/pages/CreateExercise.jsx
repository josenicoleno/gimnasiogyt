import { Alert, Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate } from "react-router-dom";

export default function CreateExercise() {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exerciseCategories, setExerciseCategories] = useState([]);
    const [machines, setMachines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoriesRes, machinesRes] = await Promise.all([
                    fetch(`/api/exerciseCategory/`),
                    fetch(`/api/machine/`)
                ]);
                const categoriesData = await categoriesRes.json();
                const machinesData = await machinesRes.json();
                setExerciseCategories(categoriesData);
                setMachines(machinesData.machines);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handledUploadImage = () => {
        try {
            if (!file) {
                return setImageUploadError('Please select an image')
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const folder = '/exercises/'
            const fileName = folder + new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0))
                },
                error => {
                    setImageUploadError('Image upload error');
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                        setFormData({ ...formData, image: downloadURL })
                    })
                }
            )
        } catch (error) {
            setImageUploadError('Image upload error');
            setImageUploadProgress(null);
            console.log(error)
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
            const res = await fetch(`/api/exercise/create`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/exercise/${data.savedExercise.slug}`)
            }
        } catch (error) {
            setPublishError('Something went wrong!!')
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
                    Create a exercise
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row justify-between">
                        <TextInput
                            id="title"
                            type="text"
                            placeholder="Title"
                            required
                            className="flex-1"
                            onChange={handleChange}
                        />
                        <Select
                            id="category"
                            onChange={handleChange}
                        >   
                            <option value="uncategorized">Select a category</option>
                            {exerciseCategories.map((exerciseCategory) => (
                                <option key={exerciseCategory._id} value={exerciseCategory.name}>{exerciseCategory.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label htmlFor="machines" className="text-lg font-semibold">Máquinas:</label>
                        <Select
                            id="machines"
                            multiple
                            onChange={e => {
                                const selectedMachines = Array.from(e.target.selectedOptions, option => option.value);
                                setFormData({ ...formData, machines: selectedMachines });
                            }}
                        >
                            {machines.map((machine) => (
                                <option key={machine._id} value={machine._id}>{machine.title}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                        <FileInput
                            type='file'
                            accept="image/*"
                            onChange={e => setFile(e.target.files[0])}
                        />
                        <Button
                            type='button'
                            gradientDuoTone="purpleToBlue"
                            size="sm"
                            outline
                            onClick={handledUploadImage}
                            disabled={imageUploadProgress}
                        >
                            {imageUploadProgress
                                ? <div className="w-16 h-16">
                                    <CircularProgressbar
                                        value={imageUploadProgress}
                                        text={`${imageUploadProgress || 0}%`}
                                    />
                                </div>
                                : 'Upload image'}
                        </Button>
                    </div>
                    {imageUploadError && (
                        <Alert color="failure" className="mt-4" >
                            {imageUploadError}
                        </Alert>
                    )}
                    {formData.image && (
                        <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />
                    )}
                    <ReactQuill
                        id="content"
                        theme="snow"
                        placeholder="Write something..."
                        className="h-72 mb-12"
                        required
                        onChange={value => setFormData({ ...formData, content: value })}
                    />
                    <Button type="submit" gradientDuoTone="purpleToPink">Publish</Button>
                    {publishError &&
                        <Alert color="failure" className="mt-4">
                            {publishError}
                        </Alert>
                    }
                </form>
            </div>
    )
}
