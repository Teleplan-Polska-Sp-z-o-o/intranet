import { defineStore } from "pinia";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
// import { ref } from "vue";

export const useMsalStore = defineStore("msal", () => {
  //   const initialized = ref(false);
  //   const activeAccount = ref<AccountInfo | null>(null);
  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: "2d4d603d-f0bc-4727-9b23-40b08c2e6e63",
      authority: "https://login.microsoftonline.com/7e8ee4aa-dcc0-4745-ad28-2f942848ac88",
      redirectUri: "http://localhost",
    },
  });

  // OLD
  //   const init = async () => {
  //     if (!initialized.value) {
  //       await msalInstance.initialize();
  //       await msalInstance.handleRedirectPromise();
  //       initialized.value = true;
  //     }
  //   };

  (async () => {
    try {
      await msalInstance.initialize();
      await msalInstance.handleRedirectPromise();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
        // activeAccount.value = accounts[0];
      }
      //   initialized.value = true;
    } catch (err) {
      console.error("MSAL initialization error:", err);
    }
  })();

  const getActiveAccount = (): AccountInfo | null => msalInstance.getActiveAccount();
  const getAllAccounts = (): AccountInfo[] => msalInstance.getAllAccounts();
  const isLoggedIn = () => !!msalInstance.getActiveAccount();

  return {
    //   initialized,
    msalInstance,
    getActiveAccount,
    getAllAccounts,
    isLoggedIn,
  };
});
