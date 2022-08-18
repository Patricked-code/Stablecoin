import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <footer className='footer-area'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-4 col-sm-6 col-md-6'>
              <div className='single-footer-widget'>
                <a href='index.html' className='d-inline-block logo'>
                <img src='/images/ecfa/logo/logo_ewari1.jpg' width={'80'} alt='logo' />
                </a>
                <div className='newsletter-form'>
                  <p>INSCRIVEZ VOUS A LA NEWSLETTER</p>
                  <form data-toggle='validator'>
                    <input
                      type='email'
                      className='input-newsletter'
                      placeholder='votre email'
                      name='EMAIL'
                      required
                      autoComplete='off'
                    />
                    <button type='submit'>
                      Inscrire <i className='bx bx-paper-plane'></i>
                    </button>
                    <div id='validator-newsletter' className='form-result'></div>
                  </form>
                </div>
                <ul className='social-links'>
                  <li>
                    <a href='#' target='_blank' className='facebook'>
                      <i className='bx bxl-facebook'></i>
                    </a>
                  </li>
                  <li>
                    <a href='#' target='_blank' className='twitter'>
                      <i className='bx bxl-twitter'></i>
                    </a>
                  </li>
                  <li>
                    <a href='#' target='_blank' className='linkedin'>
                      <i className='bx bxl-linkedin'></i>
                    </a>
                  </li>
                  <li>
                    <a href='#' target='_blank' className='instagram'>
                      <i className='bx bxl-instagram'></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-2 col-sm-6 col-md-6'>
              {/* <div className='single-footer-widget'>
                <h3>Cryptocurrency</h3>
                <ul className='services-links'>
                  <li>
                    <Link href='/buy'>Buy Bitcoin</Link>
                  </li>
                  <li>
                    <Link href='/buy'>Buy BNB</Link>
                  </li>
                  <li>
                    <Link href='/buy'>Buy Ethereum</Link>
                  </li>
                  <li>
                    <Link href='/buy'>Buy Ripple</Link>
                  </li>
                  <li>
                    <Link href='/buy'>Buy Litecoin</Link>
                  </li>
                </ul>
              </div> */}
            </div>
            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-footer-widget pl-5'>
                <h3>Resources</h3>
                <ul className='quick-links'>
                  <li>
                    <Link href='/'>Accueil</Link>
                  </li>
                  <li>
                    <Link href='/casUtilisation'>Cas d'utilisation</Link>
                  </li>
                  <li>
                    <Link href='/pourquoi_ewari/'>Pourquoi E-WARI</Link>
                  </li>
                  <li>
                    <Link href='/#'>Actualité</Link>
                  </li>
                  <li>
                    <Link href='/#'>Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-footer-widget'>
                <h3>Info Contact </h3>
                <ul className='footer-contact-info'>
                  <li>Adresse: Abidjan, Cocody Café de versailles</li>
                  <li>
                    Email: <a href='mailto:hello@Novis.com'>contact@wealthtechinnovations.com</a>
                  </li>
                  <li>
                    Phone: <a href='tel:+2252521006121'>25 21 00 61 21</a>
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='copyright-area'>
          <div className='container'>
            <p>
              Copyright 2022 <strong>E-WARI</strong>. All Rights Reserved 
              
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
