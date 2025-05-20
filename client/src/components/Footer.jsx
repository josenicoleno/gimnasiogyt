import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { BsFacebook, BsFillPinMapFill, BsGithub, BsInstagram, BsLinkedin, BsYoutube } from 'react-icons/bs'
import { useEffect, useState } from "react";
import { socialNetworks } from "../../public/data";

const FooterComponent = () => {
    const [logo, setLogo] = useState({
        key: "Logo",
        text: ""
    });
    const [marca, setMarca] = useState({
        key: "Marca",
        text: ""
    })
    const [direccion, setDireccion] = useState({
        key: "Direccion",
        text: ""
    })

    const [linkDireccion, setLinkDireccion] = useState({
        key: "LinkDireccion",
        text: ""
    })
    const [redesSociales, setRedesSociales] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/param/${logo.key}`)
                const data = await res.json()
                setLogo({ ...logo, text: data.text })

                const resMarca = await fetch(`/api/param/${marca.key}`)
                const dataMarca = await resMarca.json()
                setMarca({ ...marca, text: dataMarca.text })

                const resDireccion = await fetch(`/api/param/${direccion.key}`)
                const dataDireccion = await resDireccion.json()
                setDireccion({ ...direccion, text: dataDireccion.text })

                const resLinkDireccion = await fetch(`/api/param/${linkDireccion.key}`)
                const dataLinkDireccion = await resLinkDireccion.json()
                setLinkDireccion({ ...linkDireccion, text: dataLinkDireccion.text })

                const redesData = await Promise.all(socialNetworks.map(async sn => {
                    const res = await fetch(`/api/param/${sn}`)
                    const data = await res.json()
                    return data
                }))
                setRedesSociales(redesData.filter(r => r.boolean))
            } catch (error) {

            }
        }
        fetchData()
    }, [])
    return (
        <Footer container className="border border-t-8 border-teal-500 mt-auto">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to='/' className='flex self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <img src={logo.text} className="w-10 h-10" />
                            <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-white'>
                                {marca.text}
                            </span>
                        </Link>
                        <p className="flex flex-row  items-center gap-3 mt-3">
                            <BsFillPinMapFill className="align-bottom" />
                            <Link to={linkDireccion.text} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {direccion.text}
                            </Link>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-4 sm:gap-6">
                        <div>
                            <Footer.Title title="Sobre nosotros" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="/about">
                                    Nosotros
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Síguenos!" />
                            <Footer.LinkGroup col>
                                {redesSociales.filter(sn => sn.boolean).map(sn => (
                                    <Footer.Link key={sn.key} href={sn.text} target="_blank" rel="noopener noreferrer">
                                        {sn.key}
                                    </Footer.Link>
                                ))}
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Escribinos!" />
                            <Footer.LinkGroup col>
                                <Footer.Link href='contact-me' rel="noopener noreferrer">
                                    Contacto
                                </Footer.Link>
                                <Footer.Link href='registration' rel="noopener noreferrer">
                                    Inscribirse
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
                    <Footer.Copyright href="https://www.facebook.com/gytoficial/" by="Gimnasia y Tiro" year={new Date().getFullYear()} />
                    <Footer.Copyright href="https://www.josenicoleno.ar" by="José Nicoleno" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-5 sm:justify-center">
                        {redesSociales.filter(sn => sn.boolean).map(sn => (
                            < Footer.Icon
                                key={sn.key}
                                href={sn.text}
                                target="_blank"
                                icon={
                                    sn.key === "Facebook" ? BsFacebook :
                                        sn.key === "Instagram" ? BsInstagram :
                                            sn.key === "Linkedin" ? BsLinkedin :
                                                sn.key === "Github" ? BsGithub :
                                                    BsYoutube
                                }
                            />))
                        }
                    </div>
                </div>
            </div>
        </Footer >
    )
}

export default FooterComponent
