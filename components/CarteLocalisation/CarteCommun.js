// Début du code amélioré

import React, { useEffect, useState } from 'react';
import CarteAgences from './CarteAgences';
import CarteCommerces from './CarteCommerces';


const CarteCommun = () => {
   
    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

    return (
        <>
            {/* L'entête des tabs */}
            <div className="bloc-tabs-utilite ">
                                            
                <button
                    className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(1)}
                >
                    <span className=''>Localiser commerces</span>
                </button>

                <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}

                >
                    <span className=''>Localiser agences</span>
                </button>
            </div>


            {/* Le corps de tab */}
            <div className="content-tabs">
                {/* Localisation des agences */}
                <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                >
                    <CarteCommerces/>

            </div>
            </div>


            {/* Le corps de tab */}
            <div className="content-tabs">
                {/* Localisation des agences */}
                <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                >
                    <CarteAgences/>

            </div>
            </div>
        </>
    );
};

export default CarteCommun;

// Fin du code amélioré
