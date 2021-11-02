import React, { useState, useEffect } from 'react';
import './loading.css';

function Loading() {
  const [loading, setLoading] = useState('Loading');
  useEffect(() => {
    const t = setTimeout(() => {
      if (loading === 'Loading...') setLoading('Loading');
      setLoading((loading) => loading + '.');
    }, 1000);
    return () => {
      clearTimeout(t);
    };
  }, [loading]);
  return <div className='loading'>{loading}</div>;
}

export default Loading;
