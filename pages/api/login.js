import { Magic } from '@magic-sdk/admin';

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

function extractBearerToken(req) {
  const authorization = req.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.replace('Bearer ', '').trim();
}

export default async function login(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      authenticated: false,
      message: 'Méthode non autorisée',
    });
  }

  if (!process.env.MAGIC_SECRET_KEY) {
    return res.status(500).json({
      authenticated: false,
      message: 'Configuration serveur incomplète : MAGIC_SECRET_KEY est manquante.',
    });
  }

  const didToken = extractBearerToken(req);

  if (!didToken) {
    return res.status(401).json({
      authenticated: false,
      message: 'Token Magic manquant ou mal formé.',
    });
  }

  try {
    await magic.token.validate(didToken);

    const metadata = await magic.users.getMetadataByToken(didToken);

    return res.status(200).json({
      authenticated: true,
      email: metadata?.email || null,
      issuer: metadata?.issuer || null,
      publicAddress: metadata?.publicAddress || null,
    });
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
      message: error?.message || 'Échec de validation du callback Magic.',
    });
  }
}
