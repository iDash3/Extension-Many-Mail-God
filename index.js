const id = (id) => {
  return document.getElementById(id);
};

// Save domain
const save = () => {
  const val = id("input").value;

  if (!val) {
    id("feedback").innerText = "No input!";
    return;
  }
  chrome.storage.sync.set(
    {
      settings: {
        domain: val,
      },
    },
    () => {
      id("feedback").innerText = "Saved!";
    }
  );
};

const makeButton = (h, tr) => {
  const btn = document.createElement("button");
  btn.innerText = "X";
  btn.onclick = () => {
    chrome.storage.sync.remove(h, () => {
      tr.remove();
    });
  };
  return btn;
};

// Fill table with hostnames
const showTable = (obj) => {
  const table = id("table");
  let hostnames = Object.keys(obj).filter((s) => s !== "settings");
  hostnames = hostnames.sort();

  hostnames.forEach((h) => {
    const tr = document.createElement("tr");

    const col1 = document.createElement("td");
    const a = document.createElement("a");
    const scheme = obj[h].secure ? "https://" : "http://";
    a.href = `${scheme}${h}`;
    a.innerText = obj[h].address;
    col1.appendChild(a);

    const col2 = document.createElement("td");
    col2.appendChild(makeButton(h, tr));

    tr.appendChild(col1);
    tr.appendChild(col2);
    table.appendChild(tr);
  });
};

// Save on click or enter
id("save").onclick = save;
id("input").addEventListener("keydown", (ev) => {
  if (ev.keyCode === 13) {
    save();
  }
});

// Clear all data and reload
id("reset").onclick = () => {
  chrome.storage.sync.clear(() => {
    window.location.reload();
  });
};

// Fill input with saved domain
chrome.storage.sync.get(null, (obj) => {
  const domain = obj.settings ? obj.settings.domain : null;
  if (domain) {
    id("input").value = domain;
    showTable(obj);
  }
});
