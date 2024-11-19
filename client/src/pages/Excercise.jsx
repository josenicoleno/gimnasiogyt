import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react'
import CallToAction from "../components/CallToAction"
import CommentSection from "../components/CommentSection"
import ExcerciseCard from "../components/ExcerciseCard"

export default function Excercise() {
    const { excerciseSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [excercise, setExcercise] = useState(null)
    const [recentExcercise, setRecentExcercise] = useState(null)
    const [typeExcercise, setTypeExcercise] = useState(null)

    useEffect(() => {
        const fetchExcercise = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/excercise/getexcercises?slug=${excerciseSlug}`)
                const data = await res.json();
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setExcercise(data.excercises[0])
                const resCategory = await fetch(`/api/excerciseCategory/?category=${data.excercises[0].category}`)
                const dataCategory = await resCategory.json();
                setTypeExcercise(dataCategory[0]?.type || 'excercise')
                setLoading(false)
                setError(false)
            } catch (error) {
                console.log(error.message)
                setError(true)
                setLoading(false)
            }
        }
        const recentExcercise = async () => {
            try {
                const res = await fetch(`/api/excercise/getexcercises?limit=3`)
                if (res.ok) {
                    const data = await res.json();
                    setRecentExcercise(data.excercises.filter(excercise => excercise.slug !== excerciseSlug))
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        recentExcercise();
        fetchExcercise();
    }, [excerciseSlug])

    if (loading)
        return <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>

    return (
        <>
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                    {excercise?.title}
                </h1>
                <Link
                    to={`/searchexcercise?category=${excercise?.category}`}
                    className="self-center mt-5"
                >
                    <Button color="gray" pill size="xs">{excercise?.category}</Button>
                </Link>
                {typeExcercise === 'excercise' ?
                    <>
                        <img
                            src={excercise?.image}
                            alt={excercise?.title}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                            <span>{excercise && new Date(excercise.createdAt).toLocaleDateString()}</span>
                            <span className="italic">{excercise && (excercise.content.length / 1000 + 1).toFixed(0)} mins read</span>
                        </div>
                        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: excercise?.content }}>
                        </div>
                    </>
                    :
                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Columna de imagen */}
                        <div className="flex justify-center items-start">
                            <img
                                src={excercise?.image}
                                alt={excercise?.title}
                                className="max-h-[600px] w-full object-cover rounded-lg"
                            />
                        </div>
                        {/* Columna de contenido */}
                        <div className="flex flex-col space-y-4">
                            <div className="post-content" dangerouslySetInnerHTML={{ __html: excercise?.content }}>
                            </div>
                        </div>
                    </div>
                }
            </main>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection excerciseId={excercise?._id} />
            <div className="flex flex-col justify-center items-center max-w-8xl p-3">
                <h1 className="text-xl mt-5">Exercises similares</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentExcercise &&
                        recentExcercise.map(excercise => <ExcerciseCard key={excercise._id} excercise={excercise} />)
                    }
                </div>
            </div>
        </>
    )
}
