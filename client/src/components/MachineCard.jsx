import { Link } from "react-router-dom";

export default function MachineCard({ machine }) {
    return (
        <div className="relative w-full border border-teal-500 h-[380px] overflow-hidden rounded-lg sm:w-[320px]">
            <Link to={`/machine/${machine.slug}`}>
                <img src={machine.image} alt={machine.title} className="h-[260px] w-full object-cover" />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-2">{machine.title} </p>
                <div className="flex flex-row justify-between gap-2">
                    <span className="italic text-sm">{machine.category} </span>
                </div>
                <Link to={`/machine/${machine.slug}`} className="border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white text-center py-2 rounded-md !rounded-tl-none m-2">
                    Ver más
                </Link>
            </div>
        </div>
    )
}
