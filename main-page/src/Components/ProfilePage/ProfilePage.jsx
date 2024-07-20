import React, { useContext, useState, useEffect } from 'react';
import { getAuth, updateProfile, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { WishlistContext } from '../WishlistContext/WishlistContext';
import defaultProfilePic from '../Assets/defaultpfp.png';
import pencilIcon from '../Assets/pencil-icon.svg'; 
import hollowHeartIcon from '../Assets/likes.png';
import filledHeartIcon from '../Assets/filledheart.png';
import './ProfilePage.css';

const ProfilePage = () => {
  const auth = getAuth();
  const storage = getStorage();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(WishlistContext);

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || `User${Math.floor(Math.random() * 10000)}`);
        setPhotoURL(currentUser.photoURL || defaultProfilePic);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handlePhotoChange = (e) => {
    if (user) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profiles/${user.uid}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setPhotoURL(downloadURL);
          updateProfile(user, { photoURL: downloadURL })
            .then(() => {
              setMessage('Profile photo updated successfully.');
            })
            .catch((error) => {
              console.error(error);
              setError('Error updating profile photo.');
            });
        });
      });
    }
  };

  const handleRemovePhoto = () => {
    if (user) {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      deleteObject(storageRef)
        .then(() => {
          setPhotoURL(defaultProfilePic);
          updateProfile(user, { photoURL: null })
            .then(() => {
              setMessage('Profile photo removed successfully.');
            })
            .catch((error) => {
              console.error(error);
              setError('Error removing profile photo.');
            });
        })
        .catch((error) => {
          console.error(error);
          setError('Error removing profile photo from storage.');
        });
    }
  };

  const handleSaveChanges = () => {
    if (user) {
      const newDisplayName = displayName || `User${Math.floor(Math.random() * 10000)}`; // Random default username
      updateProfile(user, { displayName: newDisplayName })
        .then(() => {
          setMessage('Profile updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          setError('Error updating profile.');
        });
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to home after logging out
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        setError('Error logging out.');
      });
  };

  const handleBackToHome = () => {
    navigate('/products'); // Redirect to products page
  };

  const handleLogin = () => {
    navigate('/auth'); // Redirect to login page
  };

  const handleHeartClick = (product) => {
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (!user) {
    return (
      <div className="not-logged-in-container">
        <p>Please Log In to Continue...</p>
        <button onClick={handleLogin} className="login-button">Log In</button>
        <button onClick={handleBackToHome} className="home-button">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="profile-header">
        <div className="profile-photo">
          <img src={photoURL} alt="User Profile" />
          <label className="photo-upload">
            <img src={pencilIcon} alt="Change Photo" />
            <input type="file" onChange={handlePhotoChange} />
          </label>
          <button onClick={handleRemovePhoto}>Remove Photo</button>
        </div>
        <div className="profile-info">
          <label>
            Username:
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
        </div>
      </div>
      <div className="profile-actions">
        <button onClick={handleSaveChanges}>Save Changes</button>
        <button onClick={handleLogout} className="logout-button">Log Out</button>
        <button onClick={handleBackToHome} className="home-button">Back to Home</button>
      </div>
      <div className="wishlist-container">
        <h2>Your Wishlist</h2>
        <ul>
          {wishlist.map((product) => (
            <li key={product.id}>
              <img src={product.imageUrl} alt={product.title} />
              <h3>
                <a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.title}</a>
              </h3>
              <button 
                className="wishlist-button" 
                onClick={() => handleHeartClick(product)}
              >
                <img src={isProductInWishlist(product.id) ? filledHeartIcon : hollowHeartIcon} alt="Wishlist" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
