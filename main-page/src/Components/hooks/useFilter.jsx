import { useState, useMemo, useCallback } from 'react';

const useFilter = (products) => {
  const [filters, setFilters] = useState({
    blogshopFilter: [],
    categoryFilter: [],
    colourFilter: [],
    sizeFilter: [],
    priceFilter: { type: '', range: { min: '', max: '' } },
  });

  // sort items into categories based on keywords
  const getCategory = (title) => {
    const keywords = {
      Tops: ['top', 'shirt', 'tee', 'blouse', 'tube', 'crew neck', 'offsie', 'bralet', 'tank', 'toga', 'cami', 'bustier'],
      Dresses: ['dress', 'romper', 'gown'],
      Outerwear: ['jacket', 'cardi', 'cardigan', 'pullover', 'hoodie', 'vest', 'blazer', 'parka', 'sweater', 'tunic'],
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
      Pink: ['pink', 'peach', 'rose', 'sakura', 'parfait', 'blush', 'cranberry', 'raspberry'],
      Blue: ['blue', 'navy', 'tiffany', 'denim', 'wash', 'periwinkle', 'sky', 'arctic', 'marine', 'teal',
        'midnight', 'cobalt', 'eclipse', 'sapphire', 'turquoise', 'cotton candy', 'ocean', 'ice'],
      Red: ['red', 'burgundy', 'wine', 'merlot', 'maroon', 'vermilion', 'cherry', 'mulberry', 'ruby', 
        'scarlet', 'fuchsia', 'oxblood'],
      Beige: ['beige', 'natural', 'sand', 'cream', 'mauve', 'almond', 'latte',
       'oat', 'taupe', 'biscott', 'crème', 'creme', 'oatmeal', 'sandalwood', 'bone', 'vanilla',
        'khaki', 'ecru', 'sepia', 'cornsilk', 'champagne', 'dune', 'tapioca', 'porcelain',
        'ivory', 'chalk', 'birch', 'wheat', 'nude', 'chai', 'cashmere', 'fawn', 'pearl', 
        'biscuit', 'malt', 'flax', 'linen', 'truffle', 'gold', 'cement', 'beton'],
      Black: ['black', 'liquorice', 'sesame', 'ink'],
      Brown: ['brown', 'rust', 'tann', 'oak', 'mocha', 'cocoa', 'espresso', 'coffee', 
        'toffee', 'tortila', 'tortilla', 'caramel', 'auburn', 'walnut', 'mahogany', 'camel',
        'chocolate', 'copper', 'nut', 'oregano'],
      Grey: ['grey', 'gray', 'gunmetal', 'greige', 'clay', 'charcoal', 'rosewood', 'etoupe', 'stone', 'graphite',
        'sesame', 'space', 'fog', 'silver', 'aluminium'],
      White: ['white'],
      Green: ['green', 'army', 'emerald', 'forest', 'olive', 'sage', 'seafoam', 'avocado', 'lime', 'mint',
        'pine', 'cactus', 'nature', 'pistachio', 'botanic', 'moss', 'foliage', 'matcha', 'cedar', 'dew', 
        'jade', 'eucalyptus', 'celadon', 'pear', 'apple'],
      Orange: ['orange', 'terracotta', 'apricot', 'salmon', 'brick', 'cantaloupe', 'coral', 'tangerine',
        'carrot', 'vermillion', 'saffron', 'citrus'],
      Yellow: ['yellow', 'buttercup', 'sunrise', 'buttermilk', 'sunshine', 'honey', 'dandelion',
         'eggshell', 'daffodil', 'lemon', 'flaxseed', 'butter', 'citron', 'mustard', 'maize'],
      Purple: ['purple', 'lavendar', 'lavender', 'taro', 'lilac', 'eggplant', 'puce', 'thistle',
        'wisteria', 'grape', 'plum', 'magenta', 'berry', 'indigo']
    };

    for (const [colour, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => title.toLowerCase().includes(keyword))) {
        return colour;
      }
    }
    return 'Patterned';
  };

  

  // filter by blogshops, categories, sizes, colours and price
  const applyFilters = useCallback(() => {
    return products.filter(product => {
      const productCategory = getCategory(product.title);
      const productColour = getColour(product.title);
      const matchBlogshop = !filters.blogshopFilter || !filters.blogshopFilter.length || filters.blogshopFilter.includes(product.shop);
      const matchCategory = !filters.categoryFilter.length || filters.categoryFilter.includes(productCategory);
      const matchColour = !filters.colourFilter.length || filters.colourFilter.includes(productColour);
      const matchSize = !filters.sizeFilter.length || (product.sizesList && filters.sizeFilter.some(size => product.sizesList.includes(size)));
      const matchPrice = !filters.priceFilter.type
        || (filters.priceFilter.type === 'low-to-high' && product.price)
        || (filters.priceFilter.type === 'high-to-low' && product.price)
        || (filters.priceFilter.type === 'range' && product.price >= filters.priceFilter.range.min && product.price <= filters.priceFilter.range.max);

      return matchBlogshop && matchCategory && matchSize && matchColour && matchPrice;
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

