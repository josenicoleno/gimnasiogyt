import { Alert, Button, Checkbox, FileInput, Modal, Select, Table, TextInput } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';

export default function DashCategory() {
    const [formData, setFormData] = useState({
        name: "",
        inMenu: false,
        type: "card",
        image: null,
        order: null,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [createCategory, setCreateCategory] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(false);
    const [file, setFile] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [categoryIdToUpdate, setCategoryIdToUpdate] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`/api/category/`);
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategories();
    }, []);

    const handleSubmitCreateCategory = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError(null);
        if (formData.name.split(" ").join("").length < 3) {
            return setError("Name must be at least 3 words long");
        }
        try {
            setLoading(true);
            const res = await fetch(`/api/category/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                return setError("Failed to create category");
            }
            const data = await res.json();
            setFormData({
                name: "",
                inMenu: false,
                type: "card",
                image: null,
                order: null,
            });
            setSuccessMessage("Category created successfully");
            setSuccess(true);
            setCreateCategory(false);
            setCategories(prev => [...prev, data]);
        } catch (error) {
            return setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitUpdateCategory = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError(null);
        if (formData.name.split(" ").join("").length < 3) {
            return setError("Name must be at least 3 words long");
        }
        try {
            setLoading(true);
            const res = await fetch(`/api/category/update/${categoryIdToUpdate}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                return setError("Failed to update category");
            }
            const data = await res.json();
            setFormData({
                name: "",
                inMenu: false,
                type: "card",
                image: null,
                order: null,
            });
            setSuccessMessage("Category updated successfully");
            setSuccess(true);
            setUpdateCategory(false);
            setCategories(prev => prev.map(category => category._id === categoryIdToUpdate ? data : category));
        } catch (error) {
            return setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCategory = async () => {
        setShowModal(false);
        setLoading(true);
        setSuccessMessage("");
        setError(null);
        try {
            const res = await fetch(`/api/category/delete/${categoryIdToDelete}`,
                {
                    method: "DELETE",
                }
            );
            if (!res.ok) {
                return setError("Failed to delete category");
            }
            setSuccessMessage("Category deleted successfully");
            setSuccess(true);
            setCategories(prev => prev.filter(category => category._id !== categoryIdToDelete));
        } catch (error) {
            console.log(error.message);
        } finally {
            setCategoryIdToDelete(null);
            setLoading(false);
        }
    }

    const handledUploadImage = () => {
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

    return (
        /* Columna 1 */
        <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
            <div className="flex flex-col flex-1 gap-4 mb-4">
                <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 self-center'>
                    Categories
                </h1>
                <Button
                    className='self-start'
                    outline
                    gradientDuoTone="purpleToPink"
                    onClick={(e) => {
                        e.preventDefault();
                        setCreateCategory(true);
                        setUpdateCategory(false);
                        setFormData({
                            name: "",
                            inMenu: false,
                            type: "card",
                            image: null,
                            order: null,
                        })
                    }}
                >
                    Create Category
                </Button>
                <Table hoverable >
                    <Table.Head>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Image</Table.HeadCell>
                        <Table.HeadCell>In Menu</Table.HeadCell>
                        <Table.HeadCell>Type</Table.HeadCell>
                        <Table.HeadCell>Order</Table.HeadCell>
                        <Table.HeadCell>Update</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {categories.map((category) => (
                            <Table.Row key={category._id}>
                                <Table.Cell>{category.name}</Table.Cell>
                                <Table.Cell>
                                    {category.image ?
                                        <img src={category.image} alt={category.name} className="w-10 h-10 object-cover" />
                                        : <p>No image</p>
                                    }
                                </Table.Cell>
                                <Table.Cell>{category.inMenu ? (<FaCheck className='text-green-500' />) : <FaTimes className="text-red-500" />}</Table.Cell>
                                <Table.Cell>{category.type}</Table.Cell>
                                <Table.Cell>{category.order}</Table.Cell>
                                <Table.Cell>
                                    <p
                                        className="text-teal-500 cursor-pointer hover:underline"
                                        onClick={() => {
                                            setCategoryIdToUpdate(category._id)
                                            setFormData({
                                                _id: category._id,
                                                name: category.name,
                                                inMenu: category.inMenu,
                                                type: category.type,
                                                image: category.image,
                                                order: category.order,
                                            })
                                            setUpdateCategory(true)
                                            setCreateCategory(false)
                                        }}
                                    >
                                        Update
                                    </p>
                                </Table.Cell>
                                <Table.Cell>
                                    <p
                                        className="text-red-500 cursor-pointer hover:underline"
                                        onClick={() => {
                                            setCreateCategory(null)
                                            setUpdateCategory(null)
                                            setCategoryIdToDelete(category._id)
                                            setShowModal(true)
                                        }}
                                    >
                                        Delete
                                    </p>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {error && <Alert color="failure">{error}</Alert>}
                {success && <Alert color="success">{successMessage}</Alert>}
            </div>
            {/* Columna 2 */}
            {/* Create Category */}
            {(createCategory || updateCategory) &&
                <div className="flex flex-col gap-4">
                    <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200 self-center'>{updateCategory ? "Update Category" : "Create Category"}</h1>
                    <div className="flex flex-col gap-4 p-4">
                        <form onSubmit={updateCategory ? handleSubmitUpdateCategory : handleSubmitCreateCategory} className="flex flex-col gap-4">
                            <TextInput
                                id="name"
                                type="text"
                                placeholder="Category name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                value={formData.name || ""}
                            />
                            <Select
                                id="type"
                                value={formData.type || ""}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="card">Card</option>
                                <option value="post">Post</option>
                            </Select>
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

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="inMenu"
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={formData.inMenu}
                                    onChange={e => setFormData({ ...formData, inMenu: e.target.checked })}
                                />
                                <label htmlFor="inMenu" className="text-sm">
                                    In Menu?
                                </label>
                            </div>
                            {formData.inMenu && (
                                <TextInput
                                    id="order"
                                    type="number"
                                    placeholder="Order"
                                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                    value={formData.order || ""}
                                />
                            )}
                            <Button
                                className='self-center'
                                type="submit"
                                disabled={loading}
                                gradientDuoTone="purpleToBlue"
                                outline
                            >
                                {updateCategory ? "Update" : "Create"}
                            </Button>
                        </form>
                    </div>
                </div>
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header>Delete category?</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
                            Are you sure you want to delete the category?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteCategory}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, I'm not.</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}
