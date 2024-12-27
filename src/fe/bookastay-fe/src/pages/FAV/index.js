import React, { useState } from 'react';
import './fav.css';
import icons from "~/assets/icon";
import HotelCard from "~/components/HotelCard/HotelCard";

const Favorite = () => {
    const data = [
        {
            name: 'Hotel ABC',
            address: '123 Street, City, Country',
            image: 'https://kinsley.bslthemes.com/wp-content/uploads/2021/08/img-banner-2-scaled-1-1920x1315.jpg',
            price: 200000,
            rating: 9.5,
            review: 100
        },
        {
            name: 'Hotel XYZ',
            address: '456 Street, City, Country',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 150,
            rating: 8.5,
            review: 50
        },
        {
            name: 'Hotel LMN',
            address: '789 Street, City, Country',
            image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 300,
            rating: 7.5,
            review: 70
        },
        {
            name: 'Hotel DEF',
            address: '012 Street, City, Country',
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 250,
            rating: 6.5,
            review: 80
        },
        {
            name: 'Hotel GHI',
            address: '345 Street, City, Country',
            image: 'https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 180,
            rating: 5.5,
            review: 90
        },
        {
            name: 'Hotel PQR',
            address: '678 Street, City, Country',
            image: 'https://cf.bstatic.com/xdata/images/hotel/square600/458830113.webp?k=ff0cb97b7983f09e099de3260a9553fa2a4d0582323e0a962b52cf67ffc2b38f&o=',
            price: 400,
            rating: 4.5,
            review: 110
        },
        {
            name: 'Hotel STU',
            address: '901 Street, City, Country',
            image: 'https://cf.bstatic.com/xdata/images/hotel/square600/586909150.webp?k=422e9c17817cd27de89aaa113a1711a3b23151c8f13919aa1dc08a970b70cf97&o=',
            price: 350,
            rating: 3.5,
            review: 120
        }
    ];
    return (
        <div>
            <div className='row my-5 py-5'>
                <div className='col-6 d-flex align-items-center ps-5 pt-5'>
                    <img src={icons.heartIcon} alt="Heart" className='heartIcon ms-5' />
                    <h1 className='ms-5 pt-2'>Favorite</h1>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end'>
                        <input
                            type='text'
                            placeholder='Search'
                            className='searchInput'
                        />
                        <img src={icons.searchIcon} alt="Search" className='searchIcon' />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <div className='row'>
                        {data.map((item, index) => (
                        <HotelCard 
                            key={index}
                            name={item.name}
                            address={item.address}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                            review={item.review}

                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Favorite;
