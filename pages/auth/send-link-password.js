import Link from 'next/link';
import CLinkResetPassword from '../../components/Authentication/LinkResetPassword';

/**
 * Composant React représentant la page send-link-password.
 * Cette page est destinée à contenir le composant CLinkResetPassword,
 * qui est utilisé pour envoyer un lien de réinitialisation de mot de passe.
 * @function
 * @component
 * @name send-link-password
 * @returns {JSX.Element} Composant de la page d'index.
 */
const index = () => {
  return (
    <>
      <div 
      className='profile-authentication-area '
      style={{ 
        backgroundImage: `url(/images/ecfa/background/bg4.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
      >
        <div className='d-table '>
          <div className='d-table-cell '>
            <div className='container '>
              <div className='row bg-green'>
                <CLinkResetPassword/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
