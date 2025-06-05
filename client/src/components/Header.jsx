import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

const Header = () => {
    const path = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const [logo, setLogo] = useState({
        key: "Logo",
        text: ""
    });
    const [marca, setMarca] = useState({
        key: "Marca",
        text: ""
    })

    /*  const [categories, setCategories] = useState([]); */

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/param/${logo.key}`)
                const data = await res.json()
                setLogo({ ...logo, text: data.text })

                const resMarca = await fetch(`/api/param/${marca.key}`)
                const dataMarca = await resMarca.json()
                setMarca({ ...marca, text: dataMarca.text })
            } catch (error) {

            }
        }
        fetchData()
    }, []
    )
    /* useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('/api/category')
            const data = await res.json()
            setCategories(data)
        }
        fetchCategories()
    }, []) */


    const handleSignout = async () => {
        try {
            const res = await fetch(`api/user/signout`, {
                method: 'POST'
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString();
        if (!searchQuery)
            return
        navigate(`/searchexercise?${searchQuery}`)
    }

    return (
        <div>
            <Navbar className='border-b-2'>
                <Link to='/' className='flex self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                    <img src={logo.text} className="w-10 h-10" />
                    <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-white content-center'>
                        {marca.text}
                    </span>
                </Link>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type='text'
                        placeholder='Buscar ejercicio...'
                        rightIcon={AiOutlineSearch}
                        className='hidden lg:inline'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <Link to='/searchexercise'>
                        <AiOutlineSearch />
                    </Link>
                </Button>
                <div className="flex gap-2 md:order-2">
                    <Button className='w-12 h-10 sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </Button>
                    {currentUser ? (
                        <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}>
                            <Dropdown.Header>
                                <span className="block text-sm">@{currentUser.username}</span>
                                <span className="block text-sm truncate font-semibold">{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to='/dashboard?tab=profile'>
                                <Dropdown.Item>Perfil</Dropdown.Item>
                            </Link>
                            <Link to='/dashboard?tab=personalRecords'>
                                <Dropdown.Item>Mis marcas</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignout}>Salir</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to='/sign-in'>
                            <Button gradientDuoTone='purpleToBlue' outline>
                                Ingresar
                            </Button>
                        </Link>)
                    }
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link active={path === "/"} as={'div'}>
                        <Link to='/'>
                            Inicio
                        </Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/searchexercise"} as={'div'}>
                        <Link to='/searchexercise'>
                            Ejercicios
                        </Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/search"} as={'div'}>
                        <Link to='/search'>
                            Posts
                        </Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/about"} as={'div'}>
                        <Link to='/about'>
                            Nosotros
                        </Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/contact-me"} as={'div'}>
                        <Link to='/contact-me'>
                            Contactar
                        </Link>
                    </Navbar.Link>
                    {currentUser && (
                        <>
                            <Navbar.Link active={path === "/dashboard?tab=routines"} as={'div'}>
                                <Link to='/dashboard?tab=routines'>
                                    Mis rutinas
                                </Link>
                            </Navbar.Link>
                            <Navbar.Link active={path === `/dashboard?tab=personalRecords`} as={'div'}>
                                <Link to='/dashboard?tab=personalRecords'>
                                    Mis marcas
                                </Link>
                            </Navbar.Link>
                        </>
                    )}
                </Navbar.Collapse>
            </Navbar >
        </div >
    )
}

export default Header
