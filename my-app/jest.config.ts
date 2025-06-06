module.exports = {
    preset: 'ts-jest',
    //testEnvironment: 'node',
    // transform: {
    //     "^.+\\.tsx?$": "ts-jest"
    // },
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
