import React, { useState } from 'react';
import axios from 'axios';
import './AdvancedSearchForm.css';
import { useNavigate } from 'react-router-dom';

const AdvancedSearchForm = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('url', url);

    try {
      const response = await axios.post('/api/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const keywords = response.data.keywords;
      navigate(`/products?query=${encodeURIComponent(keywords)}`);
    } catch (error) {
      console.error('Error during advanced search:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="advanced-search-form">
      <div>
        <label htmlFor="image">Upload Image:</label>
        <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <label htmlFor="url">Or Enter URL:</label>
        <input type="url" id="url" value={url} onChange={handleUrlChange} />
      </div>
      <button type="submit">Search</button>
    </form>
  );
};

export default AdvancedSearchForm;
