import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import OAuth from '../components/OAuth'

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const isValid = (formData) => {
    if (formData.username.length < 6 || formData.username.length > 20 || !formData.username) {
      setErrorMessage('Username must be between 6 and 20 characters long.')
      return false
    }
    if (!formData.email.includes('@') || !formData.email) {
      setErrorMessage('Please enter a valid email address.')
      return false
    }
    if (formData.password.length < 8 || formData.password.length > 20 || !formData.password) {
      setErrorMessage('Password must be between 8 and 20 characters long.')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isValid(formData)) return
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('api/auth/signup', {
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
      setErrorMessage(error.message)
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
              <Label value='Tu nombre de usuario' />
              <TextInput id='username' required type='text' placeholder='Username' onChange={handleChange} />
            </div>
            <div>
              <Label value='Tu email' />
              <TextInput id='email' required type='email' placeholder='name@company.com' onChange={handleChange} />
            </div>
            <div>
              <Label value='Tu contraseña' />
              <TextInput id='password' required type='password' placeholder='contraseña' onChange={handleChange} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : "Registrarse"}
            </Button>
            <OAuth />
          </form>
          <div className="">
            <span>¿Tiene una cuenta?</span>
            <Link to='/sign-in' className='text-blue-500'> Iniciar sesión</Link>
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

export default SignUp
