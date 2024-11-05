import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs'

const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500 mt-auto">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            Profe   
                            <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-black'>
                                Mariano Nicoleno
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="Sobre mí" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="/about">
                                    Sobre mí
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
                    <Footer.Copyright href="#" by="Mariano Nicoleno" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-5 sm:justify-center">
                        <Footer.Icon href="https://www.facebook.com/jose.nicoleno/" icon={BsFacebook} />
                        <Footer.Icon href="https://www.instagram.com/jose.nicoleno/" icon={BsInstagram} />
                        <Footer.Icon href="https://www.linkedin.com/in/jose-nicoleno/" icon={BsLinkedin} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComponent
