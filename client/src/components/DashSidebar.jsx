import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiAcademicCap, HiAdjustments, HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
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
                                Users
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
                        <Link to="/dashboard?tab=comments">
                            <Sidebar.Item
                                active={tab === 'comments'}
                                icon={HiAnnotation}
                                labelColor='dark'
                                as='div'
                            >
                                Comments
                            </Sidebar.Item>
                        </Link>
                        <Sidebar.Collapse label='Settings' icon={HiAdjustments}>
                            <Link to="/dashboard?tab=categories">
                                <Sidebar.Item
                                    active={tab === 'categories'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Categories
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=about">
                                <Sidebar.Item
                                    active={tab === 'about'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    About
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=projects">
                                <Sidebar.Item
                                    active={tab === 'projects'}
                                    labelColor='dark'
                                    as='div'
                                >
                                    Projects
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
