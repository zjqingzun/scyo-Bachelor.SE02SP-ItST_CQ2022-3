import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
    const location = useLocation();
    return (
        <div className="sidebar d-flex flex-column text-center text-white p-3 py-5" style={{ height: '100vh', width: '250px' }}>
            <div className="my-5 title">BookaStay</div>
            <ul className="nav flex-column mt-5 fs-3">
                <li
                    className={`nav-item mb-3 ${location.pathname === '/admin/dashboard' ? 'active' : ''
                        }`}
                >
                    <Link to="/admin/dashboard" className="nav-link">
                        Dashboard
                    </Link>
                </li>
                <li
                    className={`nav-item mb-3 ${location.pathname === '/admin/manage-users' ? 'active' : ''
                        }`}
                >
                    <Link to="/admin/manage-users" className="nav-link">
                        Users
                    </Link>
                </li>
                <li
                    className={`nav-item mb-3 ${location.pathname === '/admin/manage-hotel-owners' ? 'active' : ''
                        }`}
                >
                    <Link to="/admin/manage-hotel-owners" className="nav-link">
                        Owners
                    </Link>
                </li>
                <li
                    className={`nav-item mb-3 ${location.pathname === '/admin/manage-hotels' ? 'active' : ''
                        }`}
                >
                    <Link to="/admin/manage-hotels" className="nav-link">
                        Hotels
                    </Link>
                </li>
                <li
                    className={`nav-item mb-5 ${location.pathname === '/admin/manage-requests' ? 'active' : ''
                        }`}
                >
                    <Link to="/admin/manage-requests" className="nav-link">
                        Requests
                    </Link>
                </li>
                <li 
                    className={`nav-item last-nav ${location.pathname === '/' ? 'active' : ''
                        }`}
                >
                    <Link to="/admin/login" className="nav-link fw-bold">
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
