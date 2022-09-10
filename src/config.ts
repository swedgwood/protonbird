import { Messenger } from "./mailextensions";

declare var messenger: Messenger;

function hasProp<T extends string>(obj: object, prop: T): obj is { [K in T]: unknown } {
    return prop in obj;
}

export class Config {
    public protonAccountIds: string[] = [];
    public protonAccounts: Record<string, object> = {};

    private constructor() { };

    public static async read(): Promise<Config> {
        let config = new Config();

        let rawConfig = await messenger.storage.local.get({
            protonAccountIds: [],
            protonAccounts: {},
        });

        if (rawConfig.protonAccountIds instanceof Array) {
            for (let protonAccountId of rawConfig.protonAccountIds) {
                if (typeof protonAccountId == "string") {
                    config.protonAccountIds.push(protonAccountId);
                } else {
                    console.error("Invalid config: non-string found in protonAccountIds");
                }
            }
        } else {
            console.error("Invalid config: protonAccountIds not an array");
        }

        return config;
    }

    public async write() {
        await messenger.storage.local.set({
            protonAccountIds: this.protonAccountIds,
            protonAccounts: this.protonAccounts,
        });
    }

    public addProtonAccountId(accountId: string) {
        if (!this.protonAccountIds.includes(accountId)) {
            this.protonAccountIds.push(accountId);
        }
    }

    public removeProtonAccountId(accountId: string) {
        let newList = [];

        for (let id of this.protonAccountIds) {
            if (id !== accountId) {
                newList.push(id);
            }
        }

        this.protonAccountIds = newList;
    }
}
