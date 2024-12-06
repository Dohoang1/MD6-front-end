import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductList.css';

function ProductList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/product/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                fetchProducts(); // Refresh list after delete
            } catch (err) {
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    return (
        <div className="product-list">
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <Link to={`/product/${product.id}`} className="product-link">
                            <div className="product-image-container">
                                <img 
                                    src={`http://localhost:8080/uploads/${product.imageUrls[0]}`} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300';
                                    }}
                                />
                            </div>
                        </Link>
                        <div className="product-info">
                            <Link to={`/product/${product.id}`} className="product-name-link">
                                <h3>{product.name}</h3>
                            </Link>
                            <span className="product-category">{product.category}</span>
                            <div className="product-status">
                                {product.quantity > 0 ? (
                                    <span className="in-stock">Còn hàng</span>
                                ) : (
                                    <span className="out-of-stock">Hết hàng</span>
                                )}
                            </div>
                            <p className="product-price">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(product.price)}
                            </p>
                            <div className="product-actions">
                                <button 
                                    className="action-btn cart-btn"
                                    disabled={product.quantity < 1}
                                    title="Thêm vào giỏ hàng"
                                >
                                    <FaShoppingCart />
                                </button>
                                <button 
                                    className="action-btn edit-btn"
                                    onClick={() => handleEdit(product.id)}
                                    title="Sửa sản phẩm"
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(product.id)}
                                    title="Xóa sản phẩm"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;