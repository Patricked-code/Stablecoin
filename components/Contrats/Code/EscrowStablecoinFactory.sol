// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EscrowStablecoin.sol";

/**
 * @title EscrowStablecoinFactory
 * @dev Contrat usine pour la création de contrats EscrowStablecoin.
 */
contract EscrowStablecoinFactory {
    address public owner;
    
    constructor(){
        owner = msg.sender;
    }
    // Événement émis lors de la création d'un nouveau contrat EscrowStablecoin
    event EscrowStablecoinCreated(address indexed escrowContract, address indexed beneficiary, address indexed token);

    // Structure pour stocker les informations sur chaque contrat EscrowStablecoin
    struct EscrowInfo {
        address escrowContract;
        address beneficiary;
    }

    // Tableau pour stocker des informations sur tous les contrats EscrowStablecoin créés
    EscrowInfo[] public allEscrowContracts;

    /**
     * @dev Crée un nouveau contrat EscrowStablecoin.
     * @param _beneficiary L'adresse du bénéficiaire qui recevra les fonds.
     * @param _token L'adresse du jeton ERC20 utilisé pour l'escrow.
     * @return escrowContractAddress L'adresse du nouveau contrat EscrowStablecoin créé.
     */
    function createEscrowStablecoin(address payable _beneficiary, address _token) external returns (address) {
        EscrowStablecoin newEscrow = new EscrowStablecoin(_beneficiary, _token);
        address escrowContractAddress = address(newEscrow);

        // Stocke des informations sur le nouveau contrat EscrowStablecoin créé
        allEscrowContracts.push(EscrowInfo({
            escrowContract: escrowContractAddress,
            beneficiary: _beneficiary
        }));

        // Émet un événement indiquant la création d'un nouveau contrat EscrowStablecoin
        emit EscrowStablecoinCreated(escrowContractAddress, _beneficiary, _token);
        return escrowContractAddress;
    }

    /**
     * @dev Récupère des informations sur tous les contrats EscrowStablecoin.
     * @return Un tableau de structures EscrowInfo contenant des informations sur chaque contrat EscrowStablecoin.
     */
    function getEscrowContracts() external view returns (EscrowInfo[] memory) {
        return allEscrowContracts;
    }

    /**
     * @dev Récupère le bénéficiaire d'un contrat EscrowStablecoin spécifique.
     * @param escrowContract L'adresse du contrat EscrowStablecoin.
     * @return L'adresse du bénéficiaire associé au contrat EscrowStablecoin.
     */
    function getBeneficiary(address escrowContract) external view returns (address) {
        // Recherche du contrat EscrowStablecoin spécifié et renvoi de son bénéficiaire
        for (uint256 i = 0; i < allEscrowContracts.length; i++) {
            if (allEscrowContracts[i].escrowContract == escrowContract) {
                return allEscrowContracts[i].beneficiary;
            }
        }
        // Si le contrat EscrowStablecoin n'est pas trouvé, renvoie une erreur avec un message approprié
        revert("Contrat Escrow non trouve");
    }

    /**
    * @dev Récupère l'adresse du contrat EscrowStablecoin associé à un bénéficiaire spécifique.
    * @param _beneficiary L'adresse du bénéficiaire.
    * @return L'adresse du contrat EscrowStablecoin associé au bénéficiaire.
    */
    function getEscrowContractByBeneficiary(address _beneficiary) external view returns (address) {
        for (uint256 i = 0; i < allEscrowContracts.length; i++) {
            if (allEscrowContracts[i].beneficiary == _beneficiary) {
                return allEscrowContracts[i].escrowContract;
            }
        }
        revert("Aucun contrat Escrow trouve pour ce beneficiaire");
    }

}
