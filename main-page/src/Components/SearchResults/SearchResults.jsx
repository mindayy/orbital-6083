import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig/index';
import { ref, get } from 'firebase/database';
import { useWishlist } from '../WishlistContext/WishlistContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import hollowHeartIcon from '../Assets/likes.png';
import filledHeartIcon from '../Assets/filledheart.png';
import '../ProductData/ProductData.css';

const SearchResults = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const productsRef = [
          '/SSD-products',
          '/lovet-products',
          '/TTR-products',
          '/TTT-products',
          '/supergurl-products'
        ].map(path => ref(database, path));

        const snapshots = await Promise.all(productsRef.map(ref => get(ref)));

        let productsArray = snapshots.flatMap(snapshot => {
          if (snapshot.exists()) {
            const productsData = snapshot.val();
            return Object.keys(productsData).map(key => ({
              id: key,
              ...productsData[key],
            }));
          }
          return [];
        });

        // Filter products based on keywords
        const keywords = searchQuery.toLowerCase().split(' '); // Split keywords
        const filteredProducts = productsArray.filter(product =>
          keywords.every(keyword => product.title.toLowerCase().includes(keyword))
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchProducts();
    }
  }, [searchQuery]);

  const handleHeartClick = (product) => {
    if (!user) {
      alert('You need to be logged in to add items to your wishlist.');
      navigate('/auth'); // Redirect to login/signup page
      return;
    }
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return <p className="loading-message">Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="product-data-container">
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.shop}</h3>
              <div className="size-list">
                {product.sizesList && product.sizesList.length > 0 && (
                  <ul>
                    {product.sizesList.map((size, index) => (
                      <li key={index}>{size}</li>
                    ))}
                  </ul>
                )}
              </div>
              <img src={product.imageUrl} alt={product.title} />
              <div className="product-info">
                <h4>
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                    {product.title}
                  </a>
                </h4>
                <p>${product.price.toFixed(2)}</p>
                <button className="wishlist-button" onClick={() => handleHeartClick(product)}>
                  <img
                    src={isProductInWishlist(product.id) ? filledHeartIcon : hollowHeartIcon}
                    alt="Wishlist"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products-message">No products found</p>
      )}
    </div>
  );
};

export default SearchResults;
