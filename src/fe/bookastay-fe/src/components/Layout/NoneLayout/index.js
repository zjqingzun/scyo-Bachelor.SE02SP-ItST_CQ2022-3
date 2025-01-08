import React from "react";

const NoneLayout = ({ children }) => {
    return (
        <div>
            <div className="container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default NoneLayout;
