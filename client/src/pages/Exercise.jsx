import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Spinner, Tooltip } from 'flowbite-react'
import { HiViewGrid, HiViewList } from 'react-icons/hi'
import CallToAction from "../components/CallToAction"
import CommentSection from "../components/CommentSection"
import ExerciseCard from "../components/ExerciseCard"
import { useSelector } from "react-redux"

export default function Exercise() {
    const { exerciseSlug } = useParams()
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [exercise, setExercise] = useState(null)
    const [recentExercise, setRecentExercise] = useState(null)
    const [typeExercise, setTypeExercise] = useState('post')

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/exercise/getexercises?slug=${exerciseSlug}`)
                const data = await res.json();
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setExercise(data.exercises[0])
                const resCategory = await fetch(`/api/exerciseCategory/?category=${data.exercises[0].category}`)
                const dataCategory = await resCategory.json();
                setTypeExercise(dataCategory[0]?.type || 'post')
                setLoading(false)
                setError(false)
            } catch (error) {
                console.log(error.message)
                setError(true)
                setLoading(false)
            }
        }
        const recentExercise = async () => {
            try {
                const res = await fetch(`/api/exercise/getexercises?limit=3`)
                if (res.ok) {
                    const data = await res.json();
                    setRecentExercise(data.exercises.filter(exercise => exercise.slug !== exerciseSlug))
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        recentExercise();
        fetchExercise();
    }, [exerciseSlug])

    if (loading)
        return <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>

    return (
        <>
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                    {exercise?.title}
                </h1>
                <div className="flex justify-center items-center gap-4 mt-5">
                    <Link
                        to={`/searchexercise?category=${exercise?.category}`}
                    >
                        <Button color="gray" pill size="xs">{exercise?.category}</Button>
                    </Link>

                </div>
                <div className="flex justify-between items-center gap-2">
                    <div className="flex-1">
                        {currentUser &&
                            <Link
                                to={`/create-personal-record?exerciseId=${exercise?._id}`}
                                className="self-start"
                            >
                                <Button gradientDuoTone="cyanToBlue" outline>Nueva marca</Button>
                            </Link>
                        }
                    </div>
                    <div className="flex justify-center items-center gap-4">
                        <Button
                            color={typeExercise === 'post' ? 'blue' : 'gray'}
                            onClick={() => setTypeExercise('post')}
                            size="sm"
                        >
                            <HiViewList className="h-5 w-5" />
                        </Button>
                        <Button
                            color={typeExercise === 'card' ? 'blue' : 'gray'}
                            onClick={() => setTypeExercise('card')}
                            size="sm"
                        >
                            <HiViewGrid className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                {typeExercise === 'post' ?
                    <>
                        <img
                            src={exercise?.image}
                            alt={exercise?.title}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                            <div className="flex items-center gap-2">
                                {exercise?.machines?.map((machine) => (
                                    <Tooltip
                                        key={machine._id}
                                        content={machine.title}
                                        placement="top"
                                    >
                                        <Link to={`/machine/${machine.slug}`}>
                                            <img
                                                src={machine.image}
                                                alt={machine.title}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-all"
                                            />
                                        </Link>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: exercise?.content }}>
                        </div>
                    </>
                    :
                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Columna de imagen */}
                        <div className="flex justify-center items-start">
                            <div className="relative">
                                <img
                                    src={exercise?.image}
                                    alt={exercise?.title}
                                    className="max-h-[600px] w-full object-cover rounded-lg"
                                />
                                <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                                    <div className="flex items-center gap-2">
                                        {exercise?.machines?.map((machine) => (
                                            <Tooltip
                                                key={machine._id}
                                                content={machine.title}
                                                placement="top"
                                            >
                                                <Link to={`/machine/${machine.slug}`}>
                                                    <img
                                                        src={machine.image}
                                                        alt={machine.title}
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-all"
                                                    />
                                                </Link>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Columna de contenido */}
                        <div className="flex flex-col space-y-4">
                            <div className="post-content" dangerouslySetInnerHTML={{ __html: exercise?.content }}>
                            </div>
                        </div>
                    </div>
                }
            </main>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection postId={exercise?._id} />
            <div className="flex flex-col justify-center items-center max-w-8xl p-3">
                <h1 className="text-xl mt-5">Exercises similares</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentExercise &&
                        recentExercise.map(exercise => <ExerciseCard key={exercise._id} exercise={exercise} />)
                    }
                </div>
            </div>
        </>
    )
}
