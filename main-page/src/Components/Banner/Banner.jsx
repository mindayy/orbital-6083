import React from 'react'
import { Link } from 'react-router-dom'
import'./Banner.css'

import brands from '../Assets/featuring.png'

const Banner = () => {
    return (
        <div className='banner'>
            <div className='brands-banner'>
                <Link to='/products'>
                    <img src={brands} alt="" />
                </Link>
            </div>

        </div>
    )
}

export default Banner