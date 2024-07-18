import React, { useState } from 'react'
import Navbar from '../Components/Navbar/Navbar';
import FilterBar from '../Components/FilterBar/FilterBar';
import ProductData from '../Components/ProductData/ProductData';

const Products = () => {
    const [filters, setFilters] = useState({
      categoryFilter: [],
      colourFilter: [],
      sizeFilter: [],
      priceFilter: { type: '', range: { min: '', max: '' } },
    });
  
    const applyFilters = (newFilters) => {
      setFilters(newFilters);
    };
  
    return (
      <div className="products-page">
        <Navbar/>
        <FilterBar applyFilters={applyFilters} />
        <ProductData filters={filters} />
      </div>
    );
  };
  
  export default Products;
