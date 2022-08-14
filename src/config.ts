function hasProp<T extends string>(obj: object, prop: T): obj is { [K in T]: unknown } {
    return prop in obj;
}

export class Config {
    public protonAccountIds: string[] = [];

    private constructor() { };

    public static read(): Config {
        let rawConfigString: string = window.localStorage.getItem("config") || "";
        let rawConfigObject: unknown;

        let config = new Config();


        try {
            rawConfigObject = JSON.parse(rawConfigString);
        } catch (SyntaxError) {
            rawConfigObject = {};
        }


        if (typeof rawConfigObject == "object" && rawConfigObject !== null) {
            if (hasProp(rawConfigObject, "protonAccountIds")) {
                let protonAccountIds = rawConfigObject["protonAccountIds"];
                if (protonAccountIds instanceof Array) {
                    for (let accountId of protonAccountIds) {
                        if (typeof accountId === 'string') {
                            config.protonAccountIds.push(accountId);
                        }
                    }
                }
            }
        }

        return config;
    }

    public write() {
        window.localStorage.setItem("config", JSON.stringify(this));
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
