import { useState, useEffect } from 'react';
import axios from 'axios';




const CasUsage = ({pt70}) => {

const [userData, setUserData] = useState()

const [userDataSession, setUserDataSession] = useState()


// La requete get()
useEffect(async() => {
const token = localStorage.getItem('tokenEnCours')
console.log("token",token)

    const getAllUsers = async () => {
      const res = await fetch('http://localhost:3080/api/user', {
        headers: {
          
          'Content-Type': 'application/json',
          Authorization:  token,
        },
      });
    };
    
    getAllUsers();
  }, []);

  // Obtenir mes infos
  useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    console.log("token me",token)
    
        const getMeSession = async () => {
          const res = await fetch('http://localhost:3080/api/user/session', {
            headers: {
              'Content-Type': 'application/json',
              Authorization:  token,
            },
          })
            .then((res) => res.json())
            .then((userDataSession) => {
              setUserDataSession(userDataSession)
            }) 

          

        };
        
        getMeSession();
  }, []);

  console.log(userDataSession)

      
  
// console.log('id', userData)

// RECCUPERER LES INFORMATIONS
// RECCUPERER LES INFORMATIONS
// useEffect(async() => {
    // getter
    // const token = localStorage.getItem('tokenEnCours')
    // if (token){
    //   let users_id = ""
    //   let getOneUser = async () => {
    //     try {
    //       const resp = await axios.get(
    //         "http://localhost:3080/api/user/id",
    //         {
    //           headers: {
    //             'Authorization':`Bearer ${token}`
    //           },
    //         }
    //       )
    //       return {
    //         error: false,
    //         resp: resp.data,
    //       }
    //     } catch (err) {
    //       // Handle Error Here
    //       console.error(err)
    //       return {
    //         error: true,
    //         resp: {},
    //       }
    //     }
    //   }
    // }
// }, []);



















  return (
    <>
    <br/><br/>
      <div className={`buy-sell-cryptocurrency-area bg-image ${pt70}`} >
        <div className='container'>
          <div className='section-title'>
            <h2>Infos user</h2>
      
          </div>
          <div className='row justify-content-center'>
            <div className='col-xl-6 col-lg-12 col-md-12'>
              <div className='buy-sell-cryptocurrency-image'>
                

              </div>
            </div>
            <div className='banner-area'>
            <div className='cryptocurrency-search-box '>
                <div className='row'>
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection '>
                            <div className="mx-2">
                                <div className='my-3'>
                                    {/* Afficher les informations d'un seul utilisateur */}
                                    
                                    <p className='mt-3'><b>Nom :</b>{userDataSession?.nom}</p>
                                        <p><b>Prénom :</b> {userDataSession?.prenom}</p>
                                        <p><b>Numero :</b>{userDataSession?.contact} </p>
                                        <p><b>pays :</b> {userDataSession?.pays}</p>
                                        <p className='mb-5'><b>Email :</b> {userDataSession?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CasUsage;
