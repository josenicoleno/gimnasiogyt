import { Alert, Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        _id: '',
        title: '', // Valor inicial vacío
        category: 'uncategorized', // Valor inicial definido
        image: '',
        content: ''
    });
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user)
    const [cont, setCont] = useState("")
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    setPublishError(data.message);
                    return;
                }
                setPublishError(null);
                setFormData(data.posts[0]);
                setCont(data.posts[0].content);
            } catch (error) {
                console.log(error);
                setPublishError('Error al cargar el post');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/category/');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.log(error);
            }
        };
        // Ejecutar ambas funciones
        fetchPost();
        fetchCategories();
    }, [postId]);

    const handleUploadImage = () => {
        try {
            if (!file) {
                return setImageUploadError('Please select an image')
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
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

    const handleSubmit = async e => {
        e.preventDefault();
        setPublishError(null)
        setLoading(true);
        try {
            const res = await fetch(`/api/post/update/${formData._id}/${currentUser._id}`, {
                method: "PUT",
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
                navigate(`/post/${data.slug}`)
                return
            }
        } catch (error) {
            setPublishError('Something went wrong ' + error)
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
                    Update post
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row justify-between">
                        <TextInput
                            id="title"
                            type="text"
                            placeholder="Title"
                            required
                            className="flex-1"
                            value={formData.title}
                            onChange={(e) => { setFormData({ ...formData, title: e.target.value }) }}
                        />
                        <Select
                            id="category"
                            itemType="string"
                            value={formData.category || 'uncategorized'}
                            onChange={(e) => { setFormData({ ...formData, category: e.target.value }) }}
                        >
                            <option value="uncategorized">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>{category.name}</option>
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
                            onClick={handleUploadImage}
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
                    {<ReactQuill
                        id="content"
                        theme="snow"
                        placeholder="Write something..."
                        className="h-72 mb-12"
                        required
                        value={formData.content}
                        onChange={value => setFormData({ ...formData, content: value })}
                    />}
                    <Button type="submit" gradientDuoTone="purpleToPink">Update</Button>
                    {publishError &&
                        <Alert color="failure" className="mt-4">
                            {publishError}
                        </Alert>
                    }
                </form>
            </div>
    )
}
