import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react'
import CallToAction from "../components/CallToAction"
import CommentSection from "../components/CommentSection"
import ExcersiseCard from "../components/ExcersiseCard"

export default function Excersise() {
    const { excersiseSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [excersise, setExcersise] = useState(null)
    const [recentExcersise, setRecentExcersise] = useState(null)
    const [typeExcersise, setTypeExcersise] = useState(null)

    useEffect(() => {
        const fetchExcersise = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/excersise/getexcersises?slug=${excersiseSlug}`)
                const data = await res.json();
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                if (res.ok) {
                    setExcersise(data.excersises[0])
                    const resCategory = await fetch(`/api/category/?category=${data.excersises[0].category}`)
                    const dataCategory = await resCategory.json();
                    setTypeExcersise(dataCategory[0]?.type || 'excersise')
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {
                console.log(error.message)
                setError(true)
                setLoading(false)
            }
        }
        fetchExcersise();
    }, [excersiseSlug])

    useEffect(() => {
        const recentExcersise = async () => {
            try {
                const res = await fetch(`/api/excersise/getexcersises?limit=3`)
                if (res.ok) {
                    const data = await res.json();
                    setRecentExcersise(data.excersises.filter(excersise => excersise.slug !== excersiseSlug))
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        recentExcersise();
    }, [])

    if (loading)
        return <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>

    return (
        <>
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                    {excersise?.title}
                </h1>
                <Link
                    to={`/search?category=${excersise?.category}`}
                    className="self-center mt-5"
                >
                    <Button color="gray" pill size="xs">{excersise?.category}</Button>
                </Link>
                {typeExcersise === 'excersise' ?
                    <>
                        <img
                            src={excersise?.image}
                            alt={excersise?.title}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                            <span>{excersise && new Date(excersise.createdAt).toLocaleDateString()}</span>
                            <span className="italic">{excersise && (excersise.content.length / 1000 + 1).toFixed(0)} mins read</span>
                        </div>
                        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: excersise?.content }}>
                        </div>
                    </>
                    :
                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Columna de imagen */}
                        <div className="flex justify-center items-start">
                            <img
                                src={excersise?.image}
                                alt={excersise?.title}
                                className="max-h-[600px] w-full object-cover rounded-lg"
                            />
                        </div>
                        {/* Columna de contenido */}
                        <div className="flex flex-col space-y-4">
                            <div className="post-content" dangerouslySetInnerHTML={{ __html: excersise?.content }}>
                            </div>
                        </div>
                    </div>
                }
            </main>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection excersiseId={excersise?._id} />
            <div className="flex flex-col justify-center items-center max-w-8xl p-3">
                <h1 className="text-xl mt-5">Exercises similares</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentExcersise &&
                        recentExcersise.map(excersise => <ExcersiseCard key={excersise._id} excersise={excersise} />)
                    }
                </div>
            </div>
        </>
    )
}
