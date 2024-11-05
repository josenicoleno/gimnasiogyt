import { Button } from "flowbite-react";

export default function CallToAction() {
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            <div className="flex flex-col flex-1 justify-center">
                <h2 className="text-2xl">
                    Lorem, ipsum dolor sit amet consectetur adipisicing.
                </h2>
                <p className="text-gray-500 my-2">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere, enim?
                </p>
                <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
                    <a href="https://www.linkedin.com/josenicoleno" target="_blank" rel="noopener norefer">Learn more</a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src="https://stride.com.co/wp-content/uploads/2023/01/gabriel-heinzer-g5jpH62pwes-unsplash-1024x768.jpg" alt="callToAction" className="max-h-[300px]" />
            </div>
        </div>
    )
}
