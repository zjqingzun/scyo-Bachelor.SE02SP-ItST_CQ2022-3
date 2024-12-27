import React from 'react';

function HistoryCard({ date, time, status, id, hotelName, money, onClick }) {
    return (
        <div className='col-6 px-5 py-3' onClick={onClick}>
            <div className='history-card px-5 pb-4 pt-5 my-4 shadow'>
                <div className='row'>
                    <div className='col-3 d-flex flex-column align-items-center'>
                        <p>{date}</p>
                        <p>{time}</p>
                    </div>
                    <div className='col-8 mx-4'>
                        <h2>{status}</h2>
                        <p>{id}</p>
                        <p>{hotelName}</p>
                        <p>{money}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;
