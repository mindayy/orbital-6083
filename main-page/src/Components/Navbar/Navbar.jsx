import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../WishlistContext/WishlistContext';
import { useUser } from '../UserContext/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import './Navbar.css';

import logo from '../Assets/logo.png';
import search from '../Assets/search.png';
import profile from '../Assets/profile.png';
import likes from '../Assets/likes.png';
import advancedSearch from '../Assets/advanced-search.png'; // Add your advanced search icon here

const Navbar = () => {
    const { user } = useUser();
    const { wishlist } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate('/');
        });
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
            <div className='nav-advanced-search'>
                <Link to="/advanced-search">
                    <button>
                        <img src={advancedSearch} alt='Advanced Search' />
                    </button>
                </Link>
            </div>
            <div className='nav-profile'>
                {user ? (
                    <>
                        <span>{user.username || user.email}</span>
                        <button onClick={handleLogout} className="navbar-logout-button">Log Out</button>
                        <Link to="/profile">
                            <img src={profile} alt='Profile' />
                        </Link>
                        <Link to="/profile">
                            <img src={likes} alt='Likes' />
                        </Link>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/auth')} className="navbar-auth-button">Sign Up | Login</button>
                        <Link to="/profile">
                            <img src={profile} alt='Profile' />
                        </Link>
                    </>
                )}
            </div>
            {user && (
                <div className='nav-likes-count'>{getWishlistCount()}</div>
            )}
        </div>
    );
};

export default Navbar;
