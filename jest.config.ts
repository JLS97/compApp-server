/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type {Config} from 'jest';

const config: Config = {
  transform: {
    '\\.[jt]sx?$': ['ts-jest', {useESM: true}],
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};

export default config;
