import React from 'react';
import './Footer.scss'; // Import your styles here

const Footer = () => {
    return (
        <div  className="footer">
            <div className="footer-content row">
                <div className="footer-left col-7 px-5 pt-5 pb-3">
                    <h1 className='mb-5 mt-3 fw-bold'>BookaStay</h1>
                    <p className='mb-5'>Sequi dolores ratione eos eveniet provident soluta. Omnis nesciunt sit eos at, eius voluptatum rem
                        corporis. Doloremque labore assumenda explicabo velit illo, soluta, inventore hic.</p>
                </div>
                <div className="footer-right col-5 px-5 pt-5 pb-3">
                    <h2 className='mb-4 fs-1'>Menu</h2>
                    <ul>
                        <li><a href="">Home</a></li>
                        <li><a href="">About Us</a></li>
                        <li><a href="">Our privacy</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom d-flex justify-content-between mt-5 pb-2 px-5"> 
                    <p className='ms-5 ps-3'>© 2024 Capybara. All Rights Reserved.</p>
                    <p className='me-5 pe-5'>Developed by: Capybara Team</p>
            </div>
        </div>
    );
};

export default Footer;
