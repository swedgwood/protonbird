/*
    Definitions to allow typescript to compile, as the values are provided at runtime by Thunderbird
    This is by no means complete, just enough for Typescript's compiler to be happy with my code
*/

export declare class Messenger {
    accounts: AccountsApi;
    messages: MessagesApi;
}

export declare class AccountsApi {
    list(includeFolders?: boolean): MailAccount[];
    get(accountId: string, includeFolders?: boolean): MailAccount;
}

export declare class MessagesApi {
    list(folder: MailFolder): Promise<MessageList>;
    continueList(messageListId: string): Promise<MessageList>;
    update(messageId: number, newProperties: MessageChangeProperties): Promise<void>;
    listTags(): Promise<MessageTag[]>;
    createTag(key: string, tag: string, color: String): Promise<void>;
}

export declare class MailAccount {
    id: string;
    identities: any[];
    name: string;
    type: string;
    folders?: any[];
}

export declare class MailFolder {
    subFolders?: MailFolder[];
}

export declare class MessageList {
    messages: MessageHeader[];
    id?: string;
}

export declare class MessageHeader {
    author: string;
    bccList: string[];
    ccList: string[];
    date: Date;
    flagged: boolean;
    folder: MailFolder;
    headerMessageId: string;
    id: number;
    junk: boolean;
    junkScore: number;
    read: boolean;
    recipients: string[];
    size: number;
    subject: string;
    tags: string[];
}

export declare class MessageTag {
    color: string;
    key: string;
    ordinal: string;
    tag: string;
}

export class MessageChangeProperties { }