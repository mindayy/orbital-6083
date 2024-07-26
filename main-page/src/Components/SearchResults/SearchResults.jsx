import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig/index';
import { ref, get } from 'firebase/database';
import '../ProductData/ProductData.css'; 

const SearchResults = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const productsRef1 = ref(database, '/SSD-products');
        const productsRef2 = ref(database, '/lovet-products');
        const productsRef3 = ref(database, '/TTR-products')
        const productsRef4 = ref(database, '/TTT-products')

        const snapshot1 = await get(productsRef1);
        const snapshot2 = await get(productsRef2);
        const snapshot3 = await get(productsRef3);
        const snapshot4 = await get(productsRef4);

        let productsArray = [];

        if (snapshot1.exists()) {
          const productsData1 = snapshot1.val();
          const productsArray1 = Object.keys(productsData1).map((key) => ({
            id: key,
            ...productsData1[key],
          }));
          productsArray = [...productsArray, ...productsArray1];
        }

        if (snapshot2.exists()) {
          const productsData2 = snapshot2.val();
          const productsArray2 = Object.keys(productsData2).map((key) => ({
            id: key,
            ...productsData2[key],
          }));
          productsArray = [...productsArray, ...productsArray2];
        }

        if (snapshot3.exists()) {
          const productsData3 = snapshot3.val();
          const productsArray3 = Object.keys(productsData3).map((key) => ({
            id: key,
            ...productsData3[key],
          }));
          productsArray = [...productsArray, ...productsArray3];
        }

        if (snapshot4.exists()) {
          const productsData4 = snapshot4.val();
          const productsArray4 = Object.keys(productsData4).map((key) => ({
            id: key,
            ...productsData4[key],
          }));
          productsArray = [...productsArray, ...productsArray4];
        }

        // Filter products based on keywords
        const keywords = searchQuery.toLowerCase().split(" "); // split keywords
        const filteredProducts = productsArray.filter((product) =>
          keywords.every((keyword) =>
          product.title.toLowerCase().includes(keyword)
          )
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  if (loading) {
    return <p className="loading-message">Loading...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
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
                <h4><a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.title}</a></h4>
                <p>${product.price.toFixed(2)}</p>
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
