/**
 * CucumberJS config (TypeScript)
 * Run: npm run bdd
 */
module.exports = {
  default: {
    paths: ['bdd/features/**/*.feature'],
    require: ['bdd/steps/**/*.ts', 'bdd/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress'],
    publishQuiet: true,
  },
};
