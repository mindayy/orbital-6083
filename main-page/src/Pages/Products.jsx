import React from 'react'
import Navbar from '../Components/Navbar/Navbar';
import ProductDataSSD from '../Components/ProductData/ProductDataSSD';
import ProductDataLovet from '../Components/ProductData/ProductDataLovet';

const Products = () => {
    return (
        <div>
            <Navbar/>
            <ProductDataSSD />
            <ProductDataLovet />
        </div>
    )
}

export default Products
