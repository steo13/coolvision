type Environment = {
    server: {
        scheme: string,
        host: string,
        port: string,
    },
};

const env: Environment = {
    server: {
        scheme: import.meta.env.VITE_SERVER_SCHEME || "http",
        host: import.meta.env.VITE_SERVER_HOST || "localhost",
        port: import.meta.env.VITE_SERVER_PORT || "3002",
    },
}

export default env;