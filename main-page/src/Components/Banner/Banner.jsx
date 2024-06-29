import React from 'react'
import'./Banner.css'

import brands from '../Assets/featuring.png'

const Banner = () => {
    return (
        <div className='banner'>
            <div className='brands-banner'>
                <img src={brands} alt="" />
            </div>

        </div>
    )
}

export default Banner