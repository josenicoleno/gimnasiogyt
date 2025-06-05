import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiAdjustments, HiAnnotation, HiArrowSmRight, HiChartPie, HiChatAlt2, HiCube, HiDocumentSearch, HiDocumentText, HiFire, HiGift, HiHand, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])

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
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={HiUser}
                            label={currentUser.isAdmin ? 'Admin' : 'User'}
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=personalRecords">
                        <Sidebar.Item
                            active={tab === 'personalRecords'}
                            icon={HiFire}
                            labelColor='dark'
                            as='div'
                        >
                            Mis marcas
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=routines">
                        <Sidebar.Item
                            active={tab === 'routines'}
                            icon={HiDocumentSearch}
                            labelColor='dark'
                            as='div'
                        >
                            Rutinas
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && <>
                        <Link to="/dashboard?tab=dashboard">
                            <Sidebar.Item
                                active={tab === 'dashboard' || !tab}
                                icon={HiChartPie}
                                labelColor='dark'
                                as='div'
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=users">
                            <Sidebar.Item
                                active={tab === 'users' || tab === 'userupdate'}
                                icon={HiOutlineUserGroup}
                                labelColor='dark'
                                as='div'
                            >
                                Usuarios
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item
                                active={tab === 'posts'}
                                icon={HiDocumentText}
                                labelColor='dark'
                                as='div'
                            >
                                Posts
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=exercises">
                            <Sidebar.Item
                                active={tab === 'exercises'}
                                icon={HiHand}
                                labelColor='dark'
                                as='div'
                            >
                                Ejercicios
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=machines">
                            <Sidebar.Item
                                active={tab === 'machines'}
                                icon={HiCube}
                                labelColor='dark'
                                as='div'
                            >
                                Máquinas
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=comments">
                            <Sidebar.Item
                                active={tab === 'comments'}
                                icon={HiAnnotation}
                                labelColor='dark'
                                as='div'
                            >
                                Comentarios
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dashboard?tab=contacts">
                            <Sidebar.Item
                                active={tab === 'contacts'}
                                icon={HiChatAlt2}
                                labelColor='dark'
                                as='div'
                            >
                                Contactos
                            </Sidebar.Item>
                        </Link>
                        <Sidebar.Collapse label='Ajustes' icon={HiAdjustments}>
                            <Link to="/dashboard?tab=categories">
                                <Sidebar.Item
                                    active={tab === 'categories'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Post categorías
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=exerciseCategories">
                                <Sidebar.Item
                                    active={tab === 'exerciseCategories'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Ejercicios categorías
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=about">
                                <Sidebar.Item
                                    active={tab === 'about'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Acerca de nosotros
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=whatsapp">
                                <Sidebar.Item
                                    active={tab === 'whatsapp'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    WhatsApp
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=settingLogo">
                                <Sidebar.Item
                                    active={tab === 'settingLogo'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Logo y marca
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=socialNetworks">
                                <Sidebar.Item
                                    active={tab === 'socialNetworks'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Redes sociales
                                </Sidebar.Item>
                            </Link>
                        </Sidebar.Collapse>
                    </>
                    }
                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        className='cursor-pointer'
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar >
    )
}
