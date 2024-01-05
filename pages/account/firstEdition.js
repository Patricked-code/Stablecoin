import Link from 'next/link';
import FirstEdition from '../../components/Authentication/FirstEdition';

/**
 * Composant React représentant la page de première édition.
 * Cette page est destinée à contenir le composant FirstEdition,
 * qui semble être lié à l'authentification ou à l'enregistrement.
 * @function
 * @component
 * @name FirstEdition
 * @returns {JSX.Element} Composant de la page de première édition.
 */
const First = () => {
  return (
    <>
      <br/>
      <div 
        className='mb-10 row'
        style={{ 
          backgroundImage: `url(/images/ecfa/background/bg4.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
        
      >
        <FirstEdition/>
      </div>
      <br/>

    </>
  );
};

export default First;
