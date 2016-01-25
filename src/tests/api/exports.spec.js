import chai from 'chai';
const expect = chai.expect;

import { env, Err, models } from '../../';

describe('exports', () => {
  it('should expose env', () => {
    expect(env).to.not.be.an('undefined');
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

  it('should expose Err', () => {
    expect(Err).to.not.be.an('undefined');
    expect(Err).to.be.an('function');
  });

  it('should expose models', () => {
    expect(models).to.not.be.an('undefined');
    expect(models).to.be.an('object');
  });
});