import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ applyFilters }) => {
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [sizeFilter, setSizeFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ type: '', range: { min: '', max: '' } });

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
    applyFilters({ categoryFilter, sizeFilter, priceFilter });
  };

  return (
    <div className="filter-bar">
      {/* Categories Filter */}
      <div className="filter-section-categories">
        <h3>Categories</h3>
        <div className='category-options'>
          {['Tops', 'Dresses', 'Outerwear', 'Pants', 'Shorts', 'Skirts', 'Others'].map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="filter-section-size">
        <h3>Size</h3>
        <div className='size-options'>
          {['XXXS','XXS','XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                value={size}
                onChange={() => handleSizeChange(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-section-price">
        <h3>Price</h3>
        <div className='price-options'>
          <label>
            <input
              type="radio"
              name="price"
              value="low-to-high"
              onChange={() => handlePriceChange('low-to-high')}
              checked={priceFilter.type === 'low-to-high'}
            />
            Low to High
          </label>
          <label>
            <input
              type="radio"
              name="price"
              value="high-to-low"
              onChange={() => handlePriceChange('high-to-low')}
              checked={priceFilter.type === 'high-to-low'}
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
      
      <div className="apply-button-container">
        <button onClick={handleApplyFilters}>Apply</button>
      </div>
    </div>
  );
};

export default FilterBar;



