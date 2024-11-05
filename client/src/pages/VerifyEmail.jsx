import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Spinner } from 'flowbite-react'

export default function VerifyEmail() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/auth/verify-email/${token}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          return;
        }
        setSuccess(data.message);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        window.setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
    };
    verifyEmail();
  }, []);

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className="max-w-lg mx-auto p-8 text-center">
          <div className="mb-8">
            <svg className={`w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 ${success ? '!text-green-500' : '!text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Verificando email...
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Espere mientras verificamos su email...
          </p>
        </div>

        {
          loading ? (
            <Spinner />
          ) : error ? (
            <div >
              <h1 className='text-2xl font-bold text-red-500'>{error}</h1>
            </div>
          ) : success ? (
            <div >
              <h1 className='text-2xl font-bold text-green-500'>{success}</h1>
            </div>
          ) : (
            <div >
              <h1 className='text-2xl font-bold text-red-500'>Algo salió mal</h1>
            </div>
          )
        }
      </div>
    </div>
  );
}
