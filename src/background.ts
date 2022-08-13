let protonAccounts;

declare var messenger: any;

function hexEncode(str) {
    return str.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
}

function generateTagKeyFromLabel(label) {
    return "$protonlabel$" + hexEncode(label);
}

async function* messageListGenerator(page) {
    for (let message of page.messages) {
        yield message;
    }

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        for (let message of page.messages) {
            yield message;
        }
    }
}

async function* recurseFoldersMessageGenerator(folders) {
    for (let folder of folders) {
        for await (let message of recurseFoldersMessageGenerator(folder.subFolders)) {
            yield message;
        }
        let page = await messenger.messages.list(folder);
        for await (let message of messageListGenerator(page)) {
            yield message;
        }
    }
}

async function load1() {
    console.log("Hello!!!!");

    let accounts = await messenger.accounts.list();

    let protonAccounts;
    try {
        protonAccounts = JSON.parse(window.localStorage.getItem("protonMailAccounts"));
    } catch {
        protonAccounts = {};
    }

    for (let account of accounts) {
        if (protonAccounts[account.id]) {
            await syncAllLabelsToTags(account);
        }
    }

}

async function syncAllLabelsToTags(account) {
    console.info(`Syncing all labels to tags on '${account.id}' ('${account.name}')`);
    let start = new Date().getTime();

    let foldersToCheckTags = [];
    let labelsFolder;

    for (let folder of account.folders) {
        if (folder.path == "/Labels") {
            labelsFolder = folder;
        } else {
            foldersToCheckTags.push(folder);
        }
    }

    if (labelsFolder == undefined) {
        console.warn(`Sync failed, no 'Labels' folder on account '${account.id}' ('${account.name}')`);
        return;
    }

    let labelCount = 0;
    let uniqueLabelCount = 0;

    let messageLabelMap = {};

    for (let labelFolder of labelsFolder.subFolders) {
        uniqueLabelCount++;
        let label = labelFolder.name;
        let labelKey = generateTagKeyFromLabel(label);

        let existingTags = (await messenger.messages.listTags()).map(x => x["key"])

        if (!existingTags.includes(labelKey)) {
            await messenger.messages.createTag(labelKey, label, "#6d4aff");
        }


        let page = await messenger.messages.list(labelFolder);

        for await (let message of messageListGenerator(page)) {
            labelCount++;

            let tags = messageLabelMap[message.headerMessageId] || [];
            tags.push(labelKey);
            messageLabelMap[message.headerMessageId] = tags;
        }

    }

    for await (let message of recurseFoldersMessageGenerator(foldersToCheckTags)) {
        let requiredTags = messageLabelMap[message.headerMessageId];
        let tagsCorrect = true;

        for (let requiredTag in requiredTags) {
            if (!message.tags.includes(requiredTag)) {
                tagsCorrect = false;
                break;
            }
        }

        if (!tagsCorrect) {
            await messenger.messages.update(message.id, { "tags": message.tags.concat(requiredTags) });
        }
    }

    let end = new Date().getTime();
    let elapsed = (end - start) / 1000;

    let labelsPerSecond = labelCount / elapsed;
    let secondsPerUniqueLabel = elapsed / uniqueLabelCount;

    console.info(
        `Synced ${labelCount} labels (${uniqueLabelCount} unique) to tags in ${elapsed.toFixed(3)} second(s) on '${account.id}' ('${account.name}'). `
        + `${labelsPerSecond.toFixed(3)} labels per second (${secondsPerUniqueLabel.toFixed(3)} seconds per unique label).`
    );
}

document.addEventListener("DOMContentLoaded", load1);