// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";


// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */

// Le smart contrat de ERC20 qui contient tous les standard de la norme ERC20 et qui hérite des contrats tels Context, IERC20, IERC20Metadata,Pausable, AccessControl,Escrow,PullPayment 
contract ERC20 is Context, IERC20, IERC20Metadata,Pausable,AccessControl{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ASYNC_ROLE = keccak256("ASYNC_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant TRANSFERFROM_ROLE = keccak256("TRANSFERFROMER_ROLE");

   

    event ActionPendantAbonnement(address indexed utilisateur, uint256 montant); //Evenement timelock

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private totalsupplyPriv;

    string private namePriv;
    string private symbolPriv;

     address public relayer;  // Adresse du relayer

    // Partie abonnement
    bytes32 public constant SUBSCRIBER_ROLE = keccak256("SUBSCRIBER_ROLE");
    mapping(address => uint256) public subscriptionExpiry;

    event SubscriptionPurchased(address indexed user, uint256 subscriptionCost, uint256 expiryDate);
    // Fin abonnement


    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    // Constructeur qui s'excute une seule fois lors de l'instanciation du contrat 
    // il prend en paramètre le nom, le symbol et le totalSupply
    constructor(string memory name_, string memory symbol_,uint256 totalSupply_, address relayer_) {
        // string memory name_, string memory symbol_,uint256 totalSupply_
        namePriv = name_;
        symbolPriv = symbol_;
        totalsupplyPriv = totalSupply_;

        _balances[msg.sender] = totalsupplyPriv;
        emit Transfer(address(0), msg.sender, totalsupplyPriv);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(TRANSFER_ROLE, msg.sender);
        _grantRole(TRANSFERFROM_ROLE, msg.sender);

        relayer = relayer_;  // Initialise l'adresse du relayer



    }

    // *****************Relayer***********************************************
    modifier onlyRelayer() {
        require(msg.sender == relayer, "Non autorisees");
        _;
    }

    /**
        * Définit le nouveau relayer pour le contrat.
        * @param _newRelayer L'adresse du nouveau relayer.
        * @dev Seul le relayer actuel peut appeler cette fonction pour changer le relayer.
    */
    function setRelayer(address _newRelayer) public onlyRelayer {
        relayer = _newRelayer;
    }


    /**
        * Transfère des tokens en utilisant la signature du relayer pour autoriser la transaction.
        * @param _from L'adresse du détenteur des tokens.
        * @param _to L'adresse du destinataire.
        * @param _value Le montant des tokens à transférer.
        * @dev Cette fonction permet de réaliser des transferts de tokens en utilisant la signature du relayer.
    */
    function metaTransfer(address _from, address _to, uint256 _value) public  {
        // Votre logique de transfert ici
        _transfer(_from, _to, _value);
    }



    // **************************Fin Relayer************************************************
    
    // ***************Fonction d'abonnement*******************************

    // Modificateur pour restreindre l'accès à certaines fonctions. 
    modifier onlyActiveSubscriber() {
        require(hasRole(SUBSCRIBER_ROLE, msg.sender), "Vous n'avez pas d'abonnement en cours");
        require(subscriptionExpiry[msg.sender] >= block.timestamp, "Votre abonnement est expire");
        _;
    }

    /*
        * Permet à un abonné de s'inscrire ou de renouveler son abonnement.
        * @param _addressSubscriber L'adresse de l'abonné.
        * @param _addressCommission L'adresse recevant la commission de l'abonnement.
        * @param _subscriptionCost Le coût de l'abonnement.
        * @param _subscriptionDays La durée de l'abonnement en jours.
        * @dev Transfère le coût de l'abonnement à l'adresse de commission et met à jour l'expiration de l'abonnement de l'utilisateur.
    */
    function subscribe(
        address _addressSubscriber,
        address _addressCommission,
        uint256 _subscriptionCost,
        uint256 _subscriptionDays
    ) external {
        require(balanceOf(_addressSubscriber) >= _subscriptionCost, "Votre solde est insuffisant");

        _transfer(_addressSubscriber, _addressCommission, _subscriptionCost);

        uint256 newExpiry;
        // vérifie si l'abonnement est déjà expiré.
        if (subscriptionExpiry[_addressSubscriber] < block.timestamp) {
            newExpiry = block.timestamp; //La nouvelle date d'expiration sera le temps actuel
        } else {
            newExpiry = subscriptionExpiry[_addressSubscriber]; //La nouvelle date d'expiration sera la date d'expiration existante.
        }

        newExpiry += _subscriptionDays * 1 days;

        subscriptionExpiry[_addressSubscriber] = newExpiry;
        grantRole(SUBSCRIBER_ROLE, _addressSubscriber);

        emit SubscriptionPurchased(_addressSubscriber, _subscriptionCost, newExpiry);
    }


    /**
        * Récupère la date d'expiration de l'abonnement pour un abonné donné.
        * @param _addressSubscriber L'adresse de l'abonné.
        * @return uint256 La date d'expiration de l'abonnement de l'abonné en timestamp.
    */
    function getSubscriptionExpiry(address _addressSubscriber) external view returns (uint256) {
        return subscriptionExpiry[_addressSubscriber];
    }


    /**
        * Récupère le nombre de jours restants avant l'expiration de l'abonnement pour un abonné donné.
        * @param _addressSubscriber L'adresse de l'abonné.
        * @return uint256 Le nombre de jours restants avant l'expiration de l'abonnement.
    */
    function getRemainingDays(address _addressSubscriber) external view returns (uint256) {
        if (block.timestamp >= subscriptionExpiry[_addressSubscriber]) {
            return 0;
        }
        return (subscriptionExpiry[_addressSubscriber] - block.timestamp) / 1 days;
    }


   

    // Fin fonction abonnement

    // TransfertBatch.onlyRole(TRANSFER_ROLE) 
    // function transferBatch(address[] memory recipients, uint256[] memory amounts) public {
    //     require(recipients.length == amounts.length, "Arrays must have the same length");

    //     for (uint i = 0; i < recipients.length; i++) {
    //         _transfer(msg.sender, recipients[i], amounts[i]);
    //     }
    // }


    /**
        * Transfère en batch des tokens à plusieurs destinataires.
        * @param from L'adresse de l'expéditeur.
        * @param recipients Tableau contenant les adresses des destinataires.
        * @param amounts Tableau contenant les montants correspondants à transférer à chaque destinataire.
        * @dev Effectue un transfert de tokens de l'adresse 'from' à chaque adresse dans 'recipients' avec les montants spécifiés dans 'amounts'.
    */
    function transferBatch(address from, address[] memory recipients, uint256[] memory amounts) public {
        require(recipients.length == amounts.length, "Les tableaux doivent avoir la meme longueur");

        for (uint256 i = 0; i < recipients.length; i++) {
            // Appel de la fonction _transfer existante pour effectuer le transfert
            _transfer(from, recipients[i], amounts[i]);
        }   
    }

    /**
        * Effectue un transfert en lot de tokens depuis une adresse source vers plusieurs destinataires.
        * @param from L'adresse de l'expéditeur des tokens.
        * @param recipients Tableau contenant les adresses des destinataires.
        * @param amounts Tableau contenant les montants de tokens correspondants à envoyer à chaque destinataire.
        * @dev Cette fonction exige que les tableaux de destinataires et de montants aient la même longueur.
        * Chaque élément du tableau 'amounts' correspond au montant de tokens à transférer à l'adresse correspondante
        * dans le tableau 'recipients'. La fonction appelle '_transfer' pour chaque destinataire.
        * 
        * Exigences:
        * - `from` ne peut pas être l'adresse zéro.
        * - Les tableaux 'recipients' et 'amounts' doivent avoir la même longueur pour éviter les erreurs d'exécution.
        * - L'adresse 'from' doit avoir un solde suffisant pour couvrir la somme totale des transferts.
    */
    function transferBatchwithdrawal(address from, address[] memory recipients, uint256[] memory amounts) public {
        require(recipients.length == amounts.length, "Les tableaux doivent avoir la meme longueur");

        for (uint256 i = 0; i < recipients.length; i++) {
            // Appel de la fonction _transfer existante pour effectuer le transfert
            _transfer(from, recipients[i], amounts[i]);
        }   
    }

    /**
    * Transfère en batch des tokens à plusieurs destinataires avec création de tokens supplémentaires.
    * Exemple d'execution avec les tableaux
    * ["0xAdresse1", "0xAdresse2"], [montant1, montant2]
    * @param _recipients Tableau des adresses des destinataires.
    * @param _amounts Tableau des montants de tokens à transférer à chaque destinataire.
    * @param _amountMint Montant des tokens à créer (mint) avant les transferts.
    * @dev Mint des tokens pour l'expéditeur avant de transférer des montants spécifiés à chaque destinataire.
    */
    function transferBatchWithMint(address[] memory _recipients, uint256[] memory _amounts, uint256 _amountMint) public {
        // Vérifie que les tableaux ont la même longueur
        require(_recipients.length == _amounts.length, "Les tableaux doivent avoir la meme longueur");

        // Vérifie que l'adresse de l'expéditeur n'est pas zéro
        require(msg.sender != address(0), "Adresse de l'expediteur ne peut pas etre zero");

        // Effectue le mint une seule fois avant la boucle
        _mint(msg.sender, _amountMint);

        // Maintenant, effectue le transfert pour chaque destinataire
        for (uint i = 0; i < _recipients.length; i++) {
            // Logique supplémentaire avant le transfert, si nécessaire

            // Appelle la fonction _transfer avec l'expéditeur spécifié
            _transfer(msg.sender, _recipients[i], _amounts[i]);

            // Logique supplémentaire après le transfert, si nécessaire
        }
    }


    /**
    * Transfère en batch des tokens à plusieurs destinataires avec destruction de tokens.
    * @param _addressBurn L'adresse d'où les tokens seront brûlés.
    * @param _recipients Tableau des adresses des destinataires.
    * @param _amounts Tableau des montants de tokens à transférer à chaque destinataire.
    * @param _amountBurn Montant des tokens à détruire (burn) avant les transferts.
    * @dev Burn des tokens de l'adresse spécifiée avant de transférer des montants spécifiés à chaque destinataire.
    */
    function transferBatchWithBurn(address _addressBurn, address[] memory _recipients, uint256[] memory _amounts, uint256 _amountBurn) public {
        // Vérifie que les tableaux ont la même longueur
        require(_recipients.length == _amounts.length, "Les tableaux doivent avoir la meme longueur");

        // Vérifie que l'adresse de l'expéditeur n'est pas zéro
        // require(sender != address(0), "Adresse de l'expediteur ne peut pas etre zero");

        // Vérifie que l'adresse de l'expéditeur n'est pas zéro
        require(_addressBurn != address(0), "Adresse de mint ne peut pas etre zero");

        // Effectue le burn une seule fois avant la boucle
        _burn(_addressBurn, _amountBurn);

        // Maintenant, effectue le transfert pour chaque destinataire
        for (uint i = 0; i < _recipients.length; i++) {

            // Appelle la fonction _transfer avec l'expéditeur spécifié
            _transfer(_addressBurn, _recipients[i], _amounts[i]);
        }
    }


    // Fin TransfertBatch

    

    /**
     * @dev Renvoie le nom du jeton.
     */
    function name() public view virtual override returns (string memory) {
        return namePriv;
    }

    /**
     * @dev Renvoie le symbole du jeton, généralement une version plus courte du
     * Nom.
     */
    function symbol() public view virtual override returns (string memory) {
        return symbolPriv;
    }

    /**
     * @dev Renvoie le nombre de décimales utilisées pour obtenir sa représentation utilisateur.
     * Par exemple, si `decimals` est égal à `2`, un solde de `505` jetons devrait
     * être affiché pour un utilisateur sous la forme `5.05` (`505 / 10 ** 2`).
     *
     * Les jetons optent généralement pour une valeur de 18, imitant la relation entre
     * Éther et Wei. C'est la valeur que {ERC20} utilise, sauf si cette fonction est
     * remplacé ;
     *
     * NOTE: Ces informations ne sont utilisées qu'à des fins d'_affichage_ : dont
     * n'affecte en rien l'arithmétique du contrat, y compris
     * {IERC20-balanceOf} et {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 10;
    }

    /**
     * @dev Voir {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return totalsupplyPriv;
    }

    /**
     * @dev Voir {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev Voir {IERC20-transfert}.
     *
     * Exigences:
     *
     * - `to` ne peut pas être l'adresse zéro.
     * - l'appelant doit avoir un solde d'au moins `amount`.
     *
     *  Permet à un compte possédant des tokens d’en envoyer à un autre compte
     *  Paramètre : Fonction transfer qui prend l’adresse du compte qui reçoit les tokens et le montant. onlyRole(TRANSFER_ROLE)
     */
    function transfer(address to, uint256 amount) public virtual override whenNotPaused  returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * Renvoie le nombre de tokens qu’une adresse est autorisée à retirer du contrat de token
     * Paramètre : Adresse du propriétaire du contrat et adresse du depenseur
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev Voir {IERC20-approve}.
     *
     * REMARQUE : Si `amount` est le maximum `uint256`, l'allocation n'est pas mise à jour le
     * `transfertDe`. Ceci est sémantiquement équivalent à une approbation infinie.
     *
     * Exigences:
     *
     * - `spender` ne peut pas être l'adresse zéro.
     *
     * Une fonction permettant au détenteur d’un contrat de token d’approuver un retrait pour un montant déterminé par un compte précis 
     * Paramètre : adresse du depenseur et le montant
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    function approveFrom(address owner, address spender, uint256 amount) public virtual returns (bool) {
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev Voir {IERC20-transferFrom}.
     *
     * Émet un événement {Approbation} indiquant l'allocation mise à jour. Ce n'est pas
     * requis par l'EIP. Voir la note au début de {ERC20}.
     *
     * REMARQUE : ne met pas à jour l'allocation si l'allocation actuelle
     * est le `uint256` maximal.
     *
     * Exigences:
     *
     * - `from` et `to` ne peuvent pas être l'adresse zéro.
     * - `from` doit avoir un solde d'au moins `amount`.
     * - l'appelant doit avoir une allocation pour les jetons ``from`` d'au moins
     * "montant".
     *
     * Permet de transférer des tokens d’une adresse à une autre, sans que l’adresse qui envoie la transaction soit celle qui détient les tokens
     * Paramètre : adresse qui envoie, adresse qui reçoit et le montant. onlyRole(TRANSFERFROM_ROLE)
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Augmente atomiquement l'allocation accordée au « dépensier » par l'appelant.
     *
     * Il s'agit d'une alternative à {approuver} qui peut être utilisée comme atténuation pour
     * problèmes décrits dans {IERC20-approve}.
     *
     * Émet un événement {Approbation} indiquant l'allocation mise à jour.
     *
     * Exigences:
     *
     * - `spender` ne peut pas être l'adresse zéro.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "Allocation diminuee en dessous de zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Déplace la "quantité" de jetons de "de" à "vers".
     *
     * Cette fonction interne est équivalente à {transfert} et peut être utilisée pour
     * par exemple. mettre en place des frais de jeton automatiques, des mécanismes de réduction, etc.
     *
     * Émet un événement {Transfert}.
     *
     * Exigences:
     *
     * - `from` ne peut pas être l'adresse zéro.
     * - `to` ne peut pas être l'adresse zéro.
     * - `from` doit avoir un solde d'au moins `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "Transfert depuis l'adresse zero");
        require(to != address(0), "Transfert a l'adresse zero");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "Le montant du transfert depasse le solde");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Crée des jetons "montant" et les attribue à "compte", augmentant
     * l'offre totale.
     *
     * Émet un événement {Transfer} avec `from` défini sur l'adresse zéro.
     *
     * Exigences:
     *
     * - `compte` ne peut pas être l'adresse zéro.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "mint a l'adresse zero");

        _beforeTokenTransfer(address(0), account, amount);

        totalsupplyPriv += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    //onlyRole(MINTER_ROLE)
    function mint(uint256 amount) public whenNotPaused  {
        _mint(msg.sender, amount);
    }

    // onlyRole(MINTER_ROLE)
    function mintFrom(address to, uint256 amount) public whenNotPaused  {
        _mint(to, amount);
    }

    // Permet de mettre en pause le fonctionnement des fonctions sur lesquelles on l’applique. onlyRole(PAUSER_ROLE) 
    function pause() public {
        _pause();
    }

    // Permet de mettre d’enlever la pause sur les fonctions où la fonction pause a été appliquée. onlyRole(PAUSER_ROLE)
    function unpause() public  {
        _unpause();
    }

   

    /**
     * @dev Détruit les jetons `amount` de `account`, réduisant le
     * offre totale.
     *
     * Émet un événement {Transfer} avec `to` défini sur l'adresse zéro.
     *
     * Exigences:
     *
     * - `compte` ne peut pas être l'adresse zéro.
     * - `account` doit avoir au moins des jetons `amount`.

     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "burn a partir de l'adresse zero");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "Le montant a bruler depasse le solde");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        totalsupplyPriv -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    // Permet de détruire un certain nombre de tokens saisit par l’utilisateur
    // Paramètre : Le montant. onlyRole(BURNER_ROLE)

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // onlyRole(BURNER_ROLE)
    function burnFrom(address to, uint256 amount) public {
        _burn(to, amount);
    }
    

    /**
     * @dev Définit `amount` comme l'allocation de `spender` sur les jetons du `owner` s.
     *
     * Cette fonction interne équivaut à "approuver" et peut être utilisée pour
     * par exemple. définir des allocations automatiques pour certains sous-systèmes, etc.
     *
     * Émet un événement {Approbation}.
     *
     * Exigences:
     *
     * - "propriétaire" ne peut pas être l'adresse zéro.
     * - `spender` ne peut pas être l'adresse zéro.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "Approuver a partir de l'adresse zero");
        require(spender != address(0), "Approuver a l'adresse zero");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Met à jour l'allocation du "propriétaire" pour le "dépenseur" en fonction du "montant" dépensé.
     *
     * Ne met pas à jour le montant de l'allocation en cas d'allocation infinie.
     * Revenir si l'allocation disponible n'est pas suffisante.
     *
     * Peut émettre un événement {Approval}.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Crochet qui est appelé avant tout transfert de jetons. Ceci comprend
     * frappe et gravure.
     *
     * Conditions d'appel :
     *
     * - lorsque `from` et `to` sont tous deux différents de zéro, `amount` des jetons ``from``
     * sera transféré vers `à`.
     * - lorsque `from` vaut zéro, les jetons `amount` seront créés pour `to`.
     * - lorsque `to` est égal à zéro, la `quantité` de jetons de ``from`` sera brûlée.
     * - `from` et `to` ne sont jamais tous les deux nuls.
     *
     * Pour en savoir plus sur les hooks, rendez-vous sur xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view virtual {}

    /**
     * @dev Crochet qui est appelé après tout transfert de jetons. Ceci comprend
     * frappe et gravure.
     *
     * Conditions d'appel :
     *
     * - lorsque `from` et `to` sont tous deux différents de zéro, `amount` des jetons ``from``
     * a été transféré vers `à`.
     * - lorsque `from` vaut zéro, les jetons `amount` ont été créés pour `to`.
     * - lorsque `to` est égal à zéro, la `quantité` de jetons de ``from`` a été brûlée.
     * - `from` et `to` ne sont jamais tous les deux nuls.
     *
     * Pour en savoir plus sur les hooks, rendez-vous sur xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view virtual {}

}

// Contrat Ewari pour definir notre smart contrat de token et qui hérite du contart de ERC20
contract Ewari is ERC20{
    // Le constructeur qui prend le nom, le symbole et le totalSupply du token E-WARI
    constructor() ERC20("E-WARI TestE", "EWRITE", 10000000000000, 0x13523980D932D45b037F0D38ece7bf3a82E0c87A) {
        
    }
   
}