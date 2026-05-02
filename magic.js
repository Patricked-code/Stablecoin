import { Magic } from 'magic-sdk';

const customNodeOptions = {
  rpcUrl: 'https://rpc.testnet.moonbeam.network',
  chainId: 1287,
};

/**
 * Client-side Magic SDK instance.
 *
 * The SDK must only be instantiated in the browser and only when the public
 * publishable key is configured. Returning null makes callback and auth pages
 * fail with an explicit configuration error instead of crashing silently.
 */
const createMagic = (key, options) => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!key) {
    console.error('NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY is missing. Magic cannot be initialized.');
    return null;
  }

  return new Magic(key, options);
};

export const magic = createMagic(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY,
  { network: customNodeOptions }
);
