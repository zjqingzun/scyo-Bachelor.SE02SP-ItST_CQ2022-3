import React from 'react';
import Sidebar from '../../../pages/Admin/sidebar/sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="py-3" style={{ flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
