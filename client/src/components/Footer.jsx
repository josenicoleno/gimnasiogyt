import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { BsFacebook, BsFillPinMapFill, BsInstagram, BsLinkedin } from 'react-icons/bs'

const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500 mt-auto">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to='/' className='flex self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <img src="/logo.png" className="w-10 h-10" />
                            <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-white'>
                                Gimnasio GyT
                            </span>
                        </Link>
                        <p className="flex flex-row  items-center gap-3 mt-3">
                            <BsFillPinMapFill className="align-bottom" />
                            <Link to={"https://maps.app.goo.gl/VBZjjzjJA6FMCqqZ7"} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Vicente Lopez 670, Salta
                            </Link>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="Sobre nosotros" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="/about">
                                    Nosotros
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Sígueme!" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="https://www.facebook.com/jose.nicoleno/" target="_blank" rel="noopener noreferrer">
                                    Facebook
                                </Footer.Link>
                                <Footer.Link href="https://www.instagram.com/jose.nicoleno/" target="_blank" rel="noopener noreferrer">
                                    Instagram
                                </Footer.Link>
                                <Footer.Link href="https://www.linkedin.com/in/jose-nicoleno/" target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Política de privacidad
                                </Footer.Link>
                                <Footer.Link href="#">
                                    Términos y condiciones
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Gimnasia y Tiro" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-5 sm:justify-center">
                        <Footer.Icon href="https://www.facebook.com/jose.nicoleno/" icon={BsFacebook} />
                        <Footer.Icon href="https://www.instagram.com/jose.nicoleno/" icon={BsInstagram} />
                        <Footer.Icon href="https://www.linkedin.com/in/jose-nicoleno/" icon={BsLinkedin} />
                    </div>
                </div>
            </div>
        </Footer >
    )
}

export default FooterComponent
