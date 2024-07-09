import { database } from "../firebaseConfig/index";
import { ref, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import './ProductData.css';

const ProductDataLovet = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = ref(database, '/lovet-products');
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const productsData = snapshot.val();
          const productsArray = Object.keys(productsData).map((key) => ({
            id: key,
            ...productsData[key],
          }));
          setProducts(productsArray);
        } else {
          console.log("No products available");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-data-container">
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.shop}</h3>
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

export default ProductDataLovet;