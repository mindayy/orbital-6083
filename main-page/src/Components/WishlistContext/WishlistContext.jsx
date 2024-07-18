import React, { createContext, useState, useCallback } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = useCallback((product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter(product => product.id !== productId));
  }, []);

  const isProductInWishlist = useCallback((productId) => {
    return wishlist.some(product => product.id === productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isProductInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
