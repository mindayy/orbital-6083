import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../WishlistContext/WishlistContext';
import { useUser } from '../UserContext/UserContext'; // Correct import path
import './Navbar.css';

import logo from '../Assets/logo.png';
import search from '../Assets/search.png';
import profile from '../Assets/profile.png';
import likes from '../Assets/likes.png';

const Navbar = () => {
    const { user } = useUser(); // Destructure user from useUser
    const { wishlist } = useWishlist();
    const [searchQuery, setSearchQuery] = useState(''); // Define useState
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getWishlistCount = () => {
        return wishlist.length;
    };

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>
            <div className='nav-search'>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <input 
                        type='text' 
                        placeholder='Type to search products...' 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                    />
                    <button type="submit">
                        <img src={search} alt='Search' />
                    </button>
                </form>
            </div>
            <div className='nav-profile'>
                <Link to="/profile">
                    <img src={profile} alt='Profile' />
                </Link>
                {user ? (
                    <span>{user.username}</span>
                ) : (
                    <button onClick={() => navigate('/auth')}>Sign Up | Login</button>
                )}
                <Link to="/profile">
                    <img src={likes} alt='Likes' />
                </Link>
            </div>
            <div className='nav-likes-count'>{getWishlistCount()}</div>
        </div>
    );
};

export default Navbar;
