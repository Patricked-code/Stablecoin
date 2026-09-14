#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const failures = [];

function ok(condition, message) {
  if (!condition) failures.push(message);
}
function exists(p) {
  return fs.existsSync(path.join(ROOT, p));
}
function read(p) {
  return fs.readFileSync(path.join(ROOT, p), "utf8");
}
function json(p) {
  try {
    return JSON.parse(read(p));
  } catch (error) {
    failures.push(`${p}: invalid JSON (${error.message})`);
    return {};
  }
}
function slug(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 _-]/g, "")
    .replace(/\s+/g, "-");
}
function hasAnchor(file, anchor) {
  if (!exists(file)) return false;
  const headings = read(file)
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => slug(line.replace(/^#{1,6}\s+/, "")));
  return headings.includes(anchor);
}

const requiredFiles = [
  "GOVERNANCE.md",
  "SOURCE_OF_TRUTH.md",
  "AGENTS.md",
  "SUIVI.md",
  "TODO.md",
  "DECISIONS.md",
  "ARCHITECTURE.md",
  "LOOP_ENGINEERING.md",
  "docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md",
  ".mcp/manifest.json",
  ".mcp/permissions.json",
  ".mcp/agents.json",
  ".mcp/server-map.json",
  ".mcp/onboarding.json",
  "scripts/verify-governance-consistency.js",
  ".github/workflows/governance-consistency.yml"
];

for (const file of requiredFiles) {
  ok(exists(file), `missing required authority/file: ${file}`);
}

const manifest = json(".mcp/manifest.json");
const permissions = json(".mcp/permissions.json");
const agents = json(".mcp/agents.json");
const onboarding = json(".mcp/onboarding.json");
const serverMap = json(".mcp/server-map.json");

ok(manifest.repository === "Patricked-code/Stablecoin", "manifest repository identity mismatch");
ok(manifest.defaultBranch === "main", "manifest default branch must be main");
ok(onboarding.repository === "Patricked-code/Stablecoin", "onboarding repository identity mismatch");
ok(onboarding.canonicalBranch === "main", "onboarding canonical branch must be main");
ok(onboarding.entrypoint === "GOVERNANCE.md", "onboarding entrypoint must remain GOVERNANCE.md");

ok(
  manifest.historicalEvidence?.branch === "codex/wealthtech-mcp-conversation-memory",
  "historical evidence branch changed unexpectedly"
);
ok(
  manifest.historicalEvidence?.classification === "HISTORICAL_EVIDENCE_NOT_CURRENT_AUTHORITY",
  "historical evidence classification changed unexpectedly"
);

ok(permissions.writePolicy?.canonicalBranch === "main", "permissions canonical branch must be main");
ok(permissions.writePolicy?.forcePush === false, "force push must remain forbidden");
ok(permissions.writePolicy?.historyRewrite === false, "history rewrite must remain forbidden");
ok(
  permissions.writePolicy?.branchCreation === "OWNER_EXPLICIT_ONLY",
  "branch creation policy weakened"
);
ok(
  permissions.writePolicy?.branchSwitch === "OWNER_EXPLICIT_ONLY",
  "branch switch policy weakened"
);
ok(
  permissions.semantics?.scope === "repository_policy_ceiling",
  "permission scope semantics missing"
);
ok(
  permissions.semantics?.provesLiveAgentCapability === false,
  "repository policy must not claim live capability"
);
ok(
  permissions.semantics?.liveCapabilityCheckRequiredBeforeWrite === true,
  "live capability check must be required before write"
);

ok(
  agents.interpretation?.canWriteCanonicalBranchMeans === "REPOSITORY_POLICY_CEILING_ONLY",
  "agent write permission semantics missing"
);
ok(
  agents.interpretation?.provesLiveConnectorWriteCapability === false,
  "agent policy must not prove live connector capability"
);

ok(
  manifest.runtime?.verificationStatus === "DOCUMENTED_UNVERIFIED",
  "manifest runtime must remain DOCUMENTED_UNVERIFIED until live proof"
);
ok(
  serverMap.verificationStatus === "DOCUMENTED_UNVERIFIED",
  "server-map runtime must remain DOCUMENTED_UNVERIFIED until live proof"
);
ok(
  manifest.mcpIntegration?.coreModificationRequired === false,
  "Stablecoin must not require MCP core modification"
);
ok(
  onboarding.mcpCompatibility?.parallelMcpMechanismsForbidden === true,
  "parallel MCP mechanisms must remain forbidden"
);

ok(
  manifest.mcpIntegration?.existingExternalSshBridgePolicy ===
    "REUSE_AND_REVALIDATE_EXISTING_WEALTHTECH_SSH_BRIDGE_NO_PARALLEL_TRANSPORT",
  "existing external SSH bridge reuse policy missing"
);

for (const [role, target] of Object.entries(onboarding.semanticRoles || {})) {
  const [file, anchor] = String(target).split("#");
  ok(exists(file), `semantic role ${role} points to missing file ${file}`);
  if (anchor) {
    ok(
      hasAnchor(file, anchor),
      `semantic role ${role} points to missing anchor #${anchor} in ${file}`
    );
  }
}

const suivi = read("SUIVI.md");
const requiredStateKeys = [
  "CURRENT_WORKSTREAM",
  "CURRENT_TASK",
  "CURRENT_TASK_STATUS",
  "TASK_BASELINE_SHA",
  "SOURCE_HEAD_OBSERVED",
  "LAST_COMPLETED_ACTION",
  "CURRENT_BLOCKER",
  "EXACT_NEXT_ACTION",
  "RUNTIME_STATUS",
  "CI_STATUS",
  "MCP_REGISTRATION_STATUS",
  "SECURITY_WARNINGS",
  "CHECKPOINT_ID",
  "EVIDENCE_IDS"
];

for (const key of requiredStateKeys) {
  ok(
    new RegExp(`^${key}\\s*=\\s*.+$`, "m").test(suivi),
    `SUIVI current-state key missing: ${key}`
  );
}

const taskMatch = suivi.match(/^CURRENT_TASK\s*=\s*(.+)$/m);
if (taskMatch) {
  ok(
    read("TODO.md").includes(taskMatch[1].trim()),
    "TODO.md does not reference CURRENT_TASK from SUIVI.md"
  );
}

ok(
  read("GOVERNANCE.md").includes("repository policy permission"),
  "GOVERNANCE.md must distinguish policy from live capability"
);
ok(
  read("LOOP_ENGINEERING.md").includes("CHECKPOINT_ID"),
  "LOOP_ENGINEERING.md must persist checkpoint semantics"
);

if (failures.length) {
  console.error("Governance consistency: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Governance consistency: PASS");
console.log(
  `Checked ${requiredFiles.length} required files plus MCP/task/checkpoint invariants.`
);
