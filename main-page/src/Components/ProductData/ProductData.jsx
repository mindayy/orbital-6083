import { database } from "../firebaseConfig/index";
import { ref, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import useFilter from "../hooks/useFilter";
import './ProductData.css';


const ProductData = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setFilters, filteredProducts } = useFilter(products);

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

  useEffect(() => {
    setFilters(filters); 
  }, [filters, setFilters]);

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="product-data-container">
      {filteredProducts.length > 0 ? (
        <div className="products-list">
          {filteredProducts.map((product) => (
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

