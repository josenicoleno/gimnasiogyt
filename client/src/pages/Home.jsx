import { Link } from 'react-router-dom';
import CallToAcction from '../components/CallToAction'
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import CategoryList from '../components/CategoryList';
import { profesores } from '/public/profesores';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [excercises, setExcercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [excercisesCategories, setExcercisesCategories] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const sizeWindow = window.innerWidth;
        let limit = sizeWindow < 768 ? 3 : 6;
        const res = await fetch(`/api/post/getPosts?status=Published&limit=${limit}`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchExcercises = async () => {
      try {
        const sizeWindow = window.innerWidth;
        let limit = sizeWindow < 768 ? 3 : 6;
        const res = await fetch(`/api/excercise/getExcercises?limit=${limit}`);
        const data = await res.json();
        setExcercises(data.excercises);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchExcerciseCategories = async () => {
      try {
        const res = await fetch(`/api/excerciseCategory/`);
        const data = await res.json();
        setExcercisesCategories(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchExcerciseCategories();
    fetchCategories();
    fetchPosts();
    fetchExcercises();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex flex-col gap-6 p-10 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl text-blue-500">Gimnasio GyT</h1>
        <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm">Bienvenido a la web del Gimnasio de tu club...</p>
        <div className="flex gap-4">
          <Link to='/search' className='text-sm text-teal-500 hover:underline font-bold'>Ver todos los posts</Link>
          <Link to='/searchexcercise' className='text-sm text-teal-500 hover:underline font-bold'>Ver todos los ejercicios</Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-6  border-gray-200 dark:border-gray-600">
        <CallToAcction />
      </div>

      {/* Sección Los Profes */}
      <div className="py-10 border-t border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-3xl font-semibold">Los profes</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {profesores.map(profe => (
              <div key={profe.id} className="relative group w-80 h-96 overflow-hidden rounded-lg shadow-lg">
                <img src={profe.image} alt={profe.name} className="w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0" />
                <img src={profe.hoverImage} alt={`${profe.name} hover`} className="w-full h-full object-cover transition-opacity duration-500 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="font-bold">{profe.name}</p>
                  <p className="text-xs">{profe.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Ejercicios */}
      {excercises.length &&
        <div className="py-10 border-t border-gray-200 dark:border-gray-600 max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <h2 className="text-2xl font-semibold text-center mb-5">Ejercicios recientes</h2>
            <div className="flex flex-wrap gap-5 justify-center">
              {excercises.map((excercise) => (
                <PostCard key={excercise._id} post={excercise} type="excercise" />
              ))}
            </div>
            <Link to="/searchexcercise" className="block text-lg text-teal-500 hover:underline text-center mt-4">Ver todos los ejercicios</Link>
          </div>

          {/* Sidebar de Categorías de Ejercicios */}
          <CategoryList categories={excercisesCategories} title={"Categorías de Ejercicios"} type={"excercise"} />
        </div>
      }

      {/* Sección de Posts */}
      {posts.length &&
        <div className="py-10 border-t border-gray-200 dark:border-gray-600 max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <h2 className="text-2xl font-semibold text-center mb-5">Posts recientes</h2>
            <div className="flex flex-wrap gap-5 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} type="post" />
              ))}
            </div>
            <Link to="/search" className="block text-lg text-teal-500 hover:underline text-center mt-4">Ver todos los posts</Link>
          </div>

          {/* Sidebar de Categorías de Posts */}
          <CategoryList categories={categories} title={'Categorías de posts'} type={"post"} />
        </div>
      }
    </div>
  );
}
