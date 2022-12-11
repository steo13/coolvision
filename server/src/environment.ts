import dotenv from 'dotenv';

dotenv.config();

type Environment = {
    serverPort: string,
    app: {
        scheme: string,
        host: string,
        port: string,
    },
    mongodb: {
        host: string,
        port: string,
        user: string,
        password: string,
        databaseName: string,
    },
    google: {
        clientID: string,
        clientSecret: string,
    },
    external: {
        intranetToken: string,
        jira: {
            host: string,
            oauth: {
                consumerKey: string,
                consumerSecret: string,
                accessToken: string,
                tokenSecret: string,
            },
        },
    },
};

const env: Environment = {
    serverPort: process.env.SERVER_PORT || "3002",
    app: {
        scheme: process.env.APP_SCHEME || "http",
        host: process.env.APP_HOST || "localhost",
        port: process.env.APP_PORT || "3000",
    },
    mongodb: {
        host: process.env.MONGO_HOST || "localhost",
        port: process.env.MONGO_PORT || "27017",
        user: process.env.MONGO_USER || "cool",
        password: process.env.MONGO_PASSWORD || "cool",
        databaseName: process.env.MONGO_DB || "admin",
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    external: {
        intranetToken: process.env.INTRANET_TOKEN || "",
        jira: {
            host: process.env.JIRA_HOST || "",
            oauth: {
                consumerKey: process.env.JIRA_CONSUMER_KEY || "",
                consumerSecret: process.env.JIRA_CONSUMER_SECRET || "",
                accessToken: process.env.JIRA_ACCESS_TOKEN || "",
                tokenSecret: process.env.JIRA_TOKEN_SECRET || "",
            },
        },
    }
}

export default env;