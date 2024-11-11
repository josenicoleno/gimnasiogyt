import { useEffect, useState } from 'react'
import { Button, Select, TextInput, Spinner } from 'flowbite-react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

export default function SearchExcercise() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    })
    const [loading, setLoading] = useState(false)
    const location = useLocation();
    const [posts, setPosts] = useState([])
    const [showMore, setShowMore] = useState(false)
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm') || ''
        const sortFromUrl = urlParams.get('sort') || 'desc'
        const categoryFromUrl = urlParams.get('category') || ''

        setSidebarData({
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        })

        const fetchExcercise = async () => {
            try {
                setLoading(true)
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/excercise/getexcercises?${searchQuery}`)
                if (!res.ok) {
                    throw new Error('Error fetching excercises')
                }
                const data = await res.json();
                setPosts(data.excercises)
                setShowMore(data.excercises.length === 9)
            } catch (error) {
                console.error('Error fetching excercises:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchExcercise()
    }, [location.search])

    useEffect(() => {
        const fetchExcerciseCategories = async () => {
            const res = await fetch('/api/excerciseCategory')
            const data = await res.json()
            setCategories(data)
        }
        fetchExcerciseCategories()
    }, [])

    const handleChange = e => {
        if (e.target.id === 'searchTerm')
            setSidebarData({ ...sidebarData, searchTerm: e.target.value })
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order })
        }
        if (e.target.id === 'category') {
            const category = e.target.value || '';
            setSidebarData({ ...sidebarData, category: category })
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        if (sidebarData.searchTerm === '')
            urlParams.delete('searchTerm')
        else
            urlParams.set('searchTerm', sidebarData.searchTerm)

        if (sidebarData.category === '')
            urlParams.delete('category')
        else
            urlParams.set('category', sidebarData.category)

        urlParams.set('sort', sidebarData.sort)

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = async () => {
        const startIndex = posts.length;
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)
        try {
            const res = await fetch(`/api/excerciseCategory?${urlParams}`)
            const data = await res.json()
            setPosts([...posts, ...data.posts])
            setShowMore(data.posts.length === 9)
        } catch (error) {
            console.error('Error fetching more posts:', error)
        }
    }

    return (
        <div className='flex flex-col md:flex-row'>
            {/* Sidebar */}
            <div className='p-7 border-b md:border-r md:min-h-screen border-b-gray-500'>
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-8'
                >
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput
                            id='searchTerm'
                            type='text'
                            placeholder='Search...'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Sort:</label>
                        <Select
                            id='sort'
                            onChange={handleChange}
                            value={sidebarData.sort}
                        >
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Category:</label>
                        <Select
                            id='category'
                            onChange={handleChange}
                            value={sidebarData.category}
                        >
                            <option value=''>Select</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <Button
                        type='submit'
                        gradientDuoTone='purpleToPink'
                        outline
                        disabled={loading}
                    >
                        Search
                    </Button>
                </form>
            </div>
            {/* Main */}
            <div className='w-full p-7'>
                <h1 className='text-3xl font-semibold sm:border-b sm:border-gray-500 pb-4'>
                    Excercise results
                </h1>
                {loading &&
                    <div className='flex justify-center items-center min-h-screen'>
                        <Spinner size='xl' />
                    </div>
                }
                {!loading && posts.length === 0 &&
                    <p className='text-xl text-gray-500'>No excercise found.</p>
                }
                <div className='flex flex-wrap gap-4 m-4'>
                    {!loading && posts.map(post => (
                        <PostCard key={post._id} post={post} type={'excercise'} />
                    ))}
                </div>
                {showMore &&
                    <p onClick={handleShowMore} className='text-center text-sm text-teal-500 cursor-pointer hover:underline'>Show more</p>
                }
            </div>
        </div>
    )
}
