import { Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ExerciseCard({ exercise }) {
    return (
        <div className="group relative w-full border border-teal-500 hover:border-2 h-[380px] overflow-hidden rounded-lg sm:w-[320px] transition-all">
            <Link to={`/exercise/${exercise.slug}`}>
                <img src={exercise.image} alt={exercise.title} className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20" />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-2">{exercise.title} </p>
                <span className="italic text-sm">{exercise.category} </span>
                {exercise.machines && (
                    <div className="flex flex-row justify-start gap-2">
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
                )}
                <Link to={`/exercise/${exercise.slug}`} className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2">
                    Ver más
                </Link>
            </div>
        </div >
    )
}
