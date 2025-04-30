module.exports = {
  env: {
    node: true,   // <-- this enables __dirname, require, module.exports, etc.
    es2021: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // add custom rules here
  }
};
