let protonAccounts = ["account1"];


async function load() {
    console.log("Hello!!!!");
    /*
    let page = await messenger.messages.list(folder);

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
    }
    */

    let accounts = await messenger.accounts.list();

    for (let account of accounts) {
        if (protonAccounts.includes(account.id)) {
            await syncTagsAndLabels(account);
        }
    }

}

async function syncTagsAndLabels(account) {
    let foldersToCheckTags = [];
    let labelsFolder;

    for (let folder of account.folders) {
        if (folder.path == "/Labels") {
            labelsFolder = folder;
        } else {
            foldersToCheckTags.push(folder);
        }
    }


}

document.addEventListener("DOMContentLoaded", load);