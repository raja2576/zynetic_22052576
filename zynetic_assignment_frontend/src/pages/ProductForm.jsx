import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    rating: '',
    category: '',
    imageName: ''
  });

  const [imageFile, setImageFile] = useState(null); // 🖼️ Image file store karne ke liye

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // 🔄 Existing product fetch karna (edit mode)
  const fetchProduct = async () => {
    if (id) {
      try {
        const res = await fetch(`https://backend-server-1dgg.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product', err);
        toast.error("Product load nahi hua");
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 📤 Image upload karne ka logic
  const uploadImageToServer = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('https://backend-server-1dgg.onrender.com/api/products/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      const imageName = await res.text();
      return imageName;
    } catch (err) {
      console.error('Image upload failed', err);
      toast.error("Image upload fail ho gaya");
      return null;
    }
  };

  // 🟢 Submit product data (Add ya Edit)
  const submitProduct = async (e) => {
    e.preventDefault();

    let finalImageName = product.imageName;

    if (imageFile) {
      const uploadedName = await uploadImageToServer();
      if (!uploadedName) return; // fail hua toh return
      finalImageName = uploadedName;
    }

    const productData = { ...product, imageName: finalImageName };

    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `https://backend-server-1dgg.onrender.com/api/products/modify`
      : 'https://backend-server-1dgg.onrender.com/api/products/add';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success(id ? "Product updated" : "Product added");
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      console.error('Error saving product', err);
      toast.error("Product save nahi hua");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>{id ? '🛠️ Update Product' : '🆕 Add New Product'}</h2>

      <form onSubmit={submitProduct}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={product.description}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rating (out of 5)</label>
          <input
            type="number"
            step="0.1"
            max="5"
            name="rating"
            className="form-control"
            value={product.rating}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={product.category}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {product.imageName && (
            <div className="mt-2">
              <strong>Current Image:</strong>{' '}
              <img
                src={`https://backend-server-1dgg.onrender.com/api/products/image/${product.imageName}`}
                alt="Preview"
                style={{ width: '100px', height: 'auto' }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-success">
          {id ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
