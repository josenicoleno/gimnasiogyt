import React from 'react'
import { Link } from 'react-router-dom'
const colors = ["bg-blue-300", "bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700"]

export default function CategoryList({ categories, title, type }) {
    const url = type === 'post' ? 'search?category=' : 'searchexercise?category='
    return (
        <div className="w-full lg:w-1/4 p-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(145, 215, 248)' }}>{title}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {categories.map((category, index) => (
                    <Link to={url + category.name} key={index}>
                        <div className={`${colors[index]} flex items-center p-3 rounded-lg shadow-sm transition-transform transform hover:scale-105 cursor-pointer h-20 w-full`}>
                            <img src={category.image} className="w-8 h-8 rounded-full flex items-center justify-center mr-3" />
                            <span className="text-gray-100 dark:text-gray-100 font-semibold truncate">{category.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
