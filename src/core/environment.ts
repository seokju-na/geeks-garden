const pkg = require('../package.json') as { name: string; version: string };

class Environment {
  readonly serviceName = pkg.name;
  readonly version = pkg.version;
  readonly production = process.env.NODE_ENV === 'production';

  getSentryDsn() {
    if (this.production) {
      return '';
    }
    return '';
  }
}

export const environment = new Environment();
