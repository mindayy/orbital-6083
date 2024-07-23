import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Retrieve wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.some(item => item.id === product.id)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter(product => product.id !== productId));
  }, []);

  const isProductInWishlist = useCallback((productId) => {
    return wishlist.some(product => product.id === productId);
  }, [wishlist]);

  const getWishlistCount = useCallback(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isProductInWishlist, getWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
