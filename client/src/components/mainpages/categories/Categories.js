import axios from 'axios';
import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';

function Categories() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [categories] = state.categoriesAPI.categories;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [category, setCategory] = useState('');
  const [id, setId] = useState('');
  const [onEdit, setOnEdit] = useState(false);

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (!onEdit) {
        const res = await axios.post(
          '/api/category',
          { name: category },
          { headers: { Authorization: token } }
        );
        alert(res.data.msg);
      } else {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          { headers: { Authorization: token } }
        );
        alert(res.data.msg);
      }
      setOnEdit(false);
      setCallback(!callback);
      setCategory('');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editCategory = (id, name) => {
    setCategory(name);
    setId(id);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className='categories'>
      <form onSubmit={createCategory}>
        <label htmlFor='category'>Category</label>
        <input
          type='text'
          name='category'
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type='submit'>{onEdit ? 'Update' : 'Create'}</button>
      </form>
      <div className='col'>
        {categories.map((category) => (
          <div className='row' key={category._id}>
            <p>{category.name}</p>
            <div>
              <button onClick={() => editCategory(category._id, category.name)}>
                Edit
              </button>
              <button onClick={() => deleteCategory(category._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
