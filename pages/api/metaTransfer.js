// pages/api/metaTransfer.js
import { ethers } from "ethers";
import ABI_TOKEN_EWARI from "./../../components/Contrats/Abi/AbiStablecoin.json";

/*
  ============================================================================
  ROUTE BACKEND SECURISEE - E-WARI metaTransfer
  ============================================================================
  Objectif :
  - Ne plus exposer de clé privée côté frontend.
  - Ne plus utiliser d'adresse de contrat hardcodée obsolète.
  - Utiliser le nouveau proxy E-WARI défini par NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI.
  - Vérifier que l'utilisateur authentifié possède bien l'adresse `from`.
  - Refuser toute transaction si la clé relayer serveur est absente.
  - Refuser toute transaction si le relayer n'a pas RELAYER_ROLE on-chain.
  ============================================================================
*/

const DEFAULT_RPC_URL = "https://rpc.testnet.moonbeam.network";
const DEFAULT_BACKEND_API_URL = "https://api.stablecoin.chainsolutions.fr";

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

function getRelayerPrivateKey() {
  return normalizePrivateKey(process.env.EWARI_RELAYER_PRIVATE_KEY || "");
}

function jsonError(res, status, code, message, extra = {}) {
  return res.status(status).json({
    ok: false,
    code,
    message,
    ...extra,
  });
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
    const error = new Error("Le wallet relayer serveur n'a pas RELAYER_ROLE sur le nouveau contrat.");
    error.statusCode = 500;
    error.code = "RELAYER_ROLE_MISSING";
    error.relayer = relayerAddress;
    throw error;
  }
}

export default async function handler(req, res) {
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

    const relayerPrivateKey = getRelayerPrivateKey();

    if (!relayerPrivateKey) {
      return jsonError(
        res,
        500,
        "RELAYER_PRIVATE_KEY_MISSING",
        "Relayer serveur non configuré. Définissez EWARI_RELAYER_PRIVATE_KEY côté serveur, sans NEXT_PUBLIC."
      );
    }

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
    const wallet = new ethers.Wallet(relayerPrivateKey, provider);
    const contract = new ethers.Contract(contractAddress, getStablecoinAbi(), wallet);

    await assertRelayerHasRole(contract, wallet.address);

    const balance = await contract.balanceOf(fromAddress);

    if (balance.lt(amount)) {
      return jsonError(
        res,
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

    return res.status(200).json({
      ok: true,
      txHash: receipt.transactionHash,
      contractAddress,
      relayerAddress: wallet.address,
      from: fromAddress,
      to: toAddress,
      value: amount.toString(),
      blockNumber: receipt.blockNumber,
    });
  } catch (error) {
    const status = error?.statusCode || 500;

    console.error("META_TRANSFER_SECURE_ERROR", {
      code: error?.code || "UNKNOWN_ERROR",
      message: error?.message || "Erreur inconnue",
      status,
    });

    return jsonError(
      res,
      status,
      error?.code || "META_TRANSFER_FAILED",
      error?.message || "Erreur lors de la transaction metaTransfer."
    );
  }
}
