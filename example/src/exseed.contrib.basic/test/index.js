import chai from 'chai';
import request from 'superagent';
import path from 'path';
import fs from 'fs';
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

  describe('#static files', () => {
    const staticFiles = [
      {url: '/basic/caffeine.png', filePath: '../public/caffeine.png'},
      {url: '/basic/favicon.ico', filePath: '../public/favicon.ico'},
    ];

    staticFiles.forEach((staticFile) => {
      it(`should serve static file ${staticFile.filePath}`, (done) => {
        fs.readFile(
          path.join(__dirname, staticFile.filePath),
          (err, fileBuffer) => {
            if (err) {
              throw err;
            }
            request
              .get(base + staticFile.url)
              .end((err, res) => {
                expect(res).to.not.be.undefined;
                expect(res.status).to.equal(200);
                expect(res.body.toString()).to.equal(fileBuffer.toString());
                done();
              });
          }
        );
      });
    });
  });
});