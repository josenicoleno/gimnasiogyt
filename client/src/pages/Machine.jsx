import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react'
import CallToAction from "../components/CallToAction"
import 'react-quill-new/dist/quill.snow.css';
import { HiViewList, HiViewGrid } from "react-icons/hi"
import MachineCard from "../components/MachineCard"


export default function Machine() {
    const { machineSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [machine, setMachine] = useState(null)
    const [error, setError] = useState(null)
    const [otherMachine, setOtherMachine] = useState(null)
    const [relatedExercises, setRelatedExercises] = useState([])
    const [typeView, setTypeView] = useState('card')

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/machine/?slug=${machineSlug}`)
                const data = await res.json();
                if (!res.ok) {
                    setError(true)
                    return
                }
                setMachine(data.machines[0])
                setError(false)
            } catch (error) {
                console.log(error.message)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        const fetchOtherMachines = async () => {
            try {
                const res = await fetch(`/api/machine/?limit=4`)
                if (res.ok) {
                    const data = await res.json();
                    setOtherMachine(data.machines
                        .filter(machine => machine.slug !== machineSlug)
                        .slice(0, 3)
                    )
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchRelatedExercises = async () => {
            try {
                const res = await fetch(`/api/exercise/getexercises?machine=${machine?.title}`)
                if (res.ok) {
                    const data = await res.json();
                    setRelatedExercises(data.exercises)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchMachine();
        fetchOtherMachines();
        if (machine?.title) {
            fetchRelatedExercises();
        }
    }, [machineSlug, machine?.title])

    if (loading)
        return <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>


    return (
        <>
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                    {machine?.title}
                </h1>
                <div className="hidden md:flex justify-end items-center gap-4">
                    <Button
                        color={typeView === 'post' ? 'blue' : 'gray'}
                        onClick={() => setTypeView('post')}
                        size="sm"
                    >
                        <HiViewList className="h-5 w-5" />
                    </Button>
                    <Button
                        color={typeView === 'card' ? 'blue' : 'gray'}
                        onClick={() => setTypeView('card')}
                        size="sm"
                    >
                        <HiViewGrid className="h-5 w-5" />
                    </Button>
                </div>
                {typeView === 'post' ?
                    <>
                        <img
                            src={machine?.image}
                            alt={machine?.title}
                            className="mt-10 max-h-[600px] w-full object-cover"
                        />
                        <h1 className="text-2xl underline p-3 mx-auto font-serif max-w-2xl lg:text-2xl">
                            Descripción
                        </h1>
                        <div className="p-3 max-w-2xl mx-auto w-full machine-content" dangerouslySetInnerHTML={{ __html: machine?.content }} />
                        {relatedExercises.length > 0 && (
                            <>
                                <h1 className="text-2xl underline p-3 mx-auto font-serif max-w-2xl lg:text-2xl">
                                    Ejercicios para hacer
                                </h1>
                                <div className="flex flex-col gap-4 mt-5 max-w-2xl mx-auto">
                                    {relatedExercises.map(exercise => (
                                        <Link
                                            key={exercise._id}
                                            to={`/exercise/${exercise.slug}`}
                                            className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                                        >
                                            <img
                                                src={exercise.image}
                                                alt={exercise.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <span className="text-lg font-medium hover:text-blue-500 transition-colors">
                                                {exercise.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                    : //Card
                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Columna de imagen */}
                        <div className="flex flex-col justify-center items-start">
                            <img
                                src={machine?.image}
                                alt={machine?.title}
                                className="max-h-[600px] w-full object-cover rounded-lg"
                            />
                        </div>
                        {/* Columna de contenido */}
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-2xl underline justify-start p-1 font-serif max-w-2xl lg:text-2xl">
                                Descripción
                            </h1>
                            <div className="machine-content prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: machine?.content }} />
                            {relatedExercises.length > 0 && (
                                <>
                                    <h1 className="text-2xl underline justify-start p-1 font-serif max-w-2xl lg:text-2xl">
                                        Ejercicios para hacer
                                    </h1>
                                    <div className="flex flex-col gap-4 mt-5">
                                        {relatedExercises.map(exercise => (
                                            <Link
                                                key={exercise._id}
                                                to={`/exercise/${exercise.slug}`}
                                                className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                                            >
                                                <img
                                                    src={exercise.image}
                                                    alt={exercise.title}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <span className="text-lg font-medium hover:text-blue-500 transition-colors">
                                                    {exercise.title}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                }
            </main>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <div className="flex flex-col justify-center items-center max-w-8xl p-3">
                <h1 className="text-xl mt-5">Otras máquinas</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {otherMachine &&
                        otherMachine.map(machine => <MachineCard key={machine._id} machine={machine} />)
                    }
                </div>
            </div>
        </>
    )
}
