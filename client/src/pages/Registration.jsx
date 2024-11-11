import { Alert, Button, Label, Spinner, TextInput, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CallToAction from "../components/CallToAction";
import { Link } from "react-router-dom";

export default function Registration() {
    const { currentUser } = useSelector((state) => state.user)
    const [content, setContent] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.username)
            setEmail(currentUser.email)
        }
    }, [currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setErrorMessage('')
            setSuccessMessage('')
            setLoading(true)
            const res = await fetch('/api/contact/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUser?._id || '', name, email, phone, content })
            })
            const data = await res.json()
            if (res.status === 201) {
                setContent('')
                setSuccess(true)
                setSuccessMessage(data.message)
            } else {
                setError(true)
                setErrorMessage(data.message)
            }
        } catch (error) {
            setError(true)
            setErrorMessage('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen mt-5 sm:gap-10'>
            <h1 className='text-4xl font-bold text-center'>Inscripción</h1>
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* left */}
                <div className="flex-1 mr-10">
                    <img
                        src=""
                        alt="contact"
                        className='md:w-full md:h-full object-cover md:rounded-md h-64 w-64 shadow-lg rounded-full mx-auto'
                    />
                    <h1>Planes</h1>
                    <p className="text-justify text-gray-400">Dejanos tu número de teléfono y nos pondremos en contacto con vos para que te pasemos toda la info.</p>
                </div>
                {/* right */}
                <div className="flex-1">
                    {loading ? <Spinner /> :
                        success ? (
                            <>
                                <div className="mb-8">
                                    <svg className={`w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 ${success ? '!text-green-500' : '!text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                                    Mensaje enviado correctamente
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    Gracias por contactarme!
                                </p>
                                <Link to="/">
                                    <Button gradientDuoTone='purpleToPink' className='mt-3' outline>
                                        Ir a inicio
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className='text-sm text-gray-500 mb-5'></p>
                                <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                                    <Label htmlFor="name">Nombre</Label>
                                    <TextInput type="text" required id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <Label htmlFor="email" required>Email</Label>
                                    <TextInput type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <Label htmlFor="email" required>Télefono</Label>
                                    <TextInput type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <Label htmlFor="content">Mensaje</Label>
                                    <textarea className='rounded-md p-2 bg-[rgb(55 65 81 / var(--tw-bg-opacity))] dark:bg-gray-800' rows={6} id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} />
                                    <Button type="submit" gradientDuoTone='purpleToPink' className='mt-3' outline disabled={loading}>
                                        Enviar mensaje
                                    </Button>
                                </form>
                            </>
                        )}
                </div>
            </div>
            {/* success and error messages */}
            <div className="flex justify-center items-center">
                {success && <Alert color="success">{successMessage}</Alert>}
                {error && <Alert color="failure">{errorMessage}</Alert>}
            </div>
        </div >
    )
}
