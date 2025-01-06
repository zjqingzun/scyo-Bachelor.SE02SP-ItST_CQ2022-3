import React from 'react';
import Sidebar from './sidebar/sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({children}) => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="py-3" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;
