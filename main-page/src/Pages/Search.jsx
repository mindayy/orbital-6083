import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import FilterBar from '../Components/FilterBar/FilterBar';
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
        <FilterBar/>
        <SearchResults searchQuery={searchQuery} filters={filters} />
      </div>
    );
  };
  
  export default Search;