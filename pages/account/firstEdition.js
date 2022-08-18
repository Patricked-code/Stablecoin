import Link from 'next/link';
import FirstEdition from '../../components/Authentication/FirstEdition';

const First = () => {
  return (
    <>
      <div className='profile-authentication-area'>
        <div className='d-table'>
          <div className='d-table-cell'>
            <div className='container'>
              <div className='row'>
                <FirstEdition/>
              </div>
            </div>
          </div>
        </div>
        <Link href='/'>
          <a className='back-icon'>
            <i className='bx bx-x'></i>
          </a>
        </Link>
      </div>
    </>
  );
};

export default First;
