declare var messenger: any;

async function load() {
    let selectedAccounts;
    try {
        selectedAccounts = JSON.parse(window.localStorage.getItem("protonMailAccounts"));
    } catch {
        selectedAccounts = {};
    }

    // Set up Proton account selection
    let accountSelectUL = document.getElementById("accountSelect");
    let accounts = await messenger.accounts.list(false);

    for (let account of accounts) {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = account.id;
        checkbox.name = account.id;
        checkbox.value = account.id;
        checkbox.checked = selectedAccounts[account.id] || false;

        checkbox.onchange = (event: Event) => {
            let selectedAccounts;
            try {
                selectedAccounts = JSON.parse(window.localStorage.getItem("protonMailAccounts"));
            } catch {
                selectedAccounts = {};
            }
            let checkbox = event.target as HTMLInputElement;
            selectedAccounts[checkbox.value] = checkbox.checked;
            console.trace(checkbox.value);
            console.trace(selectedAccounts);
            window.localStorage.setItem("protonMailAccounts", JSON.stringify(selectedAccounts));
        };

        let label = document.createElement("label");
        label.attributes["for"] = account.id;
        label.innerHTML = account.name

        li.appendChild(checkbox);
        li.appendChild(label);
        accountSelectUL.appendChild(li);
    }
}

document.addEventListener("DOMContentLoaded", load);