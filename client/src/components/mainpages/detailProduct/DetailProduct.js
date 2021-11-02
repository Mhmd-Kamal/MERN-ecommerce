import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link, useParams } from 'react-router-dom';
import ProductItem from '../utils/productItem/ProductItem';
function DetailProduct() {
  const { id } = useParams();
  const state = useContext(GlobalState);
  const addCart = state.userAPI.addCart;
  const [products] = state.ProductsAPI.products;
  const [detailProduct, setDetailProduct] = useState([]);

  // useEffect(() => {
  //   console.log('run');
  //   if (params) {
  //     products.forEach((product) => {
  //       if (product._id === params.id) setDetailProduct(product);
  //     });
  //   }
  // }, [products, params]);

  // console.log(products, params);
  useEffect(() => {
    // console.log('rerender');

    const product = products.find((product) => product._id === id);
    if (product) setDetailProduct(product);
  }, [products, id]);
  // console.log(detailProduct);

  if (detailProduct.length === 0) return null;

  return (
    <>
      <div className='detail'>
        <img src={detailProduct.images.url} alt='' />
        <div className='box-detail'>
          <div className='row'>
            <h2>{detailProduct.title}</h2>
            <h6>#id: {detailProduct.product_id}</h6>
          </div>
          <span>$ {detailProduct.price}</span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.content}</p>
          <p>sold: {detailProduct.sold}</p>
          <Link
            to='/cart'
            className='cart'
            onClick={() => addCart(detailProduct)}
          >
            Buy Now
          </Link>
        </div>
      </div>

      <div>
        <h2>Related products</h2>
        <div className='products'>
          {products.map((product) =>
            product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null
          )}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
