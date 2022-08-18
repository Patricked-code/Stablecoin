import Link from 'next/link';
import FirstEdition from '../../components/Authentication/FirstEdition';
import TwoEdition from '../../components/profil/Account/TwoEdition';

const TwoEdit = () => {
  return (
    <>
      <div className='profile-authentication-area'>
        <div className='d-table'>
          <div className='d-table-cell'>
            <div className='container'>
              <div className='row'>
                <TwoEdition/>
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

export default TwoEdit;
