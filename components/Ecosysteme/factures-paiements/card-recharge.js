import { useState, useEffect } from "react";
import { ethers } from "ethers";


export default function CardRecharge() {
 

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
       
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              RECHARGEMENT
            </h1>

            
          </div>
        </div>

        <div className="row">
            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                            <form >
                                <div className="">
                                    <h6 className="text-xl font-semibold text-gray-700 text-center">
                                        ORANGE
                                    </h6>
                                </div>
                                <div className="row ml-3 ">   
                                    <div className="col-lg-6 col-md-6 text-center my-3">
                                        <div className="input-group ">
                                            <input type="number" value="" placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 group-form  my-3 ">
                                        <button type="submit"  className="btn btn-success ">Recharger</button>
                                    </div>
                                </div>
                            </form>

                            

                            
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <form >
                            <div className="">
                                <h6 className="text-xl font-semibold text-gray-700 text-center">
                                    MTN
                                </h6>
                            </div>
                            <div className="row ml-3 ">   
                                <div className="col-lg-6 col-md-6 text-center my-3">
                                    <div className="input-group ">
                                        <input type="number" value="" placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 group-form  my-3 ">
                                    <button type="submit"  className="btn btn-success ">Recharger</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <form >
                            <div className="">
                                <h6 className="text-xl font-semibold text-gray-700 text-center">
                                    MOOV
                                 </h6>
                            </div>
                            <div className="row ml-3 ">   
                                <div className="col-lg-6 col-md-6 text-center my-3">
                                    <div className="input-group ">
                                        <input type="number" value="" placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6   my-3 ">
                                    <button type="submit"  className="btn btn-success ">recharger</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

           
        </div>
        
      </div>
      <div>

      </div>
    </div>
  );
}
