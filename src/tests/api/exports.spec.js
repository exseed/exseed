import chai from 'chai';
const expect = chai.expect;

import { env } from '../../';

describe('exports', () => {
  it('should expose env', () => {
    expect(env).to.be.an('object');
    expect(env).to.have.property('NODE_ENV');
    expect(env).to.have.property('development');
    expect(env).to.have.property('test');
    expect(env).to.have.property('production');
    expect(env.NODE_ENV).to.be.an('string');
    expect(env.development).to.be.an('boolean');
    expect(env.test).to.be.an('boolean');
    expect(env.production).to.be.an('boolean');
  });
});