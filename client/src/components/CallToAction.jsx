import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/registration')
    }

    return (
        <div className="flex flex-col alig sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            <div className="flex flex-col flex-1 justify-center">
                <h2 className="text-2xl">
                    Inscribite al gimnasio de tu club!
                </h2>
                <p className="text-gray-400 my-2">
                    Completá el formulario y empezá. Podés también mandarnos un whatsapp o llámarnos
                </p>
                <Button gradientDuoTone="cyanToBlue" onClick={handleClick} className="rounded-tl-xl rounded-bl-none">
                    Inscribirse
                </Button>
            </div>
            <div className="p-7">
                <img src="https://firebasestorage.googleapis.com/v0/b/mern-blog-410211.appspot.com/o/gym%20imagenes%2FcallToAction.png?alt=media&token=6fe83cad-5d92-4863-a51b-0462a4baafdc" alt="callToAction" className="max-h-[300px]" />
            </div>
        </div>
    )
}
