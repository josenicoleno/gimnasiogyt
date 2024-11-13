import React from 'react'
import { Link } from 'react-router-dom'
const colors = ["bg-green-600", "bg-red-600", "bg-blue-600", "bg-pink-600", "bg-purple-600"]
export default function CategoryList({ categories, title, type }) {
    const url = type === 'post' ? 'search?category=' : 'searchexcercise?category='
    return (
        <div className="w-full lg:w-1/4 p-4">
            <h3 className="text-xl font-bold mb-4 text-center text-teal-600">{title}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {categories.map((category, index) => (
                    <Link to={url + category.name} key={index}>
                        <div className={`${colors[index]} flex items-center p-3 rounded-lg shadow-sm transition-transform transform hover:scale-105 cursor-pointer`}>
                            <img src={category.image} className="w-8 h-8 flex items-center justify-center mr-3" />
                            <span className="text-gray-800 dark:text-gray-200 font-semibold">{category.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
