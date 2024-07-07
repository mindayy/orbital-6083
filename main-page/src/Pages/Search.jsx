import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import SearchResults from '../Components/SearchResults/SearchResults';

const Search = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query') || '';
  
    return (
      <div>
        <Navbar/>
        <SearchResults searchQuery={searchQuery} />
      </div>
    );
  };
  
  export default Search;