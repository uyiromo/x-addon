
const optionIds = ["hideAnalytics", "buttons", "hideLikeColumnMsg"];

// restore
window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(optionIds, (result) => {
        optionIds.forEach(id => {
            if (result[id] !== undefined) {
                document.getElementById(id).checked = result[id];
            }
        });
    });
});

// save
optionIds.forEach(id => {
    document.getElementById(id).addEventListener("change", (e) => {
        let obj = {};
        obj[id] = e.target.checked;
        chrome.storage.local.set(obj);

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    });
});

