import { BadParams, UserDoesNotExits } from "@common/errors";
import * as chai from "chai";
import "mocha";
import request from "supertest";
import { apiPath } from "../../common/constants";
import app from "../../Server";

const should = chai.should();

describe("Users get", function () {
  describe("Empty param", () => {
    it("should return a 400 code with BadParams error", (done) => {
      return request(app)
        .get(`${apiPath}/users/get`)
        .expect({ error: new BadParams("whatever").toString() })
        .expect(400, done);
    });
  });
  describe("Wrong param", () => {
    it("should return a 400 code with UserDoesNotExits error", (done) => {
      return request(app)
        .get(`${apiPath}/users/get/123`)
        .expect({ error: new UserDoesNotExits("whatever").toString() })
        .expect(400, done);
    });
  });
  describe("Correct param", () => {
    it("should return a 200 code with user response", (done) => {
      return request(app)
        .get(`${apiPath}/users/get/1`)
        .expect((res) => {
          res.body.should.not.empty;
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.id.should.not.empty;
        })
        .expect(200, done);
    });
  });
});