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
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('/api/category')
            const data = await res.json()
            setCategories(data)
        }
        fetchCategories()
    }, [])


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
        navigate(`/search?${searchQuery}`)
    }

    return (
        <div>
            <Navbar className='border-b-2'>
                <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                    Profe
                    <span className='px-2 py-1 bg-gradient-to-r from-blue-500 via-light-blue-500 to-cyan-500 rounded-lg text-black'>
                        Mariano Nicoleno
                    </span>
                </Link>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type='text'
                        placeholder='Buscar...'
                        rightIcon={AiOutlineSearch}
                        className='hidden lg:inline'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <Link to='/search'>
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
                    {categories.filter(category => category.inMenu).map(category => (
                        <Navbar.Link key={category._id} active={path === `/search?category=${category.name}`} as={'div'}>
                            <Link to={`/search?category=${category.name}`}>
                                {category.name}
                            </Link>
                        </Navbar.Link>
                    ))}
                    <Navbar.Link active={path === "/about"} as={'div'}>
                        <Link to='/about'>
                            Sobre mí
                        </Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/projects"} as={'div'}>
                        <Link to='/projects'>
                            Proyectos
                        </Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/contact-me"} as={'div'}>
                        <Link to='/contact-me'>
                            Contactar 
                        </Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar >
        </div >
    )
}

export default Header
