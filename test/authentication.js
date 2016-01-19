const should = require('chai').should;
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:8080');

describe('Authentication', function() {
	it('should return a 401 response in case of wrong login', function(done) {
		api.post('/login/')
		.set('Accept', 'application/json')
		.send({
			email: 'xx@g.com',
			password: 'xx'
		})
		.expect(401)
		.end(function(err, res) {
			if(err) return done(err);

			expect(res.body.message).to.equal('Login failed');
			done();
		});
	});
});