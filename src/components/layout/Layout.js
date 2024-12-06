import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className="layout">
            {/* Header/Navbar */}
            <header className="header">
                <div className="header-container">
                    <Link to="/" className="logo">
                        <h1>E-Commerce</h1>
                    </Link>
                    <nav className="nav-links">
                        <Link to="/" className="nav-link">Trang chủ</Link>
                        <Link to="/products" className="nav-link">Sản phẩm</Link>
                        <Link to="/add-product" className="nav-link">Thêm sản phẩm</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>Về chúng tôi</h3>
                        <p>E-Commerce - Nền tảng mua sắm trực tuyến hàng đầu</p>
                    </div>
                    <div className="footer-section">
                        <h3>Liên hệ</h3>
                        <p>Email: contact@ecommerce.com</p>
                        <p>Điện thoại: (84) 123-456-789</p>
                    </div>
                    <div className="footer-section">
                        <h3>Theo dõi</h3>
                        <div className="social-links">
                            <a href="#" className="social-link">Facebook</a>
                            <a href="#" className="social-link">Instagram</a>
                            <a href="#" className="social-link">Twitter</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 E-Commerce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;