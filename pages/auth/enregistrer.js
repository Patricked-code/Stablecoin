import Link from 'next/link';
import RegisterForm from '../../components/Authentication/RegisterForm';

const Register = () => {
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
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
