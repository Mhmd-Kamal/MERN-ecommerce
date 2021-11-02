import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
// import PayPalButton from './PayPalButton';
import { PayPalButton } from 'react-paypal-button-v2';

function Cart() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [cart, setCart] = state.userAPI.cart;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((pre, item) => {
        return pre + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cart]);

  const addTocart = async (cart) => {
    await axios.patch(
      '/user/addcart',
      { cart },
      { headers: { Authorization: token } }
    );
  };
  const increment = (id) => {
    cart.forEach((item) => {
      if (id === item._id) item.quantity += 1;
    });
    setCart([...cart]);
    addTocart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (id === item._id)
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
    });
    setCart([...cart]);
    addTocart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm('Do you want to delete this product')) {
      cart.forEach((item, index) => {
        if (item._id === id) cart.splice(index, 1);
      });

      setCart([...cart]);
      addTocart(cart);
    }
  };

  const tranSuccess = async (payment) => {
    const {
      id: paymentID,
      payer: { address },
    } = payment;

    await axios.post(
      '/api/payment',
      { cart, paymentID, address },
      { headers: { Authorization: token } }
    );

    setCart([]);
    addTocart([]);
    alert('You have successfully placed an order.');
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: 'center', fontSize: '4rem' }}>Cart Empty</h2>
    );

  const style = {
    size: 'small',
    color: 'blue',
    shape: 'rect',
    label: 'checkout',
    tagline: false,
  };

  return (
    <div>
      {cart.map((product) => (
        <div className='detail cart' key={product._id}>
          <img src={product.images.url} alt='' />

          <div className='box-detail'>
            <h2>{product.title}</h2>
            <h3>$ {product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className='amount'>
              <button
                onClick={() => {
                  decrement(product._id);
                }}
              >
                {' '}
                -{' '}
              </button>
              <span>{product.quantity}</span>
              <button
                onClick={() => {
                  increment(product._id);
                }}
              >
                {' '}
                +{' '}
              </button>
            </div>
            <div
              className='delete'
              onClick={() => {
                removeProduct(product._id);
              }}
            >
              X
            </div>
          </div>
        </div>
      ))}

      <div className='total'>
        <h3>Total: $ {total}</h3>
        {/* <PayPalButton total={total} tranSuccess={tranSuccess} /> */}
        <PayPalButton
          amount={total}
          style={style}
          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
          onSuccess={(details) => {
            console.log(details);
            tranSuccess(details);
            alert('Transaction completed by ' + details.payer.name.given_name);
          }}
        />
      </div>
    </div>
  );
}

export default Cart;
