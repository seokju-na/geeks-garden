const pkg = require('../package.json') as { version: string };

class Environment {
  readonly version = pkg.version;
  readonly production = process.env.NODE_ENV === 'production';
}

export const environment = new Environment();
