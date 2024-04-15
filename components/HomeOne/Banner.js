import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Banner = () => {
  const [name, setName] = useState('Bitcoin');
  const [nameTwo, setNameTwo] = useState('USD');

  //api data
  const [newData, setnewData] = useState([]);

  //converter hook
  const [conversionValue, setConversionValue] = useState('');
  const [cryptoQuantity, setcryptoQuantity] = useState(1);
  const [coinSymbol, setcoinSymbol] = useState('BTC');

  const [image, setImage] = useState(
    '/images/cryptocurrency/cryptocurrency2.png'
  );
  const [imageTwo, setImageTwo] = useState(
    '/images/cryptocurrency/cryptocurrency1.png'
  );

  const [clicked, setClicked] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [toggleStateTwo, setToggleStateTwo] = useState(false);

  const toggleTabOne = () => {
    setToggleState(!toggleState);
  };

  const toggleSelected = (cat, index) => {
    if (clicked === index) {
      return setClicked(null);
    }
    setClicked(index);
    setName(cat.name);
    setImage(cat.image);
    setcoinSymbol(cat.symbol.toUpperCase());
  };

  useEffect(() => {
    const getCoins = async () => {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      setnewData(data);
    };
    getCoins();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${coinSymbol}&tsyms=USD`
      );

      setConversionValue(data.USD);
    };
    getData();
  }, [coinSymbol]);
  return (
    <>
      <div className='main-banner-area'>
        <div className='container'>
          
          <div className='row align-items-center m-0'>
            <div className='col-xl-6 col-lg-6 col-md-12 p-0'>
              <div className='main-banner-content'>
                <h1>Stablecoin E-WARI</h1>
                <p>
                E-WARI est un actif numérique fiable adossé au franc CFA - XOF/XAF pour vos transactions. Nous vous offrons les avantages des actifs numériques et de la blockchain associés 
                à la stabilité de l'une des devises les plus échangées en Afrique et surtout dans la zone UEMOA/CEMAC.
                </p>
                <Link
                  href='/auth/authentication'
                  className='default-btn'
                >
                  <a className='default-btn'>
                    <i className='bx bxs-user'></i> Connexion/Inscription
                  </a>
                </Link>
              </div>
            </div>
            <div className='col-xl-4 col-lg-12 col-md-12 p-0'>
              <div className='main-banner-image'>
                <img src='/images/banner/banner-img1.png' alt='image' />
              </div>
            </div>
          </div>
        </div>
        <div className='shape1'>
          <img src='/images/shape/shape1.png' alt='image' />
        </div>
        <div className='shape2'>
          <img src='/images/shape/shape2.png' alt='image' />
        </div>
        <div className='shape3'>
          <img src='/images/shape/shape3.png' alt='image' />
        </div>
        <div className='shape5'>
          <img src='/images/shape/shape5.png' alt='image' />
        </div>
        <div className='shape9'>
          <img src='/images/shape/shape9.png' alt='image' />
        </div>
      </div>
    </>
  );
};

export default Banner;
