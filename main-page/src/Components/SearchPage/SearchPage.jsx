import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import SearchResults from './SearchResults';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setSearchQuery(result.keywords.join(' '));
    } catch (error) {
      console.error('Error recognizing image:', error);
    }
  };

  return (
    <div>
      <h1>Advanced Search</h1>
      <ImageUpload onImageUpload={handleImageUpload} />
      <SearchResults searchQuery={searchQuery} />
    </div>
  );
};

export default SearchPage;
