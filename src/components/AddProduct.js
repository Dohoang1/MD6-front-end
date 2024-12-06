import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProduct.css';

function AddProduct() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Xử lý khi chọn files
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        // Tạo preview cho các files đã chọn
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    // Xóa một preview
    const removePreview = (index) => {
        const newFiles = [...files];
        const newPreviews = [...previews];
        
        newFiles.splice(index, 1);
        URL.revokeObjectURL(previews[index]); // Giải phóng URL
        newPreviews.splice(index, 1);
        
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate
            if (!name || !price || !quantity || !description || !category || files.length === 0) {
                throw new Error('Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 ảnh');
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('description', description);
            formData.append('category', category);
            
            // Thêm nhiều files
            files.forEach(file => {
                formData.append('files', file);
            });

            await axios.post('http://localhost:8080/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/');
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cleanup previews khi component unmount
    React.useEffect(() => {
        return () => {
            previews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [previews]);

    return (
        <div className="add-product">
            <h2>Thêm sản phẩm mới</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
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
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Hình ảnh sản phẩm:</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    
                    {/* Image Previews */}
                    <div className="image-previews">
                        {previews.map((preview, index) => (
                            <div key={index} className="preview-container">
                                <img 
                                    src={preview} 
                                    alt={`Preview ${index + 1}`}
                                    className="preview-image"
                                />
                                <button
                                    type="button"
                                    className="remove-preview"
                                    onClick={() => removePreview(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;