import Link from 'next/link';
import RegisterForm from '../../components/Authentication/RegisterForm';

/**
 * Composant React représentant la page d'authentification.
 * @function
 * @component
 * @name Authentication
 * @returns {JSX.Element} Composant de la page d'authentification.
 */
const Authentication = () => {
  return (
    <>
      <div 
      className='profile-authentication-area'
      style={{ 
        backgroundImage: `url(/images/ecfa/background/bg4.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}

      >
        <div className='d-table'>
          <div className='d-table-cell'>
            <div className='container'>
              <div className='row'>
                {/* <LoginForm /> */}
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
