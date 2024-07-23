import React from 'react';
import './Pagination.css'; 

const Pagination = ({ currentPage, productsPerPage, totalProducts, onPageChange }) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const maxPageLinks = 5;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
    let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

    //adjust start page if near the end of the list
    if (endPage - startPage + 1 < maxPageLinks) {
      startPage = Math.max(1, endPage - maxPageLinks + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => handleClick(number)}
          className={number === currentPage ? 'active' : ''}
        >
          {number}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
            className='next-button'
            onClick={() => handleClick(currentPage + 1)}>Next</button>
      )}
    </div>
  );
};

export default Pagination;


