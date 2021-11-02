import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';

const initialState = {
  product_id: '',
  title: '',
  price: 0,
  description: '',
  content: '',
  category: '',
  _id: '',
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [products] = state.ProductsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.ProductsAPI.callback;

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [id, products]);

  const styleUpload = {
    display: images ? 'block' : 'none',
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      if (!isAdmin) return alert('You are not an Admin.');

      const file = e.target.files[0];
      if (!file) return alert('No file has been selected.');
      if (file.size > 1024 * 1024) return alert('File is too large.');

      if (file.type !== 'image/png' && file.type !== 'image/jpeg')
        return alert('Worng file type.');

      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert('You are not an Admin.');

      setLoading(true);

      await axios.post(
        '/api/destroy',
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );

      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('You are not an Admin.');
      if (!images) return alert('No images are uploaded.');

      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          { headers: { Authorization: token } }
        );
      } else {
        await axios.post(
          '/api/products',
          { ...product, images },
          { headers: { Authorization: token } }
        );
      }

      setCallback(!callback);
      history.push('/'); //todo use <Redirect/>
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className='create_product'>
      <div className='upload'>
        <input type='file' name='file' id='file_up' onChange={handleUpload} />

        {loading ? (
          <div id='file_img'>
            <Loading />
          </div>
        ) : (
          <div id='file_img' style={styleUpload}>
            <img src={images ? images.url : ''} alt='' />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label htmlFor='product_id'>Product ID</label>
          <input
            type='text'
            name='product_id'
            id='product_id'
            required
            value={product.product_id}
            onChange={handleChange}
            disabled={onEdit}
          />
        </div>
        <div className='row'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            id='title'
            required
            value={product.title}
            onChange={handleChange}
          />
        </div>
        <div className='row'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            name='price'
            id='price'
            required
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div className='row'>
          <label htmlFor='description'>Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            required
            value={product.description}
            rows='5'
            onChange={handleChange}
          />
        </div>
        <div className='row'>
          <label htmlFor='content'>Content</label>
          <textarea
            type='text'
            name='content'
            id='content'
            required
            value={product.content}
            rows='7'
            onChange={handleChange}
          />
        </div>
        <div className='row'>
          <label htmlFor='categories'>Categories</label>
          <select
            name='category'
            value={product.category}
            onChange={handleChange}
          >
            <option value=''>Please select a category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type='submit'>{onEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
