import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import SearchResults from '../Components/SearchResults/SearchResults';

const Search = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query') || '';

    const [filters, setFilters] = useState({
      categoryFilter: [],
      sizeFilter: [],
      priceFilter: { type: '', range: { min: '', max: '' } },
    });
  
    const applyFilters = (newFilters) => {
      setFilters(newFilters);
    };
  
    return (
      <div>
        <Navbar/>
        <SearchResults searchQuery={searchQuery} filters={filters} />
      </div>
    );
  };
  
  export default Search;