export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    coveragePathIgnorePatterns: ["/node_modules/"],
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};
