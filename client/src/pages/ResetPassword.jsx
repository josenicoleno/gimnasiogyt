import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useSelector } from 'react-redux'

const ResetPassword = () => {
  const { token } = useParams();
  const { currentUser } = useSelector(state => state.user)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
    if (!token) {
      navigate('/sign-in')
    }
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/auth/reset-password/${token}`)
        const data = await res.json()
        if (!res.ok) {
          setError(true)
          return setErrorMessage(data.message)
        }
        setFormData({ email: data.email })
      } catch (error) {
        setError(true)
        setErrorMessage(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [currentUser, navigate, token])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      return setErrorMessage('Please fill out all fields.')
    }
    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage('Passwords do not match.')
    }
    if (formData.password.length < 8 || formData.password.length > 20) {
      return setErrorMessage('Password must be between 8 and 20 characters long.')
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message)
      }
      if (res.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      return setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to='/' className='flex font-bold dark:text-white text-4xl'>
            <img src="/logo.png" className="w-10 h-10" />
            <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-white'>Gimnasio GyT</span>
          </Link>
          <p className='text-sm mt-5'>Bienvenido al Gimnasio de tu club</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput id='email' type='email' value={formData.email} placeholder='name@company.com' onChange={handleChange} disabled />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput id='password' type='password' placeholder='*********' onChange={handleChange} disabled={error} />
            </div>
            <div>
              <Label value='Confirm password' />
              <TextInput id='confirmPassword' type='password' placeholder='*********' onChange={handleChange} disabled={error} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading || error}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : "Cambiar contraseña"}
            </Button>
          </form>
          <div className="">
            <span>No tiene una cuenta? </span>
            <Link to='/sign-up' className='text-blue-500'>Registrarse</Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure' >
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
