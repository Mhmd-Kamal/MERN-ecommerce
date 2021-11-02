import React, { useContext } from 'react';
import CategoriesAPI from '../../../api/CategoriesAPI';
import { GlobalState } from '../../../GlobalState';

function Filters() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;

  const [category, setCategory] = state.ProductsAPI.category;
  const [sort, setSort] = state.ProductsAPI.sort;
  const [search, setSearch] = state.ProductsAPI.search;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch('');
  };

  return (
    <div className='filter_menu'>
      <div className='row'>
        <span>Filters: </span>
        <select name='category' onChange={handleCategory}>
          <option value=''>All Products</option>
          {categories.map((category) => (
            <option value={'category=' + category._id} key={category._id}>
              {
                //todo remove'category=' and add it in the url in Products.js
              }
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <input
        type='text'
        value={search}
        placeholder='Search Here!'
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className='row'>
        <span>Filters: </span>
        <select name='sort' onChange={(e) => setSort(e.target.value)}>
          <option value=''>Newest</option>
          <option value='sort=oldest'>Oldest</option>
          <option value='sort=-sold'>Best Sale</option>
          <option value='sort=-price'>Price: high to low</option>
          <option value='sort=price'>Price: low to high</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
