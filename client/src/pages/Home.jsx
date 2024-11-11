import { Link } from 'react-router-dom';
import CallToAcction from '../components/CallToAction'
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [excercises, setExcercises] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const sizeWindow = window.innerWidth;
        let limit = 9;
        if (sizeWindow < 768) {
          limit = 3
        }
        const res = await fetch(`/api/post/getPosts?limit=${limit}`)
        const data = await res.json()
        setPosts(data.posts)
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchExcercises = async () => {
      try {
        const sizeWindow = window.innerWidth;
        let limit = 9;
        if (sizeWindow < 768) {
          limit = 3
        }
        const res = await fetch(`/api/excercise/getExcercises?limit=${limit}`)
        const data = await res.json()
        setExcercises(data.excercises)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchPosts();
    fetchExcercises();
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl text-blue-400">Gimnasio GyT</h1>
        <p className="text-gray-500 text-xs sm:text-sm">Bienvenido a la web del Gimnasio de tu club. Acá encontrarás información, ejercicios y posteos del gimnasio. También podés ver quiénes somos y contactarte con nosotros.</p>
        <Link to='/search?type=post' className='text-xs sm:text-sm text-teal-500 hover:underline font-bold'>Ver todos los posts</Link>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 hover:underline font-bold'>Ver todos los ejercicios</Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAcction />
      </div>
      <div className="flex flex-col gap-6">
            <h2 className='text-2xl font-semibold text-center'>
              Ejercicios recientes
            </h2>
            <div className="flex flex-wrap gap-10 justify-center">
              {excercises.map(excercise =>
                <PostCard key={excercise._id} post={excercise} type={'excercise'}/>
              )}
            </div>
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>Ver todos los ejercicios</Link>
          </div>
      <div className="flex flex-col max-w-6xl mx-auto p-3 gap-8 py-7">
        {posts &&
          <div className="flex flex-col gap-6">
            <h2 className='text-2xl font-semibold text-center'>
              Posts recientes
            </h2>
            <div className="flex flex-wrap gap-10 justify-center">
              {posts.map(post =>
                <PostCard key={post._id} post={post} type={'post'}/>
              )}
            </div>
            <Link to={'/search?type=post'} className='text-lg text-teal-500 hover:underline text-center'>Ver todos los posts</Link>
          </div>
        }
      </div>
    </div>
  )
}

