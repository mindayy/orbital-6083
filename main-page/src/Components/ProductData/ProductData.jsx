import { database } from "../firebaseConfig/index";
import { ref, get } from 'firebase/database';
import React, { useEffect, useState, useCallback } from 'react';
import './ProductData.css';

const ProductData = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ssdSnapshot = await get(ref(database, '/SSD-products'));
        const lovetSnapshot = await get(ref(database, '/lovet-products'));

        const ssdProducts = ssdSnapshot.exists() ? Object.values(ssdSnapshot.val()) : [];
        const lovetProducts = lovetSnapshot.exists() ? Object.values(lovetSnapshot.val()) : [];

        setProducts([...ssdProducts, ...lovetProducts]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const applyFilters = useCallback((products) => {
    return products.filter(product => {
      const matchCategory = filters.categoryFilter.length === 0 || filters.categoryFilter.includes(product.category);
      const matchSize = filters.sizeFilter.length === 0 || filters.sizeFilter.some(size => product.sizesList.includes(size));
      const matchPrice = filters.priceFilter.type === ''
        || (filters.priceFilter.type === 'low-to-high' && products.sort((a, b) => a.price - b.price))
        || (filters.priceFilter.type === 'high-to-low' && products.sort((a, b) => b.price - a.price))
        || (filters.priceFilter.type === 'range' && product.price >= filters.priceFilter.range.min && product.price <= filters.priceFilter.range.max);
      return matchCategory && matchSize && matchPrice;
    });
  }, [filters]);

  const filteredProducts = applyFilters(products);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-data-container">
      {filteredProducts.length > 0 ? (
        <div className="products-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.shop}</h3>
              <div className="size-list">
                {product.sizesList && product.sizesList.length > 0 ? (
                  <ul>
                    {product.sizesList.map((size, index) => (
                      <li key={index}>{size}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="sold-out-overlay">
                    <span>Sold Out</span>
                  </div>
                )}
              </div>
              <img src={product.imageUrl} alt={product.title} />
              <div className="product-info">
                <h4><a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.title}</a></h4>
                <p>${product.price}0</p>
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

