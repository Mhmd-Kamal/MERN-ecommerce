import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';

import Products from './products/Products';
import DetailProduct from './detailProduct/DetailProduct';
import Cart from './cart/Cart';
import Login from './auth/Login';
import Register from './auth/Register';
import NotFound from './utils/not_found/NotFound';
import OrderHistory from './history/OrderHistory';
import OrderDetails from './history/OrderDetails';
import Categories from './categories/Categories';
import CreateProduct from './createProduct/CreateProduct';

function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <div>
      <Switch>
        <Route exact path='/'>
          <Products />
        </Route>

        <Route exact path='/detail/:id'>
          <DetailProduct />
        </Route>

        <Route exact path='/cart'>
          <Cart />
        </Route>

        <Route exact path='/login'>
          {isLogged ? <NotFound /> : <Login />}
        </Route>

        <Route exact path='/register'>
          {isLogged ? <NotFound /> : <Register />}
        </Route>

        <Route exact path='/category'>
          {isAdmin ? <Categories /> : <NotFound />}
        </Route>

        <Route exact path='/create_product'>
          {isAdmin ? <CreateProduct /> : <NotFound />}
        </Route>

        <Route exact path='/edit_product/:id'>
          {isAdmin ? <CreateProduct /> : <NotFound />}
        </Route>

        <Route exact path='/history'>
          {isLogged ? <OrderHistory /> : <NotFound />}
        </Route>

        <Route exact path='/history/:id'>
          {isLogged ? <OrderDetails /> : <NotFound />}
        </Route>

        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default Pages;
