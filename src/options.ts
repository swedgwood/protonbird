import { Messenger } from "./mailextensions";
import { Config } from "./config";

declare var messenger: Messenger;

async function load() {
    let protonMailAccountIds = Config.read().protonAccountIds;

    // Set up Proton account selection
    let accountSelectUL = document.getElementById("accountSelect") as HTMLElement;
    let accounts = await messenger.accounts.list(false);

    for (let account of accounts) {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = account.id;
        checkbox.name = account.id;
        checkbox.value = account.id;
        checkbox.checked = protonMailAccountIds.includes(account.id);

        checkbox.onchange = (event: Event) => {
            let config = Config.read();
            let checkbox = event.target as HTMLInputElement;
            if (checkbox.checked) {
                config.addProtonAccountId(checkbox.value);
            } else {
                config.removeProtonAccountId(checkbox.value);
            }
            console.trace(checkbox.value);
            console.trace(config);
            config.write();
        };

        let label = document.createElement("label");
        label.htmlFor = account.id;
        label.innerHTML = account.name

        li.appendChild(checkbox);
        li.appendChild(label);
        accountSelectUL.appendChild(li);
    }
}

document.addEventListener("DOMContentLoaded", load);