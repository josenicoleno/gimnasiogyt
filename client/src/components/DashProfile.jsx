import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    updateFailure,
    updateStart,
    updateSuccess,
    deleteFailure,
    deleteStart,
    deleteSuccess,
    signoutSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserFailure, setUpdateUserFailure] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const handleImageChange = e => {
        const file = e.target.files[0]
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile])

    const uploadImage = async () => {
        //service firebase.storage ocuments/users/$(request.auth.uid)).data.isAdmin;
        // service firebase.storage {
        //   match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read
        //       allow write: if 
        //       request.resource.size < 2 * 1024 * 1024 && 
        //       request.resource.contentType('image/.*');
        //     }
        // }
        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const folder = '/profiles/'
        const fileName = folder + new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
                setImageFileUploadProgress(progress.toFixed(0))
            },
            error => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB).')
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploadProgress(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setUpdateUserFailure(null)
        setUpdateUserSuccess(null)
        if (Object.keys(formData).length === 0) {
            setUpdateUserFailure('No changes made')
            return;
        }
        if (imageFileUploading) {
            setUpdateUserFailure('Please wait for image to upload')
            return
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setUpdateUserFailure(data.message)
                return dispatch(updateFailure(data.message));
            } else {
                setUpdateUserSuccess("User's profile updated successfully");
                return dispatch(updateSuccess(data))
            }
        } catch (error) {
            setUpdateUserFailure(error.message)
            dispatch(updateFailure(error.message));
        }
    }
    const handleDeleteUser = async e => {
        try {
            dispatch(deleteStart())
            const res = await fetch(`api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                return dispatch(deleteFailure(data.message))
            } else {
                setShowModal(false)
                dispatch(deleteSuccess(data))
            }
        } catch (error) {
            dispatch(deleteFailure(error))
        }
    }

    const handleSignout = async () => {
        try {
            const res = await fetch(`api/user/signout`, {
                method: 'POST'
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Perfil</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{ root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }, path: { stroke: `rgba(62, 152,199, ${imageFileUploadProgress / 100})` } }} />
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
                </div>
                {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
                <TextInput
                    id="username"
                    type="text"
                    placeholder="usarname"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    id="email"
                    type="email"
                    placeholder="usarname"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    id="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {loading ? 'Loading...' : 'Actualizar'}
                </Button>
            </form>
            <div className="flex flex-col gap-4 mt-5">
                <Button
                    type="submit"
                    gradientDuoTone="pinkToOrange"
                    outline
                    disabled={loading || imageFileUploading}
                    onClick={handleSignout}
                >
                    {loading ? 'Loading...' : 'Desloguearse'}
                </Button>
            </div>
            <div className="flex flex-col gap-4 mt-20">
                <Button
                    type="submit"
                    gradientDuoTone="pinkToOrange"
                    outline
                    disabled={loading || imageFileUploading}
                    onClick={() => setShowModal(true)}
                >
                    {loading ? 'Loading...' : 'Eliminar cuenta'}
                </Button>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>)
            }
            {updateUserFailure && (
                <Alert color="failure" className="mt-5">
                    {updateUserFailure}
                </Alert>)
            }
            {error && (
                <Alert color="failure" className="mt-5">
                    {error}
                </Alert>)
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header>¿Borrar usuario?</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
                            ¿Estás seguro que queres eliminar tu usuario?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>Sí, estoy seguro</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, no lo estoy</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
