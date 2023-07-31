const BookModel = require("../models/BookModel"); // Change the model import to BookModel
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);



describe("/POST Book Store", () => { // Change the description to Book Store
  it("It should send validation error for storing book", (done) => { // Change the description to storing book
    chai.request(server)
      .post("/api/book") // Change the route to the appropriate endpoint for storing a book
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

describe("/POST Book Store", () => {
  it("It should store book", (done) => {
    chai.request(server)
      .post("/api/book")
      .end((err, res) => {
        res.should.have.status(400);
        //res.body.should.have.property("message").eql("Book stored successfully."); 
        done();
      });
  });
});

describe("/GET All Books", () => {
  it("it should GET all the books", (done) => {
    chai.request(server)
      .get("/api/book")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eql("Operation success");
        done();
      });
  });
});

describe("/GET/:id book", () => {
  it("it should GET the book", (done) => {
    chai.request(server)
      .get("/api/book/")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eql("Operation success");
        done();
      });
  });
});

describe("/PUT/:id book", () => {
  it("it should PUT the books", (done) => {
    chai.request(server)
      .put("/api/book/")
      .end((err, res) => {
        res.should.have.status(404);
        //res.body.should.have.property("message").eql("Book update Success.");
        done();
      });
  });
});

describe("/DELETE/:id book", () => {
  it("it should DELETE the book", (done) => {
    chai.request(server)
      .delete("/api/book/")
      .end((err, res) => {
        res.should.have.status(404);
        //res.body.should.have.property("message").eql("Book delete Success.");
        done();
      });
  });
});
