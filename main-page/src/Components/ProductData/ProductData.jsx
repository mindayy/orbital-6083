import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { WishlistContext } from '../WishlistContext/WishlistContext';
import hollowHeartIcon from '../Assets/likes.png';
import filledHeartIcon from '../Assets/filledheart.png';
import './ProductData.css';

const ProductData = ({ products }) => {
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(WishlistContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleHeartClick = (product) => {
    if (!user) {
      alert('You need to be logged in to add items to your wishlist.');
      navigate('/auth');
      return;
    }
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const capitaliseFirstLetter = (text) => {
    return text
      .split(' ')
      .map(word => {
        if (word.startsWith('(')) {
          return '(' + word.charAt(1).toUpperCase() + word.slice(2).toLowerCase(); 
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  return (
    <div className="product-data-container">
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.shop}</h3>
              <img src={product.imageUrl} alt={product.title} />
              <div className="size-list">
                {product.sizesList && product.sizesList.length > 0 ? (
                  <ul>
                    {product.sizesList.map((size, index) => (
                      <li key={index}>{size}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="sold-out-overlay">
                    <span>NO SIZES AVAILABLE</span>
                  </div>
                )}
              </div>
              <div className="product-info">
                <h4>
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                    {capitaliseFirstLetter(product.title)}
                  </a>
                </h4>
                <p>${product.price.toFixed(2)}</p>
                <button 
                  className="wishlist-button" 
                  onClick={() => handleHeartClick(product)}
                >
                  <img src={isProductInWishlist(product.id) ? filledHeartIcon : hollowHeartIcon} alt="Wishlist" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductData;
