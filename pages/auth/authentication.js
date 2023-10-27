import Link from 'next/link';
import RegisterForm from '../../components/Authentication/RegisterForm';

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
      // style={{ backgroundImage: `url(/images/ecfa/logo/logo_ewari3.jpg)` }}

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
