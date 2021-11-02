import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import axios from 'axios';
import Filters from './Filters';
import LoadMore from './LoadMore';

function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.ProductsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallBack] = state.ProductsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const deleteProduct = async (id, public_id) => {
    setLoading(true);

    await axios.post(
      '/api/destroy',
      { public_id: public_id },
      { headers: { Authorization: token } }
    );

    await axios.delete(`/api/products/${id}`, {
      headers: { Authorization: token },
    });

    setCallBack(!callback);
    setLoading(false);
  };

  const handleCheck = async (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });

    setProducts([...products]);
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });

    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  if (loading) return <Loading />;

  return (
    <>
      <Filters />
      {isAdmin && (
        <div className='delete-all'>
          <span>Select All</span>
          <input type='checkbox' value={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className='products'>
        {products.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            isAdmin={isAdmin}
            deleteProduct={deleteProduct}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
}

export default Products;
