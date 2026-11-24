"use strict";

// Simulated settings only. Refreshing the page restores these starter values.
const cloudConfig = {
  adminCredentials: {
    unique: true,
    defaultPasswordChanged: true
    },

  firewall: { 
    unrestrictedAdminAccess: true, 
    adminSource: "192.0.2.0/24" 
  },

  logging: { 
    enabled: true, 
    retentionDays: 90, 
    protectedFromChanges: true
  },

  storage: { 
    encrypted: true, 
    encryptedInTransit: true
  },
 
  mfa: {
    name: "charlene",
    birthday: "04172004",
    pin: "2044",
    verification: true
  },

  disclosure: {
    text: "Disclosure policy",
  }

};
