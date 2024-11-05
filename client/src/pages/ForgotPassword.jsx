import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'

const ForgotPassword = () => {

  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email) {
      return setErrorMessage('Por favor, complete todos los campos.')
    }
    try {
      setLoading(true)
      const res = await fetch('api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            Profe
            <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-black'>Mariano Nicoleno</span>
          </Link>
          <p className='text-sm mt-5'>This is my blogpage. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod tenetur eum soluta. Nam animi blanditiis.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput id='email' type='email' placeholder='name@company.com' onChange={handleChange} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : "Restablecer contraseña"}
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

export default ForgotPassword
