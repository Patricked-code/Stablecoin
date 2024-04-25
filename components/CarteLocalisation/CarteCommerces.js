// Début du code amélioré

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

// Fonction de calcul de la distance entre deux points géographiques
const haversineDistance = (mk1, mk2) => {
    var R = 6371.0710; // Rayon de la Terre en kilomètres
    var rlat1 = mk1.lat * (Math.PI/180); // Convertir les degrés en radians
    var rlat2 = mk2.lat * (Math.PI/180);
    var difflat = rlat2-rlat1; // Différence de latitude
    var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Différence de longitude

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
};

const CarteCommerces = () => {
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey,
    });

    const [userPosition, setUserPosition] = useState({ lat: 48.8566, lng: 2.3522 });
    const [selectedTrade, setSelectedTrade] = useState('');
    const [commerces, setCommerces] = useState([]);
    const [visibleCommerces, setVisibleCommerces] = useState([]);
    const [selectedCommerce, setSelectedCommerce] = useState(null);

    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

    const tradeOptions = [
        'Restauration et hôtellerie', 'Immobilier', 'Transports et logistique', 'Santé et bien-être',
        'Éducation et formation', 'Tourisme et loisirs', 'Art et culture',
        'Produits agricoles et alimentaires', 'Mode et accessoires', 'Bricolage et de l\'habitat',
        'Automobiles et motos', 'Lavage auto', 'Garagiste', 'Supermarchés',
        'Bibliothèques et papeteries', 'Magasins de produits électroniques', 'Magasins de jeux et jouets',
        'Boutiques de sport et équipements de loisirs', 'Boutiques de cadeaux et d\'artisanat', 'Centres commerciaux',
        'Boutique', 'Services de réparation et d\'entretien', 'Cinémas et théâtres', 'Concerts et événements',
        'Cafés et boulangeries', 'Bars et clubs', 'Agences de voyage et services de réservation',
        'Pharmacies et parapharmacies', 'Magasins de meubles et décoration d\'intérieur', 'Services de coiffure et esthétique',
        'Services de nettoyage et d\'entretien'
    ];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              setUserPosition({ lat: coords.latitude, lng: coords.longitude });
            },
            (error) => {
              console.error('Erreur de géolocalisation:', error);
            },
            { enableHighAccuracy: true } // Utilisation de l'option enableHighAccuracy
          );
          
    }, []);

    useEffect(() => {
        const fetchCommerces = async () => {
            try {
                const response = await fetch(`${API_URL}/api/payment-request/${selectedTrade === '' ? 'find-all-request-use-stablecoin-active' : 'searche-request-use-stablecoin?searchElement=' + encodeURIComponent(selectedTrade)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                });

                if (!response.ok) throw new Error('Erreur lors de la récupération des commerces');
                const data = await response.json();

                setCommerces(data);
                setVisibleCommerces(data);
            } catch (error) {
                console.error("Erreur lors de la requête au backend:", error);
            }
        };

        fetchCommerces();
    }, [selectedTrade, API_URL]);

    if (loadError) return <div>Erreur de chargement de la carte</div>;
    if (!isLoaded) return <div>Chargement...</div>;

    
    /**
     * Transforme une chaîne de caractères JSON représentant un tableau de types de commerce
     * en une chaîne de caractères lisible avec les éléments séparés par des virgules.
     * La fonction tente de parser la chaîne de caractères en tant que JSON. Si le parsing
     * réussit et que le résultat est un tableau, elle renvoie une chaîne avec les éléments
     * du tableau séparés par des virgules. En cas d'échec du parsing, elle attrape l'erreur
     * et retourne une chaîne vide.
     *
     * @param {string} productTypesString - La chaîne de caractères JSON à transformer.
     * @returns {string} Les types de commerce formatés en une chaîne lisible, ou une chaîne vide en cas d'erreur.
     */
     function formatProductTypes(productTypesString) {
        try {
          const productTypes = JSON.parse(productTypesString);
          if (Array.isArray(productTypes)) {
            return productTypes.join(', ');
          }
          return '';
        } catch (error) {
          console.error('Erreur lors du parsing de productTypes:', error);
          return '';
        }
    }

    const isCommerceOpenToday = (workingDays) => {
        if (!workingDays) return false; // Vérifie si workingDays est null ou undefined

    const today = new Date();
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const todayName = dayNames[today.getDay()]; // Obtient le nom du jour actuel

    return workingDays.includes(todayName);
    };

    const getOpeningHours = (commerce) => {
        if (!commerce) return ''; // Vérifie si commerce est null ou undefined
      
        const today = new Date();
        const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const todayName = dayNames[today.getDay()]; // Obtient le nom du jour actuel
      
        let openingTime = '';
        let closingTime = '';
      
        // Vérifie si le commerce est ouvert aujourd'hui et définit les heures d'ouverture en fonction du jour
        if (commerce.workingDays && commerce.workingDays.includes(todayName)) {
          switch (todayName) {
            case 'Samedi':
              openingTime = commerce.openingTimeSaturday || commerce.openingTime; // Utilisez openingTimeSaturday si disponible
              closingTime = commerce.closingTimeSaturday || commerce.closingTime; // Utilisez closingTimeSaturday si disponible
              break;
            case 'Dimanche':
              openingTime = commerce.openingTimeSunday || commerce.openingTime; // Utilisez openingTimeSunday si disponible
              closingTime = commerce.closingTimeSunday || commerce.closingTime; // Utilisez closingTimeSunday si disponible
              break;
            default:
              openingTime = commerce.openingTime;
              closingTime = commerce.closingTime;
          }
          return `Ouvert de ${openingTime} à ${closingTime}`;
        } else {
          return 'Fermé aujourd\'hui';
        }
      };
      
    

    return (
           
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>

            <div style={{ width: '30%', padding: '20px', overflowY: 'auto', maxHeight: '800px', borderRight: '1px solid #ccc' }}>
                <select value={selectedTrade} onChange={(e) => setSelectedTrade(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>
                    <option value="">Sélectionnez un type de commerce</option>
                    {tradeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                {visibleCommerces.map((commerce, index) => (
                    <div key={commerce.id} style={{ marginBottom: '20px' }}>
                        <div className='row'>
                            <div className='col-lg-9 col-md-9'>
                                <h5 className=''>{` ${commerce.shopName} (${index + 1})`}</h5>
                            </div>
                            <div className='col-lg-3 col-md-3'>
                                <p className=''>{haversineDistance(userPosition, { lat: parseFloat(commerce.altitude), lng: parseFloat(commerce.longitude) }).toFixed(2)} km</p>
                            </div>
                        </div>
                        {/* <p>{commerce.description}</p> */}
                        <p ><i className='colorBlue py-0'>{formatProductTypes(commerce?.productType)} </i><br/>
                        {commerce.shopContact?(<><i>cel: {commerce.shopContact}</i><br/></>):""}
                        
                        {/* Affichage de la période de travail */}
                        <i className={isCommerceOpenToday(commerce.workingDays) ? 'colorGreen' : 'colorRed'}>
                            {getOpeningHours(commerce)}
                        </i>
                        {/* {isCommerceOpenToday(commerce.workingDays) ? (
                            <>
                                <i className='colorGreen'>Ouvert de {commerce.openingTime} à {commerce.closingTime}</i>
                            </>
                        ) : (
                            <>
                                <i className='colorRed'>Fermé aujourd'hui</i>
                            </>
                        )} */}
                        </p>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                <GoogleMap mapContainerStyle={{ width: '100%', height: '800px' }} center={userPosition} zoom={12}>
                    <Marker position={userPosition} label="Moi" />
                    {visibleCommerces.map((commerce, index) => (
                        <Marker key={commerce.id} position={{ lat: parseFloat(commerce.altitude), lng: parseFloat(commerce.longitude) }} label={`${index + 1}`} 
                        onMouseOver={() => setSelectedCommerce(commerce)}
                        onMouseOut={() => setSelectedCommerce(null)}
                        />
                    ))}

                    {selectedCommerce && (
                        <InfoWindow
                            position={{
                                lat: parseFloat(selectedCommerce.altitude),
                                lng: parseFloat(selectedCommerce.longitude)
                            }}
                            onCloseClick={() => setSelectedCommerce(null)}
                        >
                            <div>
                                <h4>{selectedCommerce.shopName}</h4>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>

        </div>
    );
};

export default CarteCommerces;

// Fin du code amélioré
