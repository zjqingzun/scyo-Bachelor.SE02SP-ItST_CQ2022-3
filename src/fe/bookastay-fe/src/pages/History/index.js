import React, { useEffect, useState } from 'react';
import './history.css';
import icons from "~/assets/icon";

const History = () => {
    return (
        <div>
            <div className='row my-5 py-5'>
                <div className='col-6 d-flex align-items-center ps-5 pt-5'>
                    <img src={icons.clockRotateLeftIcon} alt="ClockRotateLeft" className='clockRotateLeftIcon ms-5' />
                    <h1 className='ms-5 pt-2'>History</h1>
                </div>
                <div className='col-6'>
                    <div class="input-group pe-5 pt-5">
                        <input type="text" className="form-control p-3 fs-3" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" />
                        <img src={icons.searchIcon} type="button" id="button-addon2" alt="search" className='btn btn-outline-primary searchIcon' />
                    </div>
                </div>
            </div>
            <div className='row my-5'>
                <div className='col-6 px-5'>
                    <div className='history-card p-5 my-4'>
                        <div className='row'>
                            <div className='col-2 d-flex flex-column align-items-center'>
                                <p>25/12/2024</p>
                                <p>Time</p>
                            </div>
                            <div className='col-9 mx-4'>
                                <h2>Status</h2>
                                <p>ID</p>
                                <p>Hotel's Name</p>
                                <p>Money</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-6 px-5'>
                    <div className='history-card p-5 my-4'>
                        <div className='row'>
                            <div className='col-2 d-flex flex-column align-items-center'>
                                <p>25/12/2024</p>
                                <p>Time</p>
                            </div>
                            <div className='col-9 mx-4'>
                                <h2>Status</h2>
                                <p>ID</p>
                                <p>Hotel's Name</p>
                                <p>Money</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default History;