//DummyTest.ts
import supertest = require('supertest');
require("sails-test-helper");

import should = require('should');

import DefaultDBCollectionsImport = require('../../db-initializers/DefaultDBCollections');
import DefaultDBCollections = DefaultDBCollectionsImport.DefaultDBCollections;

describe("Booking Flow", function() {
    var defaultDBCollections = new DefaultDBCollections();
    
    before(function(done : any) {
        defaultDBCollections.loadCollections().then((result: any)=>{
            done();
        }).catch((err:Error)=> {
            done(err.message);
        });
    });

    describe("Dummy tests", function() {
        it("should be true", function(done) {
            should.equal(2, 2);
			done();
        });
		it("should be true", function(done) {
            should.equal(2, 2);
			done();
        });
    });
});