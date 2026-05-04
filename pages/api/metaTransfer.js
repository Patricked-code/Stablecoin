// pages/api/metaTransfer.js
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import ABI_TOKEN_EWARI from "./../../components/Contrats/Abi/AbiStablecoin.json";

/*
  ============================================================================
  ROUTE BACKEND SECURISEE - E-WARI metaTransfer
  ============================================================================
  Objectif :
  - Ne pas exposer de clé privée côté frontend.
  - Ne pas utiliser d'adresse de contrat hardcodée obsolète.
  - Utiliser le nouveau proxy E-WARI défini par NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI.
  - Vérifier que l'utilisateur authentifié possède bien l'adresse `from`.
  - Vérifier le solde E-WARI de l'utilisateur avant émission.
  - Vérifier que l'adresse relayer possède RELAYER_ROLE on-chain.
  - Mode cible : OpenZeppelin Relayer local, appelé uniquement côté serveur.
  - Fallback temporaire : mode local_private_key conservé pour rollback contrôlé.
  ============================================================================
*/

const DEFAULT_RPC_URL = "https://rpc.testnet.moonbeam.network";
const DEFAULT_BACKEND_API_URL = "https://api.stablecoin.chainsolutions.fr";
const DEFAULT_OPENZEPPELIN_RELAYER_API_BASE_URL = "http://127.0.0.1:18080/api/v1";
const DEFAULT_OPENZEPPELIN_RELAYER_ID = "ewari-moonbase-relayer";
const DEFAULT_RELAYER_SPEED = "average";
const DEFAULT_STABLECOIN_RUNTIME_ENV_FILE = "/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin/.env.local";
const DEFAULT_EWARI_RELAYER_ADDRESS = "0x87E792E9064568361D88F8738221F8e659B0abB1";


/*
  ============================================================================
  CHARGEMENT RUNTIME SERVEUR .ENV.LOCAL
  ============================================================================
  Contexte :
  - En production Passenger/Plesk, le process Node peut ne pas recevoir les
    variables serveur ajoutees dans .env.local apres le build.
  - Cette route API reste strictement cote serveur.
  - Les variables chargees ci-dessous ne sont jamais exposees au frontend.
  - Le chargement est volontairement limite a une allowlist necessaire a cette
    route pour eviter d'importer tout le fichier d'environnement.
  ============================================================================
*/

const SERVER_RUNTIME_ENV_ALLOWED_KEYS = new Set([
  "API_URL",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_API_STABLECOIN_URL",
  "NEXT_PUBLIC_BACKEND_API_URL",
  "API_KEY_STABLECOIN",
  "WTI_API_KEY",
  "NEXT_PUBLIC_API_KEY_STABLECOIN",
  "NEXT_PUBLIC_WTI_API_KEY",
  "NEXT_PUBLIC_RPC_PROVIDER",
  "NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI",
  "EWARI_RELAYER_MODE",
  "EWARI_RELAYER_ADDRESS",
  "EWARI_RELAYER_PRIVATE_KEY",
  "OPENZEPPELIN_RELAYER_URL",
  "OPENZEPPELIN_RELAYER_API_BASE_URL",
  "OPENZEPPELIN_RELAYER_API_KEY",
  "OPENZEPPELIN_RELAYER_ID",
  "OPENZEPPELIN_RELAYER_ADDRESS",
  "OPENZEPPELIN_RELAYER_SPEED",
  "OZ_RELAYER_URL",
  "OZ_RELAYER_API_KEY",
  "OZ_RELAYER_ID",
  "OZ_RELAYER_ADDRESS",
]);

function cleanRuntimeEnvValue(rawValue) {
  let value = String(rawValue ?? "").trim();

  if (value.endsWith("\r")) {
    value = value.slice(0, -1).trim();
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return value.trim();
}


let serverRuntimeEnvLoaded = false;

function stripRuntimeEnvQuotes(value) {
  const trimmed = String(value || "").trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function loadServerRuntimeEnvFromLocalFile() {
  if (serverRuntimeEnvLoaded) {
    return;
  }

  serverRuntimeEnvLoaded = true;

  const candidates = [
      process.env.STABLECOIN_RUNTIME_ENV_FILE,
      DEFAULT_STABLECOIN_RUNTIME_ENV_FILE,
      path.join(process.cwd(), ".env.local"),
      path.resolve(process.cwd(), ".env.local"),
      path.resolve(__dirname, "../../../..", ".env.local"),
      path.resolve(__dirname, "../../..", ".env.local"),
    ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (!candidate || !fs.existsSync(candidate)) {
        continue;
      }

      const content = fs.readFileSync(candidate, "utf8");
      const lines = content.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
          continue;
        }

        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

        if (!match) {
          continue;
        }

        const key = match[1];
        const value = stripRuntimeEnvQuotes(match[2]);

        if (!SERVER_RUNTIME_ENV_ALLOWED_KEYS.has(key)) {
          continue;
        }

        if (!process.env[key]) {
          process.env[key] = cleanRuntimeEnvValue(value);
        }
      }

      return;
    } catch (_) {
      // Ne jamais bloquer l'API sur une erreur de lecture locale.
      // Les validations existantes remonteront ensuite une erreur explicite
      // si une variable obligatoire reste absente.
    }
  }
}


const DUMMY_PRIVATE_KEYS = new Set([
  "",
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000001",
]);

function getStablecoinAbi() {
  return ABI_TOKEN_EWARI?.abi || ABI_TOKEN_EWARI;
}

function getHeader(req, name) {
  const direct = req.headers[name.toLowerCase()];
  if (Array.isArray(direct)) return direct[0] || "";
  return direct || "";
}

function getBackendApiUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_STABLECOIN_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    DEFAULT_BACKEND_API_URL
  ).replace(/\/+$/, "");
}

function getBackendApiKey() {
  return (
    process.env.API_KEY_STABLECOIN ||
    process.env.WTI_API_KEY ||
    process.env.NEXT_PUBLIC_API_KEY_STABLECOIN ||
    process.env.NEXT_PUBLIC_WTI_API_KEY ||
    ""
  );
}

function getRpcUrl() {
  return process.env.NEXT_PUBLIC_RPC_PROVIDER || DEFAULT_RPC_URL;
}

function getContractAddress() {
  return process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI || "";
}

function normalizePrivateKey(raw) {
  const value = String(raw || "").trim();

  if (DUMMY_PRIVATE_KEYS.has(value)) {
    return "";
  }

  if (/^[0-9a-fA-F]{64}$/.test(value)) {
    return `0x${value}`;
  }

  if (/^0x[0-9a-fA-F]{64}$/.test(value)) {
    return value;
  }

  return "";
}



function normalizeLoadedRuntimeEnvValues() {
  for (const key of SERVER_RUNTIME_ENV_ALLOWED_KEYS) {
    if (typeof process.env[key] === "string") {
      process.env[key] = cleanRuntimeEnvValue(process.env[key]);
    }
  }
}

function getRelayerPrivateKey() {
  return normalizePrivateKey(process.env.EWARI_RELAYER_PRIVATE_KEY || "");
}

function getRelayerMode() {
  return String(process.env.EWARI_RELAYER_MODE || "OPENZEPPELIN_RELAYER")
    .trim()
    .toUpperCase();
}

function isOpenZeppelinRelayerMode() {
  const mode = getRelayerMode();
  return (
    mode === "OPENZEPPELIN_RELAYER" ||
    mode === "OZ_RELAYER" ||
    mode === "OPENZEPPELIN" ||
    mode === "OZ"
  );
}

function getOpenZeppelinRelayerApiBaseUrl() {
  const explicit = String(process.env.OPENZEPPELIN_RELAYER_API_BASE_URL || "").trim();

  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }

  const baseUrl = String(
    process.env.OPENZEPPELIN_RELAYER_URL ||
      process.env.OZ_RELAYER_URL ||
      ""
  )
    .trim()
    .replace(/\/+$/, "");

  if (baseUrl) {
    return `${baseUrl}/api/v1`;
  }

  return DEFAULT_OPENZEPPELIN_RELAYER_API_BASE_URL;
}

function readRuntimeEnvValueFromKnownFiles6BA(key) {
  const normalizedKey = String(key || "").trim();

  if (!normalizedKey || !SERVER_RUNTIME_ENV_ALLOWED_KEYS.has(normalizedKey)) {
    return "";
  }

  const candidates = [
    process.env.STABLECOIN_RUNTIME_ENV_FILE,
    DEFAULT_STABLECOIN_RUNTIME_ENV_FILE,
    path.join(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(__dirname, "../../../..", ".env.local"),
    path.resolve(__dirname, "../../..", ".env.local"),
  ].filter(Boolean);

  for (const filePath of candidates) {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        continue;
      }

      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = String(line || "").trim();

        if (!trimmed || trimmed.startsWith("#")) {
          continue;
        }

        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

        if (!match) {
          continue;
        }

        const envKey = match[1];

        if (envKey !== normalizedKey) {
          continue;
        }

        return cleanRuntimeEnvValue(stripRuntimeEnvQuotes(match[2]));
      }
    } catch (_) {
      // Ne jamais bloquer l'API sur une erreur de lecture locale.
      // Les validations existantes remonteront ensuite une erreur explicite
      // si une variable obligatoire reste absente.
    }
  }

  return "";
}

function getOpenZeppelinRelayerApiKey() {
  const currentValue = cleanRuntimeEnvValue(
    process.env.OPENZEPPELIN_RELAYER_API_KEY ||
      process.env.OZ_RELAYER_API_KEY ||
      ""
  );

  if (currentValue) {
    return currentValue;
  }

  const fileValue =
    readRuntimeEnvValueFromKnownFiles6BA("OPENZEPPELIN_RELAYER_API_KEY") ||
    readRuntimeEnvValueFromKnownFiles6BA("OZ_RELAYER_API_KEY");

  if (fileValue) {
    process.env.OPENZEPPELIN_RELAYER_API_KEY = fileValue;
  }

  return fileValue;
}

function getOpenZeppelinRelayerId() {
  return String(
    process.env.OPENZEPPELIN_RELAYER_ID ||
      process.env.OZ_RELAYER_ID ||
      DEFAULT_OPENZEPPELIN_RELAYER_ID
  ).trim();
}

function getConfiguredRelayerAddress() {
  return cleanRuntimeEnvValue(
    process.env.EWARI_RELAYER_ADDRESS ||
      process.env.OPENZEPPELIN_RELAYER_ADDRESS ||
      process.env.OZ_RELAYER_ADDRESS ||
      DEFAULT_EWARI_RELAYER_ADDRESS
  );
}

function jsonError(res, status, code, message, extra = {}) {
  return res.status(status).json({
    ok: false,
    code,
    message,
    ...extra,
  });
}

function makeHttpError(statusCode, code, message, extra = {}) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  Object.assign(error, extra);
  return error;
}

function normalizeAddress(value, fieldName) {
  const raw = String(value || "").trim();

  if (!raw || !ethers.utils.isAddress(raw)) {
    const error = new Error(`${fieldName} invalide.`);
    error.statusCode = 400;
    error.code = "INVALID_ADDRESS";
    throw error;
  }

  return ethers.utils.getAddress(raw);
}

function normalizeAmount(value) {
  const raw = String(value ?? "").trim();

  if (!/^[0-9]+$/.test(raw)) {
    const error = new Error("value doit être un entier positif en unités brutes.");
    error.statusCode = 400;
    error.code = "INVALID_AMOUNT";
    throw error;
  }

  const amount = ethers.BigNumber.from(raw);

  if (amount.lte(0)) {
    const error = new Error("value doit être supérieur à zéro.");
    error.statusCode = 400;
    error.code = "INVALID_AMOUNT_ZERO";
    throw error;
  }

  return amount;
}

function extractFirstUserObject(payload) {
  if (!payload || typeof payload !== "object") return null;

  const candidates = [
    payload.user,
    payload.data,
    payload.result,
    payload.currentUser,
    payload.current_user,
    payload.authUser,
    payload.authenticatedUser,
    payload,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (
        candidate.email ||
        candidate.address ||
        candidate.id ||
        candidate.ProfileId ||
        candidate.codeTypeProfil
      ) {
        return candidate;
      }
    }
  }

  return null;
}

function extractAddressFromUser(user) {
  if (!user || typeof user !== "object") return "";

  const candidateKeys = [
    "address",
    "walletAddress",
    "blockchainAddress",
    "addrBlockchain",
    "addressBlockchain",
    "adresseBlockchain",
    "adresse_blockchain",
    "wallet",
  ];

  for (const key of candidateKeys) {
    const value = user[key];

    if (value && ethers.utils.isAddress(String(value))) {
      return ethers.utils.getAddress(String(value));
    }
  }

  return "";
}

async function callBackendCurrentUser(req) {
  const authorization = getHeader(req, "authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    const error = new Error("Token d'authentification manquant.");
    error.statusCode = 401;
    error.code = "AUTH_TOKEN_MISSING";
    throw error;
  }

  const backendApiUrl = getBackendApiUrl();
  const backendApiKey = getBackendApiKey();

  if (!backendApiKey) {
    const error = new Error("Clé API backend absente côté serveur.");
    error.statusCode = 500;
    error.code = "BACKEND_API_KEY_MISSING";
    throw error;
  }

  const url = `${backendApiUrl}/api/user/find-user-sign-in`;

  const commonHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": backendApiKey,
    Authorization: authorization,
  };

  let response = await fetch(url, {
    method: "GET",
    headers: commonHeaders,
  });

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    response = await fetch(url, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({}),
    });
  }

  const rawBody = await response.text();

  let payload = null;
  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch (_) {
    payload = { rawBody };
  }

  if (!response.ok) {
    const error = new Error("Impossible de vérifier l'utilisateur authentifié.");
    error.statusCode = response.status || 401;
    error.code = "AUTH_BACKEND_VERIFICATION_FAILED";
    error.backendStatus = response.status;
    throw error;
  }

  const user = extractFirstUserObject(payload);

  if (!user) {
    const error = new Error("Réponse backend utilisateur non reconnue.");
    error.statusCode = 401;
    error.code = "AUTH_USER_PAYLOAD_INVALID";
    throw error;
  }

  const userAddress = extractAddressFromUser(user);

  if (!userAddress) {
    const error = new Error("Adresse blockchain utilisateur introuvable dans le compte authentifié.");
    error.statusCode = 403;
    error.code = "AUTH_USER_BLOCKCHAIN_ADDRESS_MISSING";
    throw error;
  }

  return {
    user,
    userAddress,
  };
}

async function assertRelayerHasRole(contract, relayerAddress) {
  let roleBytes;

  try {
    roleBytes = await contract.RELAYER_ROLE();
  } catch (error) {
    const e = new Error("Impossible de lire RELAYER_ROLE sur le contrat E-WARI.");
    e.statusCode = 500;
    e.code = "RELAYER_ROLE_READ_FAILED";
    throw e;
  }

  const hasRole = await contract.hasRole(roleBytes, relayerAddress);

  if (!hasRole) {
    const error = new Error("Le relayer serveur n'a pas RELAYER_ROLE sur le nouveau contrat.");
    error.statusCode = 500;
    error.code = "RELAYER_ROLE_MISSING";
    error.relayer = relayerAddress;
    throw error;
  }
}

async function readJsonResponse(response) {
  const rawBody = await response.text();

  let payload = null;
  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch (_) {
    payload = { rawBody };
  }

  return {
    rawBody,
    payload,
  };
}

async function callOpenZeppelinRelayerApi(path, options = {}) {
  const apiBaseUrl = getOpenZeppelinRelayerApiBaseUrl();
  const apiKey = getOpenZeppelinRelayerApiKey();

  if (!apiKey) {
    throw makeHttpError(
      500,
      "OPENZEPPELIN_RELAYER_API_KEY_MISSING",
      "OpenZeppelin Relayer API key absente côté serveur."
    );
  }

  const url = `${apiBaseUrl}${path}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const { rawBody, payload } = await readJsonResponse(response);

  if (!response.ok) {
    throw makeHttpError(
      502,
      "OPENZEPPELIN_RELAYER_HTTP_ERROR",
      "OpenZeppelin Relayer a retourne une erreur HTTP.",
      {
        relayerHttpStatus: response.status,
        relayerPayload: sanitizeRelayerPayload(payload),
        relayerRawBody: typeof rawBody === "string" ? rawBody.slice(0, 1000) : "",
      }
    );
  }

  if (payload && payload.success === false) {
    throw makeHttpError(
      502,
      "OPENZEPPELIN_RELAYER_API_ERROR",
      "OpenZeppelin Relayer a refuse la requete.",
      {
        relayerPayload: sanitizeRelayerPayload(payload),
      }
    );
  }

  return payload;
}

function sanitizeRelayerPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;

  try {
    return JSON.parse(
      JSON.stringify(payload, (key, value) => {
        if (/key|secret|password|token|authorization/i.test(key)) {
          return "[MASKED]";
        }
        return value;
      })
    );
  } catch (_) {
    return { sanitized: true };
  }
}

function extractRelayerData(payload) {
  if (!payload || typeof payload !== "object") return {};
  if (payload.data && typeof payload.data === "object") return payload.data;
  return payload;
}

function extractTransactionId(payload) {
  const data = extractRelayerData(payload);

  return (
    data.id ||
    data.transaction_id ||
    data.transactionId ||
    data.uuid ||
    data.request_id ||
    data.requestId ||
    payload?.id ||
    payload?.transaction_id ||
    payload?.transactionId ||
    ""
  );
}

function extractTransactionHash(payload) {
  const data = extractRelayerData(payload);

  const direct =
    data.hash ||
    data.tx_hash ||
    data.transaction_hash ||
    data.transactionHash ||
    data.txHash ||
    data.network_hash ||
    payload?.hash ||
    payload?.tx_hash ||
    payload?.transaction_hash ||
    payload?.transactionHash ||
    payload?.txHash ||
    "";

  if (direct) return direct;

  if (Array.isArray(data.hashes) && data.hashes.length > 0) {
    return data.hashes[0];
  }

  if (Array.isArray(payload?.hashes) && payload.hashes.length > 0) {
    return payload.hashes[0];
  }

  return "";
}

function extractTransactionStatus(payload) {
  const data = extractRelayerData(payload);
  return data.status || payload?.status || "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollOpenZeppelinTransactionIfPossible(transactionId) {
  if (!transactionId) return null;

  const relayerId = getOpenZeppelinRelayerId();

  for (let attempt = 0; attempt < 6; attempt += 1) {
    await sleep(1000);

    try {
      const payload = await callOpenZeppelinRelayerApi(
        `/relayers/${encodeURIComponent(relayerId)}/transactions/${encodeURIComponent(transactionId)}`
      );

      const txHash = extractTransactionHash(payload);
      const status = extractTransactionStatus(payload);

      if (txHash || status) {
        return {
          payload,
          txHash,
          status,
        };
      }
    } catch (_) {
      return null;
    }
  }

  return null;
}

function buildOpenZeppelinTransactionBody({ contractAddress, data, gasLimit }) {
  const body = {
    to: contractAddress,
    value: "0",
    data,
    speed: process.env.OPENZEPPELIN_RELAYER_SPEED || DEFAULT_RELAYER_SPEED,
  };

  if (gasLimit) {
    const gasLimitString = ethers.BigNumber.from(gasLimit).toString();
    const gasLimitNumber = Number(gasLimitString);

    if (Number.isSafeInteger(gasLimitNumber) && gasLimitNumber > 0) {
      body.gas_limit = gasLimitNumber;
    }
  }

  return body;
}

async function sendViaOpenZeppelinRelayer({ contractAddress, data, gasLimit }) {
  const relayerId = getOpenZeppelinRelayerId();

  if (!relayerId) {
    throw makeHttpError(
      500,
      "OPENZEPPELIN_RELAYER_ID_MISSING",
      "Identifiant OpenZeppelin Relayer absent côté serveur."
    );
  }

  const body = buildOpenZeppelinTransactionBody({
    contractAddress,
    data,
    gasLimit,
  });

  const submitPayload = await callOpenZeppelinRelayerApi(
    `/relayers/${encodeURIComponent(relayerId)}/transactions`,
    {
      method: "POST",
      body,
    }
  );

  const transactionId = extractTransactionId(submitPayload);
  let txHash = extractTransactionHash(submitPayload);
  let transactionStatus = extractTransactionStatus(submitPayload);
  let detailPayload = null;

  if (transactionId && !txHash) {
    const detail = await pollOpenZeppelinTransactionIfPossible(transactionId);

    if (detail) {
      detailPayload = detail.payload;
      txHash = detail.txHash || txHash;
      transactionStatus = detail.status || transactionStatus;
    }
  }

  return {
    submitPayload,
    detailPayload,
    transactionId,
    txHash,
    transactionStatus,
  };
}

async function executeMetaTransferWithOpenZeppelinRelayer({
  provider,
  contractAddress,
  fromAddress,
  toAddress,
  amount,
}) {
  const configuredRelayerAddress = normalizeAddress(
    getConfiguredRelayerAddress(),
    "EWARI_RELAYER_ADDRESS"
  );

  const contract = new ethers.Contract(
    contractAddress,
    getStablecoinAbi(),
    provider
  );

  await assertRelayerHasRole(contract, configuredRelayerAddress);

  const balance = await contract.balanceOf(fromAddress);

  if (balance.lt(amount)) {
    throw makeHttpError(
      400,
      "INSUFFICIENT_BALANCE",
      "Solde E-WARI insuffisant pour exécuter ce transfert.",
      {
        balanceRaw: balance.toString(),
        requestedRaw: amount.toString(),
      }
    );
  }

  const gasEstimate = await contract.estimateGas.metaTransfer(
    fromAddress,
    toAddress,
    amount,
    {
      from: configuredRelayerAddress,
    }
  );

  const gasLimit = gasEstimate.mul(120).div(100);

  const data = contract.interface.encodeFunctionData("metaTransfer", [
    fromAddress,
    toAddress,
    amount,
  ]);

  const relayerResult = await sendViaOpenZeppelinRelayer({
    contractAddress,
    data,
    gasLimit,
  });

  return {
    ok: true,
    mode: "OPENZEPPELIN_RELAYER",
    txHash: relayerResult.txHash || null,
    relayerTransactionId: relayerResult.transactionId || null,
    relayerTransactionStatus: relayerResult.transactionStatus || null,
    contractAddress,
    relayerAddress: configuredRelayerAddress,
    from: fromAddress,
    to: toAddress,
    value: amount.toString(),
    gasLimit: gasLimit.toString(),
    blockNumber: null,
    relayerAccepted: true,
  };
}

async function executeMetaTransferWithLocalPrivateKey({
  provider,
  contractAddress,
  fromAddress,
  toAddress,
  amount,
}) {
  const relayerPrivateKey = getRelayerPrivateKey();

  if (!relayerPrivateKey) {
    throw makeHttpError(
      500,
      "RELAYER_PRIVATE_KEY_MISSING",
      "Relayer serveur non configuré. Définissez EWARI_RELAYER_PRIVATE_KEY côté serveur, sans NEXT_PUBLIC."
    );
  }

  const wallet = new ethers.Wallet(relayerPrivateKey, provider);
  const contract = new ethers.Contract(contractAddress, getStablecoinAbi(), wallet);

  await assertRelayerHasRole(contract, wallet.address);

  const balance = await contract.balanceOf(fromAddress);

  if (balance.lt(amount)) {
    throw makeHttpError(
      400,
      "INSUFFICIENT_BALANCE",
      "Solde E-WARI insuffisant pour exécuter ce transfert.",
      {
        balanceRaw: balance.toString(),
        requestedRaw: amount.toString(),
      }
    );
  }

  const gasEstimate = await contract.estimateGas.metaTransfer(
    fromAddress,
    toAddress,
    amount
  );

  const gasLimit = gasEstimate.mul(120).div(100);

  const tx = await contract.metaTransfer(
    fromAddress,
    toAddress,
    amount,
    {
      gasLimit,
    }
  );

  const receipt = await tx.wait();

  return {
    ok: true,
    mode: "LOCAL_PRIVATE_KEY",
    txHash: receipt.transactionHash,
    contractAddress,
    relayerAddress: wallet.address,
    from: fromAddress,
    to: toAddress,
    value: amount.toString(),
    gasLimit: gasLimit.toString(),
    blockNumber: receipt.blockNumber,
  };
}

export default async function handler(req, res) {
  loadServerRuntimeEnvFromLocalFile();
  normalizeLoadedRuntimeEnvValues();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return jsonError(
      res,
      405,
      "METHOD_NOT_ALLOWED",
      "Méthode non autorisée. Utilisez POST."
    );
  }

  try {
    const { from, to, value } = req.body || {};

    const fromAddress = normalizeAddress(from, "from");
    const toAddress = normalizeAddress(to, "to");
    const amount = normalizeAmount(value);

    if (fromAddress === toAddress) {
      return jsonError(
        res,
        400,
        "SAME_FROM_TO",
        "L'adresse source et l'adresse destinataire doivent être différentes."
      );
    }

    const contractAddress = normalizeAddress(
      getContractAddress(),
      "NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI"
    );

    const { userAddress } = await callBackendCurrentUser(req);

    if (userAddress.toLowerCase() !== fromAddress.toLowerCase()) {
      return jsonError(
        res,
        403,
        "FROM_ADDRESS_NOT_AUTHENTICATED_USER",
        "L'adresse source ne correspond pas à l'adresse blockchain de l'utilisateur authentifié.",
        {
          authenticatedAddress: userAddress,
        }
      );
    }

    const provider = new ethers.providers.JsonRpcProvider(getRpcUrl());

    const result = isOpenZeppelinRelayerMode()
      ? await executeMetaTransferWithOpenZeppelinRelayer({
          provider,
          contractAddress,
          fromAddress,
          toAddress,
          amount,
        })
      : await executeMetaTransferWithLocalPrivateKey({
          provider,
          contractAddress,
          fromAddress,
          toAddress,
          amount,
        });

    return res.status(200).json(result);
  } catch (error) {
    const status = error?.statusCode || 500;

    console.error("META_TRANSFER_SECURE_ERROR", {
      code: error?.code || "UNKNOWN_ERROR",
      message: error?.message || "Erreur inconnue",
      status,
      mode: getRelayerMode(),
      relayerHttpStatus: error?.relayerHttpStatus,
    });

    return jsonError(
      res,
      status,
      error?.code || "META_TRANSFER_FAILED",
      error?.message || "Erreur lors de la transaction metaTransfer.",
      {
        ...(error?.relayerHttpStatus
          ? { relayerHttpStatus: error.relayerHttpStatus }
          : {}),
        ...(error?.relayerPayload
          ? { relayerPayload: error.relayerPayload }
          : {}),
        ...(error?.balanceRaw
          ? { balanceRaw: error.balanceRaw }
          : {}),
        ...(error?.requestedRaw
          ? { requestedRaw: error.requestedRaw }
          : {}),
      }
    );
  }
}
