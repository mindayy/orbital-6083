import React from 'react'
import'./Navbar.css'

import logo from '../Assets/logo.png'
import search from '../Assets/search.png'
import profile from '../Assets/profile.png'
import likes from '../Assets/likes.png'


const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
            </div>
            <div className='nav-search-profile-likes'>
                <img src={search} alt='' />
                <img src={profile} alt='' />
                <Link to="/auth">
                    <button>Sign Up | Login</button>
                </Link>
                <img src={likes} alt='' />
                <div className='nav-likes-count'>0</div>
            </div>
        </div>
    )
}

export default Navbar