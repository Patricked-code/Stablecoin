// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/security/PullPayment.sol";

/**
 * @title EscrowStablecoin
 * @dev Contrat pour gérer les fonds en dépôt de garantie (escrow).
 */
contract EscrowStablecoin {
    enum WithdrawalStatus { NotApproved, Approved, Withdrawn, RequestedRefund, Refunded}

    struct Deposit {
        uint256 amount;
        WithdrawalStatus status;
    }
    address payable public beneficiary;
    address public owner;
    address public token;
    address[] public contributors;

    // Mapping each contributor to their list of deposits
    mapping(address => Deposit[]) public deposits;
    address[] public allUsers;

    mapping(address => uint256) public contributions;
    mapping(address => WithdrawalStatus) public withdrawalStatus; // Updated mapping for withdrawal status
    mapping(address => bool) public refundRequests;
    mapping(address => uint256) public withdrawnAmount;

    // event AsyncTransfer(address indexed contributor, uint256 amount);
    event ApprovalStatusChanged(address indexed contributor, uint256 index, WithdrawalStatus status);
    event AsyncTransfer(address indexed contributor, uint256 amount, uint256 depositIndex);


    constructor(address payable _beneficiary, address _token){
        beneficiary = _beneficiary;
        token = _token;
        owner = msg.sender;

    }

    

        /**
            * Transfère un montant spécifié du contributeur au contrat et enregistre le dépôt poour les commerces directs.
            * Approuve automatiquement le dépôt.
            * @param _contributor L'adresse du contributeur.
            * @param _amount Le montant à transférer.
            * @notice Émet un événement AsyncTransfer à chaque dépôt et ApprovalStatusChanged.
        */
        function asyncTransferShop(address _contributor, uint256 _amount) external {
            require(_amount > 0, "Le montant doit etre superieur a 0");
            IERC20(token).transferFrom(_contributor, address(this), _amount);
            WithdrawalStatus initialStatus = WithdrawalStatus.Approved;

            uint256 depositIndex = deposits[_contributor].length;
            deposits[_contributor].push(Deposit({
                amount: _amount,
                status: initialStatus
            }));

            if (!_contains(contributors, _contributor)) {
                contributors.push(_contributor);
            }

            emit AsyncTransfer(_contributor, _amount, depositIndex);
            emit ApprovalStatusChanged(_contributor, depositIndex, WithdrawalStatus.Approved);
        }


         /**
            * Transfère un montant spécifié du contributeur au contrat et enregistre le dépôt pour les ecommerces.
            * N'approuve pas automatiquement le dépôt.
            * @param _contributor L'adresse du contributeur.
            * @param _amount Le montant à transférer.
            * @notice Émet un événement AsyncTransfer à chaque dépôt.
        */
        function asyncTransferEshop(address _contributor, uint256 _amount) external {
            require(_amount > 0, "Le montant doit etre superieur a 0");
            IERC20(token).transferFrom(_contributor, address(this), _amount);
            WithdrawalStatus initialStatus = WithdrawalStatus.NotApproved;

            uint256 depositIndex = deposits[_contributor].length;
            deposits[_contributor].push(Deposit({
                amount: _amount,
                status: initialStatus
            }));

            if (!_contains(contributors, _contributor)) {
                contributors.push(_contributor);
            }

            emit AsyncTransfer(_contributor, _amount, depositIndex);
        }

        
        /**
            * Approuve le retrait d'un dépôt spécifique par son index pour un contributeur donné.
            * @param _contributor L'adresse du contributeur dont le dépôt est approuvé.
            * @param depositIndex L'indice du dépôt dans la liste des dépôts du contributeur.
            * @notice Émet un événement ApprovalStatusChanged lorsque le dépôt est approuvé.
        */
        function approveWithdrawal(address _contributor, uint256 depositIndex) external {
            // require(owner == _contributor, "Only contributor can approve withdrawals");
            require(depositIndex < deposits[_contributor].length, "Indice de depot invalide");
            deposits[_contributor][depositIndex].status = WithdrawalStatus.Approved;
            emit ApprovalStatusChanged(_contributor, depositIndex, WithdrawalStatus.Approved);
        }

        /**
            * Retire tous les fonds approuvés du contrat vers le bénéficiaire pour les commerces directs.
            * @notice Nécessite que la somme des montants approuvés soit supérieure à zéro.
        */
        function withdrawAllApprovedFundsShop() external {
            // require(msg.sender == beneficiary, "Only beneficiary can withdraw");
            uint256 totalApprovedAmount = 0;
            for (uint i = 0; i < contributors.length; i++) {
                address contributor = contributors[i];
                for (uint j = 0; j < deposits[contributor].length; j++) {
                    if (deposits[contributor][j].status == WithdrawalStatus.Approved) {
                        totalApprovedAmount += deposits[contributor][j].amount;
                        deposits[contributor][j].status = WithdrawalStatus.Withdrawn;
                    }
                }
            }
            require(totalApprovedAmount > 0, "Aucun fonds approuve a retirer");
            IERC20(token).transfer(beneficiary, totalApprovedAmount);
        }


        /**
            * Retire tous les fonds approuvés du contrat vers le bénéficiaire pour les ecommerces.
            * @notice Nécessite que la somme des montants approuvés soit supérieure à zéro.
        */
        function withdrawAllApprovedFundsEshop() external {
            // require(msg.sender == beneficiary, "Only beneficiary can withdraw");
            uint256 totalApprovedAmount = 0;
            for (uint i = 0; i < contributors.length; i++) {
                address contributor = contributors[i];
                for (uint j = 0; j < deposits[contributor].length; j++) {
                    if (deposits[contributor][j].status == WithdrawalStatus.Approved) {
                        totalApprovedAmount += deposits[contributor][j].amount;
                        deposits[contributor][j].status = WithdrawalStatus.Withdrawn;
                    }
                }
            }
            require(totalApprovedAmount > 0, "Aucun fonds approuve a retirer");
            IERC20(token).transfer(beneficiary, totalApprovedAmount);
        }


        /**
            * Révoque l'approbation d'un dépôt spécifique par son index pour un contributeur donné.
            * @param _contributor L'adresse du contributeur dont l'approbation du dépôt est révoquée.
            * @param depositIndex L'indice du dépôt dans la liste des dépôts du contributeur.
            * @notice Émet un événement ApprovalStatusChanged lorsque l'approbation du dépôt est révoquée.
        */
        function revokeApproval(address _contributor, uint256 depositIndex) external {
            // require(owner == msg.sender, "Only owner can revoke approvals");
            require(depositIndex < deposits[_contributor].length, "Indice de depot invalide");
            deposits[_contributor][depositIndex].status = WithdrawalStatus.NotApproved;
            emit ApprovalStatusChanged(_contributor, depositIndex, WithdrawalStatus.NotApproved);
        }

        /**
            * Vérifie si une adresse spécifique est présente dans le tableau des contributeurs.
            * @param array Le tableau des contributeurs à vérifier.
            * @param element L'adresse à rechercher dans le tableau.
            * @return bool Retourne vrai si l'élément est trouvé dans le tableau, faux sinon.
        */
        function _contains(address[] memory array, address element) internal pure returns (bool) {
            for (uint256 i = 0; i < array.length; i++) {
                if (array[i] == element) {
                    return true;
                }
            }
            return false;
        }


        /**
            * Récupère tous les retraits approuvés avec les détails des adresses des contributeurs et les montants correspondants.
            * @return address[] Un tableau contenant les adresses des contributeurs ayant des dépôts approuvés.
            * @return uint256[] Un tableau contenant les montants des dépôts approuvés correspondants aux adresses.
            * @dev Parcourt tous les dépôts de tous les contributeurs pour collecter ceux qui ont été approuvés.
        */
        function getApprovedWithdrawals() external view returns (address[] memory, uint256[] memory) {
            uint256 length = 0;
            // Calculate the number of approved deposits
            for (uint i = 0; i < contributors.length; i++) {
                for (uint j = 0; j < deposits[contributors[i]].length; j++) {
                    if (deposits[contributors[i]][j].status == WithdrawalStatus.Approved) {
                        length++;
                    }
                }
            }

            address[] memory approvedAddresses = new address[](length);
            uint256[] memory approvedAmounts = new uint256[](length);

            uint256 index = 0;
            // Collect all approved deposits
            for (uint i = 0; i < contributors.length; i++) {
                for (uint j = 0; j < deposits[contributors[i]].length; j++) {
                    if (deposits[contributors[i]][j].status == WithdrawalStatus.Approved) {
                        approvedAddresses[index] = contributors[i];
                        approvedAmounts[index] = deposits[contributors[i]][j].amount;
                        index++;
                    }
                }
            }

            return (approvedAddresses, approvedAmounts);
        }

        /**
            * Récupère tous les retraits non approuvés avec les détails des adresses des contributeurs et les montants correspondants.
            * @return address[] Un tableau contenant les adresses des contributeurs ayant des dépôts non approuvés.
            * @return uint256[] Un tableau contenant les montants des dépôts non approuvés correspondants aux adresses.
            * @dev Parcourt tous les dépôts de tous les contributeurs pour collecter ceux qui n'ont pas été approuvés.
        */
        function getNoApprovedWithdrawals() external view returns (address[] memory, uint256[] memory) {
            uint256 length = 0;
            for (uint i = 0; i < contributors.length; i++) {
                for (uint j = 0; j < deposits[contributors[i]].length; j++) {
                    if (deposits[contributors[i]][j].status == WithdrawalStatus.NotApproved) {
                        length++;
                    }
                }
            }

            address[] memory noApprovedAddresses = new address[](length);
            uint256[] memory noApprovedAmounts = new uint256[](length);

            uint256 index = 0;
            for (uint i = 0; i < contributors.length; i++) {
                for (uint j = 0; j < deposits[contributors[i]].length; j++) {
                    if (deposits[contributors[i]][j].status == WithdrawalStatus.NotApproved) {
                        noApprovedAddresses[index] = contributors[i];
                        noApprovedAmounts[index] = deposits[contributors[i]][j].amount;
                        index++;
                    }
                }
            }

            return (noApprovedAddresses, noApprovedAmounts);
        }

        /**
            * Calcule le montant total des dépôts qui ont été approuvés.
            * @return uint256 Le montant total des dépôts approuvés.
            * @dev Additionne les montants de tous les dépôts approuvés pour tous les contributeurs.
        */
        function getTotalApprovedAmount() external view returns (uint256) {
            uint256 totalApprovedAmount = 0;
            for (uint i = 0; i < contributors.length; i++) {
                for (uint j = 0; j < deposits[contributors[i]].length; j++) {
                    if (deposits[contributors[i]][j].status == WithdrawalStatus.Approved) {
                        totalApprovedAmount += deposits[contributors[i]][j].amount;
                    }
                }
            }
            return totalApprovedAmount;
        }

        /**
            * Calcule le montant total des dépôts qui n'ont pas été approuvés.
            * @return uint256 Le montant total des dépôts non approuvés.
            * @dev Additionne les montants de tous les dépôts non approuvés pour tous les contributeurs.
        */
        function getTotalNoApprovedAmount() external view returns (uint256) {
            uint256 totalNoApprovedAmount = 0;
            for (uint i = 0; i < contributors.length; i++) {
                for (uint j = 0; j < deposits[contributors[i]].length; j++) {
                    if (deposits[contributors[i]][j].status == WithdrawalStatus.NotApproved) {
                        totalNoApprovedAmount += deposits[contributors[i]][j].amount;
                    }
                }
            }
            return totalNoApprovedAmount;
        }



        /*
            * Demande un remboursement pour un dépôt spécifié par son index pour un contributeur donné.
            * @param _contributor L'adresse du contributeur qui demande un remboursement.
            * @param depositIndex L'indice du dépôt pour lequel le remboursement est demandé.
            * @notice Met à jour le statut du dépôt à RequestedRefund et enregistre la demande dans refundRequests.
        */
        function requestRefund(address _contributor, uint256 depositIndex) external {
            require(depositIndex < deposits[_contributor].length, "Index de depet invalide");
            Deposit storage deposit = deposits[_contributor][depositIndex];
            require(deposit.amount > 0, "Aucune contribution trouvee pour ce depot.");
            require(deposit.status == WithdrawalStatus.NotApproved, "Le depot a deja ete approuve ou retire.");
            deposit.status = WithdrawalStatus.RequestedRefund; // Vous devez ajouter ce statut dans votre enum
            refundRequests[_contributor] = true; // Assurez-vous que cette ligne est présente.
        }


        /**
            * Exécute un remboursement pour un dépôt spécifié par son index après une demande de remboursement.
            * @param _contributor L'adresse du contributeur à rembourser.
            * @param depositIndex L'indice du dépôt à rembourser.
            * @notice Réinitialise le montant du dépôt après le remboursement et met à jour le statut à Refunded.
        */
        function refund(address _contributor, uint256 depositIndex) external {
            // require(owner == msg.sender, "Seul le proprietaire peut approuver les remboursements.");
            require(depositIndex < deposits[_contributor].length, "Index de depot invalide");
            Deposit storage deposit = deposits[_contributor][depositIndex];
            require(deposit.status == WithdrawalStatus.RequestedRefund, "Aucune demande de remboursement en attente pour ce depot.");

            uint256 refundAmount = deposit.amount;
            deposit.amount = 0; // Reset the deposit amount after refund
            deposit.status = WithdrawalStatus.Refunded; // Update the status to refunded
            IERC20(token).transfer(_contributor, refundAmount);
            emit ApprovalStatusChanged(_contributor, depositIndex, WithdrawalStatus.Refunded);
        }


        /**
            * Révoque une demande de remboursement pour un dépôt spécifié par son index.
            * @param _contributor L'adresse du contributeur dont la demande de remboursement est révoquée.
            * @param depositIndex L'indice du dépôt dont la demande de remboursement est révoquée.
            * @notice Met à jour le statut du dépôt à NotApproved si une demande de remboursement est active.
        */
        function revokeRefundRequest(address _contributor, uint256 depositIndex) external {
            // require(owner == msg.sender, "Seul le proprietaire peut revoquer les demandes de remboursement.");
            require(depositIndex < deposits[_contributor].length, "Index de depot invalide");
            Deposit storage deposit = deposits[_contributor][depositIndex];
            require(deposit.status == WithdrawalStatus.RequestedRefund, "Aucune demande de remboursement active a revoquer.");
            // deposit.status = WithdrawalStatus.NotApproved;
            deposit.status = WithdrawalStatus.Approved;
        }

        /**
            * Récupère toutes les demandes de remboursement en attente avec leurs détails.
            * @return address[] Un tableau des adresses des demandeurs.
            * @return uint256[] Un tableau des indices des dépôts demandés pour remboursement.
            * @return uint256[] Un tableau des montants des dépôts demandés pour remboursement.
        */
        function getPendingRefundRequests() external view returns (address[] memory, uint256[] memory, uint256[] memory) {
            uint256 totalRequests = 0;
            for (uint i = 0; i < contributors.length; i++) {
                Deposit[] memory userDeposits = deposits[contributors[i]];
                for (uint j = 0; j < userDeposits.length; j++) {
                    if (userDeposits[j].status == WithdrawalStatus.RequestedRefund) {
                        totalRequests++;
                    }
                }
            }

            address[] memory requesterAddresses = new address[](totalRequests);
            uint256[] memory requestDepositIndexes = new uint256[](totalRequests);
            uint256[] memory requestAmounts = new uint256[](totalRequests);

            uint256 index = 0;
            for (uint i = 0; i < contributors.length; i++) {
                Deposit[] memory userDeposits = deposits[contributors[i]];
                for (uint j = 0; j < userDeposits.length; j++) {
                    if (userDeposits[j].status == WithdrawalStatus.RequestedRefund) {
                        requesterAddresses[index] = contributors[i];
                        requestDepositIndexes[index] = j;
                        requestAmounts[index] = userDeposits[j].amount;
                        index++;
                    }
                }
            }

            return (requesterAddresses, requestDepositIndexes, requestAmounts);
        }

    }
