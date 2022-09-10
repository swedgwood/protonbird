import { MailAccount, MailFolder, MessageHeader, MessageList, Messenger } from "./mailextensions";
import { Config } from "./config";

declare var messenger: Messenger;

function hexEncode(str: string): string {
    return str.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
}

// TODO: include account id in this maybe?
// TODO: also we might want to figure out how to link proton labels to existing tags?
function generateTagKeyFromLabel(label: string): string {
    return "$protonlabel$" + hexEncode(label);
}

async function* messageListGenerator(page: MessageList) {
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



async function* recurseFoldersMessageGenerator(folders: MailFolder[]) {

    for (let folder of folders) {
        if (folder.subFolders !== undefined) {
            let message: MessageHeader;
            for await (message of recurseFoldersMessageGenerator(folder.subFolders)) {
                yield message;
            }
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

    let protonAccountIds = (await Config.read()).protonAccountIds;

    for (let account of accounts) {
        if (protonAccountIds.includes(account.id)) {
            await syncAllLabelsToTags(account);
        }
    }

}

async function syncAllLabelsToTags(account: MailAccount) {
    console.info(`Syncing all labels to tags on '${account.id}' ('${account.name}')`);
    let start = new Date().getTime();

    let foldersToCheckTags = [];
    let labelFolder;

    if (account.folders === undefined) {
        account = messenger.accounts.get(account.id, true);
    }
    // .get call above should have .folders populated, so we can cast it safely.
    account.folders = account.folders as MailFolder[];

    for (let folder of account.folders) {
        if (folder.path == "/Labels") {
            labelFolder = folder;
        } else {
            foldersToCheckTags.push(folder);
        }
    }

    if (labelFolder == undefined) {
        console.warn(`Sync failed, no 'Labels' folder on account '${account.id}' ('${account.name}')`);
        return;
    }

    let labelCount = 0;
    let uniqueLabelCount = 0;

    // message ID header -> array of tag keys
    let messageLabelMap: Record<string, string[]> = {};

    // safe cast for same reason as above
    let labelSubFolders = labelFolder.subFolders as MailFolder[];

    for (let labelFolder of labelSubFolders) {
        uniqueLabelCount++;
        let label = labelFolder.name as string;
        let labelKey = generateTagKeyFromLabel(label);

        let existingTags = (await messenger.messages.listTags()).map(x => x.key)

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
        let requiredTags = messageLabelMap[message.headerMessageId] || [];
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