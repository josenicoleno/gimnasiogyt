import { Alert, Button, Label, Spinner, TextInput, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CallToAction from "../components/CallToAction";
import { Link } from "react-router-dom";

export default function ContactMe() {
    const { currentUser } = useSelector((state) => state.user)
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
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
            const res = await fetch('/api/contact/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUser?._id || '', name, email, content: message })
            })
            const data = await res.json()
            if (res.status === 201) {
                setMessage('')
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
        <div className='min-h-screen mt-5 gap-5 sm:gap-10'>
            <h1 className='text-4xl font-bold text-center'>Contactar</h1>
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* left */}
                <div className="flex-1">
                    <img src="https://scontent.fnap7-2.fna.fbcdn.net/v/t39.30808-6/460147200_8739177339477174_8527538700013903936_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=b04a48&_nc_ohc=FoDaVfFC5OwQ7kNvgFwLq3C&_nc_zt=23&_nc_ht=scontent.fnap7-2.fna&_nc_gid=AQNQxzBwT_jrznemDgD1jgm&oh=00_AYD7wqzafoLUyP8bES3qTUuVteToW9RnuYqzyopgG51uyg&oe=672D4A93" alt="contact" className='md:w-full md:h-full object-cover md:rounded-md h-64 w-64 shadow-lg rounded-full mx-auto' />
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
                                <p className='text-sm text-gray-500 mb-5'>Si tienes alguna pregunta o comentario, no dudes en contactarme.</p>
                                <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                                    <Label htmlFor="name">Nombre</Label>
                                    <TextInput type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <Label htmlFor="email">Email</Label>
                                    <TextInput type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <Label htmlFor="message">Mensaje</Label>
                                    <textarea className='rounded-md p-2 bg-[rgb(55 65 81 / var(--tw-bg-opacity))] dark:bg-gray-800' rows={6} id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    <Button type="submit" gradientDuoTone='purpleToPink' className='mt-3' outline>
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
            {/* call to action */}
            <div className="mt-5 p-3 bg-amber-100 dark:bg-slate-700">
                <CallToAction />
            </div>
        </div >
    )
}
