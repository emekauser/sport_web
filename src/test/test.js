//dependencies
const expect = require("chai").expect;
const request = require("supertest");

const router = require("../routers/user");
const db = require("../db/db");
const mongoose = require("mongoose");
// unit testing of end point of user API
describe("POST/users", () => {
  before(done => {
    mongoose
      .connect("mongodb://localhost:27017/testdatabase", {
        useNewUrlParser: true,
        useCreateIndex: true
      })
      .then(() => done())
      .catch(err => done(err));
  });

  after(done => {
    db.close()
      .then(() => done())
      .catch(err => done(err));
  });
  it("Ok, creating users works", done => {
    request(router)
      .post("/users")
      .send({
        name: "john doe",
        password: "john12345",
        email: "example@gmail.com"
      })
      .then(res => {
        const body = req.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("password");
        expect(body).to.contain.property("email");
        expect(body).to.contain.property("token");
        done();
      })
      .catch(err => done(err));
  });
});
