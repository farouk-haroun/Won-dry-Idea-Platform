import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// Use chaiHttp in chai
chai.use(chaiHttp);

// Initialize chai's `should`
const should = chai.should();

// Ensure that the tests use the test environment
process.env.NODE_ENV = 'test';

describe('Users', () => {
  
  // Connect to the database before running any tests
  before(async function() {
    this.timeout(10000); // Increase timeout to ensure Mongoose connection completes
    try {
      await mongoose.connect(process.env.MONGO_URI_TEST);
    } catch (err) {
      console.error('Error connecting to the test database:', err);
    }
  });

  // Before each test that needs an empty database, clear the User collection
  describe('Tests that need an empty database', () => {
    beforeEach(async function() {
      this.timeout(5000); // Set timeout to 5000ms to avoid timeout issues
      try {
        await User.deleteMany();  // Clear the User collection only before certain tests
      } catch (err) {
        console.error(err);
      }
    });

    /**
     * Test the POST /api/users/register route
     */
    describe('/POST register user', () => {
      it('it should register a new user', function(done) {
        this.timeout(5000); // Increase timeout for async operations
        let user = {
          name: "John Doe",
          email: "johndo@example.com",
          password: "password123"
        };
        chai.request(app)
          .post('/api/users/register')
          .send(user)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User registered successfully');
            res.body.user.should.have.property('name').eql('John Doe');
            res.body.user.should.have.property('email').eql('johndo@example.com');
            done();
          });
      });
    });

    /**
     * Test the GET /api/users route
     */
    describe('/GET users', () => {
      it('it should GET all the users', (done) => {
        chai.request(app)
          .get('/api/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);  // Initially, the DB is empty
            done();
          });
      });
    });
  });

  // Tests that require existing users
  describe('Tests that require existing users', () => {
    // Insert a user before running tests that require an existing user
    let testUser;
    beforeEach(async function() {
      this.timeout(5000);
      // Add a user before these specific tests
      testUser = new User({ name: "Jane Doe", email: "janedoe@example.com", password: "password123" });
      await testUser.save();
    });

    /**
     * Test the GET /api/users/:id route
     */
    describe('/GET/:id user', () => {
      it('it should GET a user by the given id', (done) => {
        chai.request(app)
          .get('/api/users/' + testUser.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Jane Doe');
            res.body.should.have.property('email').eql('janedoe@example.com');
            done();
          });
      });
    });

    /**
     * Test the DELETE /api/users/:id route
     */
    describe('/DELETE/:id user', () => {
      it('it should DELETE a user given the id', (done) => {
        chai.request(app)
          .delete('/api/users/' + testUser.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message').eql('User deleted successfully');
            done();
          });
      });
    });
  });

  // Close the Mongoose connection after all tests
  after(async function() {
    await mongoose.connection.close();
  });

});
