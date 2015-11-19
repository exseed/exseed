import chai from 'chai';
import request from 'superagent';
import settings from '../../settings.server';

const expect = chai.expect;
const base = 'http://localhost:' + settings.server.port.test;

describe('exseed.contrib.user', () => {
  describe('#routes', () => {
    const paths = [
      '/api/user/1',
      '/api/user/2',
      '/api/user/3',
      '/api/role/root',
      '/api/role/admin',
      '/api/role/user',
      '/api/permission',
    ];

    paths.forEach((path) => {
      it(`should respond 200 to GET ${path}`, function(done) {
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