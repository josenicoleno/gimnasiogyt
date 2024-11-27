import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react'
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
    const [typeExercise, setTypeExercise] = useState(null)

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
                setTypeExercise(dataCategory[0]?.type || 'exercise')
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
                <Link
                    to={`/searchexercise?category=${exercise?.category}`}
                    className="self-center mt-5"
                >
                    <Button color="gray" pill size="xs">{exercise?.category}</Button>
                </Link>
                {currentUser &&
                    <Link
                        to={`/create-personal-record?exerciseId=${exercise?._id}`}
                        className="self-start"
                    >
                        <Button gradientDuoTone="cyanToBlue" outline >{exercise?.category}</Button>
                    </Link>
                }
                {typeExercise === 'exercise' ?
                    <>
                        <img
                            src={exercise?.image}
                            alt={exercise?.title}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                            <span>{exercise && new Date(exercise.createdAt).toLocaleDateString()}</span>
                            <span className="italic">{exercise && (exercise.content.length / 1000 + 1).toFixed(0)} mins read</span>
                        </div>
                        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: exercise?.content }}>
                        </div>
                    </>
                    :
                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Columna de imagen */}
                        <div className="flex justify-center items-start">
                            <img
                                src={exercise?.image}
                                alt={exercise?.title}
                                className="max-h-[600px] w-full object-cover rounded-lg"
                            />
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
