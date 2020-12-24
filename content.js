const hostname = window.location.hostname;
let store = {};

const generateAddress = (domain) => {
  if (!domain || !hostname) {
    return null;
  }
  const alias = hostname.split(".").reverse().join(".");
  return `${alias}@${domain}`;
};

const saveAlias = (address) => {
  chrome.storage.sync.set({
    [hostname]: {
      address,
      secure: window.location.protocol === "https:",
      timestamp: Date.now(),
    },
  });
};

const onload = (domain) => {
  const emails = document.querySelectorAll('input[type="email"]');
  if (emails.length) {
    const existing = store[hostname];
    const address = existing ? existing.address : generateAddress(domain);
    if (address) {
      emails.forEach((el) => {
        el.value = address;
      });
      if (!existing) {
        saveAlias(address);
      }
    }
  }
};

chrome.storage.sync.get(null, (obj) => {
  const domain = obj.settings ? obj.settings.domain : null;
  if (!domain) {
    console.log("Email domain not set!");
  } else {
    console.log("Email domain set!");
    store = obj;
    onload(domain);
  }
});

console.log("this is running!");
