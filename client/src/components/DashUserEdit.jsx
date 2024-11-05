import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    deleteOtherUserFailure,
    deleteOtherUserStart,
    deleteOtherUserSuccess,
    updateOtherUserStart,
    updateOtherUserSuccess,
    updateOtherUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function DashUserEdit() {
    const { currentUser, error, loading } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserFailure, setUpdateUserFailure] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        isAdmin: false,
        banned: false,
    });
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleImageChange = e => {
        const file = e.target.files[0]
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
    }
    const [userId, setUserId] = useState(null)
    const location = useLocation();
    useEffect(() => {
        if (currentUser.isAdmin) {
            const urlParams = new URLSearchParams(location.search)
            const userIdFromUrl = urlParams.get('userId')
            if (userIdFromUrl) { setUserId(userIdFromUrl) }
        } else {
            navigate('/dashboard?tab=profile')
        }
    }, [location.search, currentUser._id])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user/${userId}`)
            if (!res.ok) {
                setUpdateUserFailure('User not found')
                setTimeout(() => {
                    navigate('/dashboard?tab=users')
                }, 1000)
                return
            }
            const data = await res.json()
            setFormData(data)
        }
        if (userId) {
            fetchUser()
        }
    }, [userId])

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
        const filename = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, filename)
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
            dispatch(updateOtherUserStart());
            const res = await fetch(`api/user/update/${formData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setUpdateUserFailure(data.message)
                return dispatch(updateOtherUserFailure(data.message));
            } else {
                setUpdateUserSuccess("User's profile updated successfully");
                return dispatch(updateOtherUserSuccess());
            }
        } catch (error) {
            setUpdateUserFailure(error.message)
            dispatch(updateOtherUserFailure(error.message));
        }
    }
    const handleDeleteUser = async e => {
        try {
            dispatch(deleteOtherUserStart())
            const res = await fetch(`api/user/delete/${formData._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                return dispatch(deleteOtherUserFailure(data.message))
            } else {
                setShowModal(false)
                setUpdateUserSuccess('User deleted successfully')
                dispatch(deleteOtherUserSuccess(data))
                setTimeout(() => {
                    navigate('/dashboard?tab=users')
                }, 1000)
                return
            }
        } catch (error) {
            dispatch(deleteOtherUserFailure(error))
        }
    }

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{ root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }, path: { stroke: `rgba(62, 152,199, ${imageFileUploadProgress / 100})` } }} />
                    )}
                    <img src={imageFileUrl || formData.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
                </div>
                {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
                <TextInput
                    id="username"
                    type="text"
                    placeholder="usarname"
                    defaultValue={formData.username}
                    onChange={handleChange}
                />
                <TextInput
                    id="email"
                    type="email"
                    placeholder="usarname"
                    defaultValue={formData.email}
                    onChange={handleChange}
                />
                <TextInput
                    id="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                />
                <div className="flex mb-4 justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            className="w-4 h-4"
                            checked={formData.isAdmin}
                            onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })}
                        />
                        <label htmlFor="isAdmin" className="text-sm">
                            Is Admin?
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="banned"
                            className="w-4 h-4"
                            checked={formData.banned}
                            onChange={e => setFormData({ ...formData, banned: e.target.checked })}
                        />
                        <label htmlFor="banned" className="text-sm">
                            Is Banned?
                        </label>
                    </div>
                </div>
                <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {loading ? 'Loading...' : 'Update'}
                </Button>
            </form>
            <div className="flex flex-col max-w-lg mx-auto mt-5">
                <Button
                    type="button"
                    gradientDuoTone="purpleToPink"
                    onClick={() => setShowModal(true)}
                    disabled={loading || imageFileUploading}
                >
                    Delete Account
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
                <Modal.Header>Delete user?</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, I'm not.</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
