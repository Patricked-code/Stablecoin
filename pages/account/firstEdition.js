import Link from 'next/link';
import FirstEdition from '../../components/Authentication/FirstEdition';

const First = () => {
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
              <div className='row py-30'>
                <FirstEdition/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default First;
