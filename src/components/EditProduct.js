import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaImage, FaTimes } from 'react-icons/fa';
import './EditProduct.css';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Form states
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${id}`);
            const product = response.data;
            
            // Set form data
            setName(product.name);
            setPrice(product.price);
            setQuantity(product.quantity);
            setDescription(product.description);
            setCategory(product.category);
            setExistingImages(product.imageUrls || []);
            
            setLoading(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setNewFiles(prevFiles => [...prevFiles, ...selectedFiles]);

        // Create previews for new files
        const newPreviews = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            isNew: true
        }));
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        try {
            setSaving(true);
            setError(null);

            // Validation
            if (!name || !price || !description || !category) {
                throw new Error('Vui lòng điền đầy đủ thông tin sản phẩm');
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('existingImages', JSON.stringify(existingImages));

            // Append new files
            newFiles.forEach(file => {
                formData.append('files', file);
            });

            await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate(`/product/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="edit-product">
            <div className="edit-product-header">
                <h2>Chỉnh sửa sản phẩm</h2>
                <Link to={`/product/${id}`} className="back-link">
                    <FaArrowLeft /> <span>Quay lại</span>
                </Link>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label htmlFor="name">Tên sản phẩm:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">Giá:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá sản phẩm"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Số lượng:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Nhập số lượng"
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Danh mục:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Nhập danh mục"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Mô tả:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nhập mô tả sản phẩm"
                        rows="5"
                    />
                </div>

                <div className="form-group">
                    <label>Hình ảnh:</label>
                    <div className="image-upload-container">
                        <div className="existing-images">
                            {existingImages.map((url, index) => (
                                <div key={index} className="image-preview-container">
                                    <img
                                        src={`http://localhost:8080/uploads/${url}`}
                                        alt={`Product ${index + 1}`}
                                        className="image-preview"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => removeExistingImage(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="new-images">
                            {previews.map((preview, index) => (
                                <div key={index} className="image-preview-container">
                                    <img
                                        src={preview.url}
                                        alt={`New preview ${index + 1}`}
                                        className="image-preview"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => removeNewFile(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <label className="upload-button">
                            <FaImage /> Thêm ảnh
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className={`save-button ${saving ? 'saving' : ''}`}
                        disabled={saving}
                    >
                        <FaSave />
                        <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;