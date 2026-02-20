import { loadEnv } from 'vite';
process.env.TEST_VAR = 'hello';
const env = loadEnv('production', process.cwd(), '');
console.log('loadEnvTEST_VAR:', env.TEST_VAR);
console.log('process.env.TEST_VAR:', process.env.TEST_VAR);
