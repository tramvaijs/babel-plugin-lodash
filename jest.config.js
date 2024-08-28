/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  transform: {
    "^.+.ts$": "ts-jest",
  },
};

export default config;
