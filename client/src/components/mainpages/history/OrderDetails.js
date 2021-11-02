import React, { useState, useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import { useParams } from 'react-router-dom';

function OrderDetails() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetails, setOrderDetails] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      history.forEach((item) => {
        if (item._id === id) setOrderDetails(item);
      });
    }
  }, [id, history]);

  // useEffect(() => {
  //   setOrderDetails(history.filter((item) => item._id === id));
  // }, [history, id]);

  if (orderDetails.length === 0) return null;

  // console.log(orderDetails, 'render');
  return (
    <div className='history-page'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Postal Code</th>
            <th>Country Code</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{orderDetails.name}</td>
            <td>
              {orderDetails.address.address_line_1 +
                '-' +
                orderDetails.address.admin_area_2}
            </td>
            <td>{orderDetails.address.postal_code}</td>
            <td>{orderDetails.address.country_code}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt='' />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>$ {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
