import { useState, useEffect } from "react";
import { ethers } from "ethers";


export default function CardDemarches() {
 

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
       
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              DEMARCHES ADMINISTRATIVES
            </h1>

            
          </div>
        </div>

        <div className="row">
            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <h4 className="text-xl font-semibold text-gray-700 text-center">
   
                            En cours
                        </h4>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <h4 className="text-xl font-semibold text-gray-700 text-center">
                            En cours
                        </h4>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <h4 className="text-xl font-semibold text-gray-700 text-center">
   
                            En cours
                        </h4>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <h4 className="text-xl font-semibold text-gray-700 text-center">
                            En cours
                        </h4>
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
