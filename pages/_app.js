
import { Provider } from 'react-redux';
import { useStore } from '../store';


import '../public/css/animate.min.css';
import '../public/css/bootstrap.min.css';


import '../public/css/boxicons.min.css';


import '../public/css/fontawesome.min.css';
import '../public/css/meanmenu.min.css';
import '../public/css/style.css';
import '../public/css/responsive.css';

import Layout from '../components/Layout/Layout';
import GoTop from '../components/Shared/GoTop';

// import '../style.css';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css'


function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <title>E-WARI</title>
      </Head>
      {/* <Component {...pageProps} /> */}

      <Provider store={store}>
      <Layout>
        <Component {...pageProps} />

        {/* Go Top Button */}
        <GoTop/>
      </Layout>
    </Provider>
    </>
  );
}

export default MyApp;
