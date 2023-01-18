import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const SideBar = () => {
 
  return (
    <>
      <div className='main-banner-area card mt-1 mb-5'>
        <div className='container'>
          <div className=''>
            <ul className="navbar-nav ">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/profil">Profil</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/profil/portefeuille">Mes actifs</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/profil/ecosysteme">Ecosysteme</a>
                </li>

                <li className="nav-item">
                    <a className="nav-link active" href="/#">Kyc</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/profil/ecosysteme/crowdfunding">Crowdfunding</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/profil/ecosysteme/investissement">Investissement</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/profil/ecosysteme/ecommerces">E-commerce</a>
                </li>
                

                <li className="nav-item">
                    <a className="nav-link active" href="/#">Transactions</a>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
