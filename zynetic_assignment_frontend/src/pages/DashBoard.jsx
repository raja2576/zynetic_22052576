import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({ category: "", price: "", rating: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isEditing = !!selectedProduct?.id;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://backend-server-1dgg.onrender.com/api/products/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, [token]);

  // Filtering, search and sorting
  useEffect(() => {
    let updated = [...products];

    if (searchTerm.trim()) {
      updated = updated.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      updated = updated.filter(p => p.category === filters.category);
    }
    if (filters.price) {
      updated = updated.filter(p => p.price <= Number(filters.price));
    }
    if (filters.rating) {
      updated = updated.filter(p => p.rating >= Number(filters.rating));
    }

    if (sortBy === "price-asc") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-asc") {
      updated.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "rating-desc") {
      updated.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(updated);
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, products]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`https://backend-server-1dgg.onrender.com/api/products/remove/${productId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId));
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      console.error("Error while deleting", err);
      toast.error("Server error");
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const openAddModal = () => {
    setSelectedProduct({
      name: "",
      description: "",
      category: "",
      price: 0,
      rating: 0,
      imageName: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEditing
      ? "https://backend-server-1dgg.onrender.com/api/products/modify"
      : "https://backend-server-1dgg.onrender.com/api/products/add";

    try {
      const res = await axios({
        method: isEditing ? "put" : "post",
        url: endpoint,
        data: selectedProduct,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });

      const updatedProduct = res.data;

      if (isEditing) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        toast.success("Product updated successfully");
      } else {
        setProducts([updatedProduct, ...products]);
        toast.success("Product added successfully");
      }

      closeModal();
    } catch (err) {
      console.error("Error saving product", err);
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2>
        Welcome, <strong>{user?.email}</strong> ({user?.role})
      </h2>

      {user?.role === "ADMIN" && (
        <Button variant="primary" className="float-end mb-2" onClick={openAddModal}>
          + Add Product
        </Button>
      )}

      {/* Filters */}
      <Row className="my-3 g-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder="Max Price"
            onChange={e => setFilters({ ...filters, price: e.target.value })}
          />
        </Col>
        <Col md={2}>
          <Form.Select onChange={e => setFilters({ ...filters, rating: e.target.value })}>
            <option value="">Min Rating</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select onChange={e => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating-asc">Rating ↑</option>
            <option value="rating-desc">Rating ↓</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Products */}
      <Row className="g-4">
        {currentItems.length > 0 ? currentItems.map(product => (
          <Col md={4} key={product.id}>
           <Card className="h-100 shadow rounded-4 border-0 overflow-hidden">
  <div className="position-relative">
    {/* <Card.Img
      variant="top"
      src={
        product.imageUrl?.trim()
          ? product.imageUrl
          : product.imageName
          ? `http://localhost:8080/api/products/image/${product.imageName}`
          : 'https://via.placeholder.com/300x200.png?text=No+Image'
      }
      alt={product.name}
      style={{ height: '220px', objectFit: 'cover' }}
    /> */}
    <span
      className="position-absolute top-0 end-0 m-2 badge bg-success"
      style={{ fontSize: '0.9rem' }}
    >
      ₹{product.price}
    </span>
  </div>

  <Card.Body className="d-flex flex-column justify-content-between">
    <div>
      <Card.Title className="fw-bold text-primary mb-2" style={{ fontSize: '1.2rem' }}>
        {product.name}
      </Card.Title>
      <Card.Text className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>
        {product.category}
      </Card.Text>
      <div className="text-warning mb-3">
        ⭐ {product.rating} / 5
      </div>
    </div>

    <div className="d-flex flex-wrap justify-content-between gap-2">
      <Button variant="outline-info" size="sm" onClick={() => openModal(product)}>
        Details
      </Button>

      {user?.role === 'ADMIN' && (
        <>
          <Button variant="outline-warning" size="sm" onClick={() => openModal(product)}>
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  </Card.Body>
</Card>

          </Col>
        )) : (
          <p>No products found.</p>
        )}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >Previous</Button>
        <span className="mx-3 mt-1">Page {currentPage} of {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >Next</Button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedProduct?.name || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={selectedProduct?.description || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={selectedProduct?.category || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={selectedProduct?.price || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    step="0.1"
                    max="5"
                    value={selectedProduct?.rating || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button variant="secondary" onClick={closeModal} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="success">
                {isEditing ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
