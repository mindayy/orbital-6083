import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import FilterBar from '../Components/FilterBar/FilterBar';
import ProductData from '../Components/ProductData/ProductData';
import Pagination from '../Components/Pagination/Pagination';
import useFilter from '../Components/hooks/useFilter';
import { database } from "../Components/firebaseConfig/index";
import { ref, get } from 'firebase/database';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categoryFilter: [],
    colourFilter: [],
    sizeFilter: [],
    priceFilter: { type: '', range: { min: '', max: '' } },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // number of products per page
  const { filteredProducts, setFilters: setFilterState } = useFilter(products);

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
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilterState(filters);
    setCurrentPage(1); // reset to the first page whenever filters are applied
  }, [filters, setFilterState]);

  // get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfFirstProduct + productsPerPage);

  // handle page change & scroll to the top
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-page">
      <Navbar />
      <FilterBar applyFilters={setFilters} />
      <ProductData products={currentProducts} />
      <Pagination 
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Products;

