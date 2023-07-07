import Link from 'next/link';
import FirstEdition from '../../components/Authentication/FirstEdition';

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
