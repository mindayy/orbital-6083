import { database } from "../firebaseConfig/index";
import {ref, get, onValue} from 'firebase/database';
import React, { useEffect, useState } from 'react';
import './ProductData.css';

const ProductDataSSD = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(database, '/SSS-products');

    get(productsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const productsData = snapshot.val();
        const productsArray = Object.keys(productsData).map((key) => ({ //convert object to array
          id: key, 
          ...productsData[key],
        }));
        setProducts(productsArray);
      } else {
        console.log("No products available");
      }
      setLoading(false); 
    }).catch((error) => {
      console.error("Error fetching products:", error);
      setLoading(false); 
    });
  }, []);

  if (products === null) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="product-data-container">
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>SSD</h3>
              <img src={product.imageUrl} alt={product.title} />
              <div className="product-info">
                <h4>{product.title}</h4>
                <p>{product.price}</p>
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

export default ProductDataSSD;