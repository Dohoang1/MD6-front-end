import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductList.css';

function ProductList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        fetchProducts();
    }, [searchTerm]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            let filteredProducts = response.data;
            
            // Sort by newest first (assuming products have a timestamp or ID that indicates order)
            filteredProducts.sort((a, b) => b.id - a.id);
            
            // Apply search filter if search term exists
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            setProducts(filteredProducts);
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
                fetchProducts();
            } catch (err) {
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="product-list">
            <h2 className="page-title">Danh sách sản phẩm</h2>
            {searchTerm && (
                <p className="search-results">
                    Kết quả tìm kiếm cho "{searchTerm}": {products.length} sản phẩm
                </p>
            )}
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