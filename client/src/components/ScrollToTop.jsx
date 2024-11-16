import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
    const pathName = useLocation();
    const [scrollY, setScrollY] = useState(window.scrollY)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathName])

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    // Show button when user scrolls down
    window.addEventListener('scroll', () => {
        setScrollY(window.scrollY)
    })

    return scrollY > 200 && (
        <button
            id="btn-back-to-top"
            type="button"
            onClick={scrollToTop}
            data-twe-ripple-init
            data-twe-ripple-color="light"
            className="!fixed bottom-5 end-24 z-50 rounded-full bg-gray-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
        >
            <span className="[&>svg]:w-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </span>
        </button>
    )
}
