import { useState, useMemo, useCallback } from 'react';

const useFilter = (products) => {
  const [filters, setFilters] = useState({
    categoryFilter: [],
    colourFilter: [],
    sizeFilter: [],
    priceFilter: { type: '', range: { min: '', max: '' } },
  });

  // sort items into categories based on keywords
  const getCategory = (title) => {
    const keywords = {
      Tops: ['top', 'shirt', 'tee', 'cardi', 'blouse', 'tube', 'crew neck', 'offsie', 'bralet', 'tank', 'toga', 'cami'],
      Dresses: ['dress', 'romper'],
      Outerwear: ['jacket', 'cardi', 'cardigan', 'pullover', 'hoodie', 'vest', 'blazer'],
      Pants: ['jeans', 'culottes', 'joggers', 'pants', 'trousers'],
      Shorts: ['shorts', 'berms'],
      Skirts: ['skirt', 'skorts', 'maxi'],
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

  // sort items into colours based on keywords
  const getColour = (title) => {
    const keywords = {
      Beige: ['beige', 'natural', 'sand', 'cream', 'mauve', 'almond', 'latte',
       'oat', 'taupe', 'biscott', 'crème', 'oatmeal', 'sandalwood', 'bone', 'vanilla',
        'khaki', 'ecru', 'sepia', 'cornsilk', 'champagne', 'dune', 'tapioca', 'porcelain',
        'ivory', 'chalk', 'birch', 'wheat', 'nude', 'chai', 'cashmere', 'fawn', 'pearl', 'biscuit', 'malt'],
      Black: ['black'],
      Brown: ['brown', 'rust', 'tann', 'oak', 'mocha', 'cocoa', 'espresso', 'coffee', 
        'toffee', 'tortila', 'tortilla', 'caramel', 'auburn', 'walnut', 'mahogany', 'camel', 'tan',
        'chocolate'],
      Grey: ['grey', 'gray', 'gunmetal', 'greige', 'clay', 'charcoal', 'rosewood', 'etoupe', 'stone', 'graphite'],
      White: ['white'],
      Red: ['red', 'burgundy', 'wine', 'merlot', 'maroon', 'vermilion', 'cherry', 'mulberry'],
      Orange: ['orange', 'terracotta', 'apricot', 'salmon', 'brick', 'cantaloupe', 'coral', 'tangerine',
        'carrot'],
      Yellow: ['yellow', 'buttercup', 'sunrise', 'buttermilk', 'sunshine', 'honey', 'dandelion',
         'eggshell', 'daffodil', 'lemon', 'flaxseed'],
      Blue: ['blue', 'navy', 'tiffany', 'denim', 'wash', 'periwinkle', 'sky', 'arctic', 'marine', 'teal',
        'midnight', 'cobalt', 'eclipse'],
      Green: ['green', 'army', 'emerald', 'forest', 'olive', 'sage', 'seafoam', 'avocado', 'lime', 'mint',
        'pine', 'cactus', 'nature', 'pistachio', 'botanic', 'moss', 'foliage'],
      Purple: ['purple', 'lavendar', 'lavender', 'taro', 'lilac', 'eggplant', 'puce', 'thistle',
        'wisteria', 'grape'],
      Pink: ['pink', 'peach', 'rose', 'sakura', 'parfait', 'blush', 'cranberry', 'raspberry']
    };

    for (const [colour, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => title.toLowerCase().includes(keyword))) {
        return colour;
      }
    }
    return 'Patterned';
  };

  // filter by categories, sizes and price
  const applyFilters = useCallback(() => {
    return products.filter(product => {
      const productCategory = getCategory(product.title);
      const productColour = getColour(product.title);
      const matchCategory = !filters.categoryFilter.length || filters.categoryFilter.includes(productCategory);
      const matchColour = !filters.colourFilter.length || filters.colourFilter.includes(productColour);
      const matchSize = !filters.sizeFilter.length || (product.sizesList && filters.sizeFilter.some(size => product.sizesList.includes(size)));
      const matchPrice = !filters.priceFilter.type
        || (filters.priceFilter.type === 'low-to-high' && product.price)
        || (filters.priceFilter.type === 'high-to-low' && product.price)
        || (filters.priceFilter.type === 'range' && product.price >= filters.priceFilter.range.min && product.price <= filters.priceFilter.range.max);

      return matchCategory && matchSize && matchColour && matchPrice;
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

