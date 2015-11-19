import chai from 'chai';
import request from 'superagent';
import settings from '../../settings.server';

const expect = chai.expect;
const base = 'http://localhost:' + settings.server.port.test;

describe('exseed.contrib.basic', () => {
  describe('#routes', () => {
    const paths = [
      '/',
      '/about',
    ];

    paths.forEach((path) => {
      it(`should respond 200 to GET ${path}`, (done) => {
        request
          .get(base + path)
          .end((err, res) => {
            expect(res).to.not.be.undefined;
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
  });
});