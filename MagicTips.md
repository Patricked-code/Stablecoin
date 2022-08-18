# Life hooks lifecycle
<img src="React Hook LifeHook.png" alt="hook lifecycle" width="500"/>

<br>

# Steps for Dapp to connect and communicate with a blockchain network
To interact with the ethereum blockchain, you need to connect to a node. Most people don't bother setting up a node themselves so they connect to a third party node. In ethers.js a **provider**  is basically your connection to the node. The type of provider you should use depends where your wallet is hosted.

## Metamask
If you are in a browser the most common way to connect to a node is to use the provider given by the browser extension MetaMask. The ethers documentation explains very simply how to connect to ethereum using MetaMask with the Web3Provider. 

```
web3Provider(window.ethereum)
```

## Matic link with react
Instanciate Magic
```
import { Magic } from 'magic-sdk';

const createMagic = (key) => typeof window != 'undefined' && new Magic(key);
export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
```

Login
```
export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const login = useCallback(async () => {
    setIsLoggingIn(true);
    try {
      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
      });
    } catch {
      setIsLoggingIn(false);
    }
  }, [email]);

  const handleInputOnChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  return (
    <div className='container'>
      <h1>Please sign up or login</h1>
      <input
        type='email'
        name='email'
        required='required'
        placeholder='Enter your email'
        onChange={handleInputOnChange}
        disabled={isLoggingIn}
      />
      <button onClick={login} disabled={isLoggingIn}>
        Send
      </button>
    </div>
  );
}
```

Authetication
```
useEffect( async () => {
    const magicIsLoggedin = await magic.user.isLoggedIn()
    if (magicIsLoggedin) {
        magic.user.getMetadata().then(setUserMetadata)
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
        const signer = provider.getSigner()
    } else {
        Router.push('/login')
    }
}, [])
```

Transfer
```
useEffect( async () => {
    const magicIsLoggedin = await magic.user.isLoggedIn()
    if (magicIsLoggedin) {
        magic.user.getMetadata().then(setUserMetadata)
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(adresseEcfa, AbiEcfa, signer);
        const montantParse = await ethers.utils.parseUnits(montantSaisiForTo,2);
        const adresseTo = "0x9fE4...";
        await contract.transfer(adresseTo, montantParse);
        contract.on("Transfer", (from, to, amount) => {
            console.log(`Token transfered from ${from} to ${to} amount ${amount}`);
        });
    } else {
        Router.push('/login')
    }
}, [])

```