import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ applyFilters }) => {
  const [blogshopFilter, setBlogshopFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [colourFilter, setColourFilter] = useState([]);
  const [sizeFilter, setSizeFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ type: '', range: { min: '', max: '' } });
  const [isDropdown, setIsDropdown] = useState(false);

  const handleBlogshopChange = (blogshop) => {
    setBlogshopFilter((prev) => {
      if (prev.includes(blogshop)) {
        return prev.filter((item) => item !== blogshop);
      } else {
        return [...prev, blogshop];
      }
    });
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSizeChange = (size) => {
    setSizeFilter((prev) => {
      if (prev.includes(size)) {
        return prev.filter((item) => item !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleColourChange = (colour) => {
    setColourFilter((prev) => {
      if (prev.includes(colour)) {
        return prev.filter((item) => item !== colour);
      } else {
        return [...prev, colour];
      }
    });
  }; 

  const handlePriceChange = (type) => {
    setPriceFilter((prev) => ({
      ...prev,
      type: type === prev.type ? '' : type,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceFilter((prev) => ({
      ...prev,
      range: {
        ...prev.range,
        [name]: value,
      },
    }));
  };

  const handleApplyFilters = () => {
    applyFilters({ blogshopFilter, categoryFilter, sizeFilter, colourFilter, priceFilter });
    setIsDropdown(false); // close dropdown after applying
  };

  const toggleDropdown = () => {
    setIsDropdown((prev) => !prev);
  };

  const clearFilters = () => {
    setBlogshopFilter([]);
    setCategoryFilter([]);
    setSizeFilter([]);
    setColourFilter([]);
    setPriceFilter({ type: '', range: { min: '', max: '' } });
    applyFilters({ categoryFilter: [], sizeFilter: [], colourFilter: [], priceFilter: { type: '', range: { min: '', max: '' } } });
  };

  return (
    <div className="filter-bar">
      <div className="dropdown-button" onClick={toggleDropdown}>
        <span>Filter </span> 
        <span>{isDropdown ? '▲' : '▼'}</span>
      </div>

      {isDropdown && (
        <div className="filter-options">
          <div className='filter-section-row'>
            {/* Blogshops Filter */}
            <div className="filter-section">
              <h3>Blogshop</h3>
              <div className='underline'></div>
              <div className='filter-options'>
                {['Lovet', 'SSD', 'TTR', 'TTT', 'SuperGurl'].map((blogshop) => (
                  <label key={blogshop}>
                    <input
                      type="checkbox"
                      value={blogshop}
                      checked={blogshopFilter.includes(blogshop)}
                      onChange={() => handleBlogshopChange(blogshop)}
                    />
                    {blogshop}
                  </label>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="filter-section">
              <h3>Category</h3>
              <div className='underline'></div>
              <div className='filter-options'>
                {['Tops', 'Dresses', 'Outerwear', 'Pants', 'Shorts', 'Skirts', 'Onepiece', 'Others'].map((category) => (
                  <label key={category}>
                    <input
                      type="checkbox"
                      value={category}
                      checked={categoryFilter.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="filter-section">
              <h3>Size</h3>
              <div className='underline'></div>
              <div className='filter-options'>
                {['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      value={size}
                      checked={sizeFilter.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Colour Filter */}
            <div className="filter-section">
              <h3>Colour</h3>
              <div className='underline'></div>
              <div className='filter-options-colour'>
                {['Beige', 'Black', 'Brown', 'Grey', 'White', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Patterned'].map((colour) => (
                  <label key={colour}>
                    <input
                      type="checkbox"
                      value={colour}
                      checked={colourFilter.includes(colour)}
                      onChange={() => handleColourChange(colour)}
                    />
                    {colour}
                    <span className="color-box" style={{ backgroundColor: colour.toLowerCase() }}></span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h3>Price</h3>
              <div className='underline'></div>
              <div className='filter-options'>
                <label>
                  <input
                    type="radio"
                    name="price"
                    value="low-to-high"
                    checked={priceFilter.type === 'low-to-high'}
                    onChange={() => handlePriceChange('low-to-high')}
                  />
                  Low to High
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    value="high-to-low"
                    checked={priceFilter.type === 'high-to-low'}
                    onChange={() => handlePriceChange('high-to-low')}
                  />
                  High to Low
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    value="range"
                    onChange={() => handlePriceChange('range')}
                    checked={priceFilter.type === 'range'}
                  />
                  Range
                </label>
                {priceFilter.type === 'range' && (
                  <div>
                    <input
                      type="number"
                      name="min"
                      placeholder="Min."
                      value={priceFilter.range.min}
                      onChange={handlePriceRangeChange}
                    />
                    <input
                      type="number"
                      name="max"
                      placeholder="Max."
                      value={priceFilter.range.max}
                      onChange={handlePriceRangeChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="apply-button-container">
            <button onClick={clearFilters}>Clear</button>
            <button onClick={handleApplyFilters}>Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;