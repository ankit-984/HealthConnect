const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const baseURL = 'http://localhost:3001';

describe('HealthConnect API Tests', () => {
  // User details for testing
  const testUserEmail = 'sarthak48@gmail.com';
  const testUserPassword = 'Sarthak1!@#';
  const cont = '6738485709';
  const usert = "Test_USEr"
  let testUserToken;

  //--- User API Tests ---

  // Test 1: Signup a new user
  it('Test 1: should signup a new user and return a token', (done) => {
    request(baseURL)
      .post('/api/user/signup')
      .send({
        email: testUserEmail,
        password: testUserPassword,
        username: usert,
        role: 'Patient',
        expertise: 'N/A',
        contact: cont,
      })
      .end((err, res) => {
        if (err) return done(err);
        // console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('email', testUserEmail);
        testUserToken = res.body.token; // Save token for later tests
        done();
      });
  });

  // Test 2: Login with the created user
  it('Test 2: should login the user and return a token', (done) => {
    request(baseURL)
      .post('/api/user/login')
      .send({
        email: testUserEmail,
        password: testUserPassword
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('email', testUserEmail);
        testUserToken = res.body.token;
        done();
      });
  });

  // Test 3: Login with invalid credentials
  it('Test 3: should return an error for invalid login credentials', (done) => {
    request(baseURL)
      .post('/api/user/login')
      .send({
        email: 'invalid@example.com',
        password: 'WrongPassword'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  // Test 4: Delete the created user


  it('Test 4: should return an error for a duplicate signup', (done) => {
    request(baseURL)
      .post('/api/user/signup')
      .send({
        email: testUserEmail,
        password: testUserPassword,
        username: usert,
        role: 'Patient',
        expertise: 'N/A',
        contact: cont,            // using same contact from Test 1
      })
      .end((err, res) => {
        // console.log(res.body);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  // Test 5: Delete a non-existing user
  it('Test 5: should return an error when deleting a non-existing user', (done) => {
    request(baseURL)
      .post('/api/user/delete')
      .send({
        email: 'nonexistent@example.com'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  // Test 6: Signup with missing required fields
  it('Test 6: should return an error for missing fields during signup', (done) => {
    request(baseURL)
      .post('/api/user/signup')
      .send({
        email: 'incomplete@example.com',
        password: 'Incomplete@123'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  // Test 7: Login with missing fields
  it('Test 7: should return an error for missing fields during login', (done) => {
    request(baseURL)
      .post('/api/user/login')
      .send({
        email: '',
        password: ''
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  //--- Other API Tests ---

  // Test 8: GET /api/news to fetch news articles
  it('Test 8: should fetch news articles successfully', (done) => {
    request(baseURL)
      .get('/api/news/search/?q=Medical')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        // Adjust expectation based on your actual API response
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // Test 9: GET /api/nutrition for a food item (e.g., apple)
  it('Test 9: should fetch nutrition details for a food item', (done) => {
    request(baseURL)
      .post('/api/nutrition/')
      .send({
        foodQuery: 'apple'
      })
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        // console.log(res.body);

        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('foods').that.is.an('array');
        done();
      });
  });

  // Test 10: GET /api/nearby to fetch nearby hospitals with valid pin code
  it('Test 10: should fetch nearby hospitals', (done) => {
    const testLat = 19.152896;
    const testLong = 72.8727552;
    const testPincode = '400019';
    const testQuery = 'Hospitals';

    request(baseURL)
      .get(`/api/nearby/?latitude=${testLat}&longitude=${testLong}&query=${testQuery}&pincode=${testPincode}`)
      .end((err, res) => {
        if (err) return done(err);
        // console.log('Query Parameters:', {
        //   latitude: testLat,
        //   longitude: testLong,
        //   query: testQuery,
        //   pincode: testPincode
        // });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('results');
        expect(res.body.results).to.be.an('array');
        done();
      });
  });


  // Test 11: POST /appointmentinfo/create to create a new appointment
  // Test 11: POST /appointmentinfo/appointmentData to create a new appointment
  it('Test 11: should create a new appointment', (done) => {
    const appointmentData = {
      Name: "Fever and Cold",           // issue/name of appointment
      date: new Date("2025-04-15").toISOString(),
      time: "9:00 Am to 12:00 Pm",      // matching the slots from frontend
      PName: "Test Patient",            // patient name
      Drname: "Dr. Smith"               // doctor name
    };

    request(baseURL)
      .post('/appointmentinfo/appointmentData')
      .send(appointmentData)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('statusCode', 200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('Name', appointmentData.Name);
        expect(res.body.data).to.have.property('slot', appointmentData.time);
        expect(res.body.data).to.have.property('PName', appointmentData.PName);
        expect(res.body.data).to.have.property('Drname', appointmentData.Drname);
        expect(res.body.data).to.have.property('stat', 'Pending');
        done();
      });
  });



  // Test 12: Attempt to signup with an email that already exists (expect error)
  it('Test 12: should delete the user and return success', (done) => {
    request(baseURL)
      .post('/api/user/delete')
      .send({
        email: testUserEmail
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('email', testUserEmail);
        done();
      });
  });
 
  // Test 13: Attempt to create an appointment with missing required fields
  it('Test 13: should return an error for creating an appointment with missing fields', (done) => {
    request(baseURL)
      .post('/appointmentinfo/appointmentData')
      .send({
        // Missing required fields
        Name: '',           // missing issue/name
        date: '2025-04-16',
        time: '11:00 AM',
        PName: '',          // missing patient name
        Drname: 'Dr. Who'   // doctor name
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('statusCode', 400);
        expect(res.body).to.have.property('message', 'Missing required fields in the request body');
        done();
      });
  });

  // Test 14: Access an unknown route to confirm 404 response
  it('Test 14: should return 404 for an unknown route', (done) => {
    request(baseURL)
      .get('/api/unknown')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});