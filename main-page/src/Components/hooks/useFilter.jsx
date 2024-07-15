import { useState, useMemo, useCallback } from 'react';

const useFilter = (products) => {
  const [filters, setFilters] = useState({
    categoryFilter: [],
    sizeFilter: [],
    priceFilter: { type: '', range: { min: '', max: '' } },
  });

  // sort items into categories based on keywords
  const getCategory = (title) => {
    const keywords = {
      Tops: ['top', 'shirt', 'tee', 'cardi', 'blouse', 'tube', 'crew neck', 'offsie', 'bralet', 'tank', 'toga', 'cami'],
      Dresses: ['dress', 'romper', 'maxi', 'midaxi', 'midi'],
      Outerwear: ['jacket', 'cardi', 'cardigan', 'pullover', 'hoodie', 'vest', 'blazer'],
      Pants: ['jeans', 'culottes', 'joggers', 'pants', 'trousers', 'berms'],
      Shorts: ['shorts'],
      Skirts: ['skirt', 'skorts'],
      Onepiece: ['playsuit', 'pinafore', 'romper', 'jumpsuit', 'dungaree'],
      Others: ['bag', 'tote']
    };

    for (const [category, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => title.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    return 'Others'; // default category if no matches
  };

  // filter by categories, sizes and price
  const applyFilters = useCallback(() => {
    return products.filter(product => {
      const productCategory = getCategory(product.title);
      const matchCategory = !filters.categoryFilter.length || filters.categoryFilter.includes(productCategory);
      const matchSize = !filters.sizeFilter.length || (product.sizesList && filters.sizeFilter.some(size => product.sizesList.includes(size)));
      const matchPrice = !filters.priceFilter.type
        || (filters.priceFilter.type === 'low-to-high' && product.price)
        || (filters.priceFilter.type === 'high-to-low' && product.price)
        || (filters.priceFilter.type === 'range' && product.price >= filters.priceFilter.range.min && product.price <= filters.priceFilter.range.max);

      return matchCategory && matchSize && matchPrice;
    }).sort((a, b) => {
      if (filters.priceFilter.type === 'low-to-high') {
        return a.price - b.price;
      } else if (filters.priceFilter.type === 'high-to-low') {
        return b.price - a.price;
      }
      return 0;
    });
  }, [products, filters]);

  const filteredProducts = useMemo(() => applyFilters(products), [applyFilters, products]);

  return {
    filters,
    setFilters,
    filteredProducts,
  };
};

export default useFilter;

