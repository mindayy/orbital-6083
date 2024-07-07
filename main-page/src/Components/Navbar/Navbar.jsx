import React from 'react'
import'./Navbar.css'
import { Link, useNavigate } from 'react-router-dom';

import logo from '../Assets/logo.png'
import search from '../Assets/search.png'
import profile from '../Assets/profile.png'
import likes from '../Assets/likes.png'


const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
            </div>
            <div className='nav-search'>
                <input placeholder='Type to search products...' />
                <img src={search} alt='' />
            </div>
            <div className='nav-profile' >
            <Link to="/profile">
                <img src={profile} alt='' />
            </Link>
                <button onClick={() => navigate('/auth')}>Sign Up | Login</button>
                <img src={likes} alt='' />
            </div>
            <div className='nav-likes-count'>0</div>
        </div>
    )
}

export default Navbar