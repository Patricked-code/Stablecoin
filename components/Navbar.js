import React from "react";
import Image from 'next/image'
import PaiementEboutik from "./profil/Payment/PaiementEboutik";


export default function Navbar() {
    return (
        <>
            {/* POUR DELENCHER LE POP UP DE PAIEMENT EN ATTENTE FAIRE SUR LES SITES ECOMMERCES */}
            <PaiementEboutik/>
            {/* FIN */}
            
            <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <Image src="/img_1.jpeg" alt="Vercel Logo" width="50" height="50" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/profil/">Profil</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link active" href="/profil/portefeuille">Portefeuille</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link active" href="/profil/transactions/">Transactions</a>
                        </li>
                        
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}