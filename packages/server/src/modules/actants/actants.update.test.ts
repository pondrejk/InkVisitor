import "@modules/common.test";
import { BadParams } from "@common/errors";
import request from "supertest";
import { apiPath } from "../../common/constants";
import app from "../../Server";
import { supertestConfig } from "..";
import { Db } from "@service/RethinkDB";
import { createActant, findActantById } from "@service/shorthands";
import { IActant } from "@shared/types";

describe("Actants update", function () {
  describe("empty data", () => {
    it("should return a 400 code with BadParams error", (done) => {
      return request(app)
        .put(`${apiPath}/actants/update/1`)
        .set("authorization", "Bearer " + supertestConfig.token)
        .expect("Content-Type", /json/)
        .expect({ error: new BadParams("whatever").toString() })
        .expect(400, done);
    });
  });
  describe("faulty data ", () => {
    it("should return a 400 code with BadParams error", (done) => {
      return request(app)
        .put(`${apiPath}/actants/update/1`)
        .send({ test: "" })
        .set("authorization", "Bearer " + supertestConfig.token)
        .expect("Content-Type", /json/)
        .expect({ error: new BadParams("whatever").toString() })
        .expect(400, done);
    });
  });
  describe("ok data", () => {
    it("should return a 200 code with successful response", async (done) => {
      const db = new Db();
      await db.initDb();
      const testId = Math.random().toString();
      const changeClassInto = "T";
      await createActant(
        db,
        { id: testId, label: "", data: {}, class: "C" },
        true
      );

      request(app)
        .put(`${apiPath}/actants/update/${testId}`)
        .send({ class: changeClassInto })
        .set("authorization", "Bearer " + supertestConfig.token)
        .expect("Content-Type", /json/)
        .expect({ success: true })
        .expect(200, async () => {
          const changedEntry = await findActantById<IActant>(db, testId);
          changedEntry.class.should.eq(changeClassInto);
          done();
        });
    });
  });
});
