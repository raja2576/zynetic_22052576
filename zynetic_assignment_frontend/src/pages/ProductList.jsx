import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // 📦 Product list fetch karo
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://backend-server-1dgg.onrender.com/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ❌ Product delete karne ka logic
  const removeItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`https://backend-server-1dgg.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Delete failed');
        }

        toast.success('Product deleted');
        fetchItems(); // List refresh karo
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete product.');
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">🛒 Available Products</h2>
        {user?.role === 'ADMIN' && (
          <Link to="/products/add" className="btn btn-sm btn-success">
            + Add New Product
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center text-muted">Loading products...</div>
      ) : (
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Category</th>
              {user?.role === 'ADMIN' && <th>Manage</th>}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={user?.role === 'ADMIN' ? 7 : 6} className="text-center">
                  No products available.
                </td>
              </tr>
            ) : (
              items.map((prod, idx) => (
                <tr key={prod.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {prod.imageName ? (
                      <img
                        src={`https://backend-server-1dgg.onrender.com/api/products/image/${prod.imageName}`}
                        alt="product"
                        width="60"
                        height="60"
                        style={{ objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>{prod.name}</td>
                  <td>₹{prod.price}</td>
                  <td>{prod.rating}/5</td>
                  <td>{prod.category}</td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      <Link
                        to={`/products/edit/${prod.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(prod.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
