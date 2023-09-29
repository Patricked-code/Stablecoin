import Link from 'next/link';
import ResetPassword from '../../components/Authentication/ResetPassword';

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
                <ResetPassword/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
