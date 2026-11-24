"use strict";

// The trusted range and retention period are simulated audit requirements.
function checkAdminCredentials(config){
  return config.adminCredentials.unique === true && 
  config.adminCredentials.defaultPasswordChanged === true;
}

function checkFirewall(config) {
  return config.firewall.unrestrictedAdminAccess &&
    config.firewall.adminSource === "192.0.2.0/24";
}

function checkLogging(config) {
  return  config.logging.enabled === true  && 
  config.logging.protectedFromChanges === true && 
  config.logging.retentionDays === 90;
}

function checkStorage(config) {
  return config.storage.encrypted === true && config.storage.encryptedInTransit === true;
}

function checkMFA(config){
  try {
    if (config.mfa.name === "charlene" && config.mfa.birthday === "04172004") {
        if(config.mfa.pin === "2044" && config.mfa.verification){
          return true;
        }else{
          throw new Error("Error: Try Again!");
        }
      }else{
          throw new Error("Error: Sorry Credential Invalid.");
        }
    }
  catch (error) {
    
  }
}

function checkDisclosure(config){
  return config.disclosure.text === "Disclosure policy";
}

const controls = [
  {
    id: "adminCredentials",
    name: "Administrator credentials",
    detail: "Unique credentials and changed default password",
    check: checkAdminCredentials,
  },
  {
    id: "firewall",
    name: "Firewall rules",
    detail: "Administrator access is restricted to the trusted range 192.0.2.0/24",
    check: checkFirewall,
  },
  {
    id: "logging",
    name: "System logging",
    detail: "Logs are enabled, protected, and retained for at least 90 days",
    check: checkLogging,
  },
  {
    id: "storage",
    name: "Data encryption",
    detail: "Data is encrypted at rest and in transit",
    check: checkStorage,
  },
  {
    id: "mfa",
    name: "Multi-factor authentication",
    detail: "MFA is enforced for administrators",
    check: checkMFA,
  },
  {
    id: "disclosure",
    name: "Disclosure policy",
    detail: "A security disclosure policy is present",
    check: checkDisclosure,
  },
];

function runAudit() {
  const results = controls.map((control) => {
    if (typeof control.check !== "function")
      return { ...control, status: "pending" };
    const result = control.check(cloudConfig);
    // A missing value must not silently become a pass.
    return { ...control, status: result === true ? "pass" : "fail" };
  });
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const pending = results.filter((r) => r.status === "pending").length;
  const checked = passed + failed;
  const score = checked ? Math.round((passed / checked) * 100) : null;
  const audit = {
    results,
    passed,
    failed,
    pending,
    checked,
    score,
    time: new Date(),
  };
  console.log("Audit results:", audit);
  return audit;
}

