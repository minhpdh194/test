/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  preset: 'ts-jest',           // Use ts-jest to handle TypeScript
  testEnvironment: "node",
  moduleFileExtensions: ['ts', 'js'], // Allow TypeScript and JavaScript
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};