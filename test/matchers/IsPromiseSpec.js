'use strict';

var q = require('q');
var IsPromise = require('../../lib/matchers/IsPromise');
var Description = require('../../lib/Description');
var __ = require('../../lib/hamjest');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsPromise', function () {

	describe('promise', function () {
		var promise = IsPromise.promise;

		describe('without argument', function () {
			var sut;
			beforeEach(function () {
				sut = promise();
			});

			it('should match fulfilled promises', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(sut.matches(aFulfilledPromise));
			});

			it('should match rejected promises', function () {
				var aRejectedPromise = q.reject('rejected for a reason');

				assertTrue(sut.matches(aRejectedPromise));
			});

			it('should match pending promises', function () {
				var aPendingPromise = q.defer().promise;

				assertTrue(sut.matches(aPendingPromise));
			});

			it('should not match values ', function () {
				var aValue = 'a value';

				assertFalse(sut.matches(aValue));
			});

			it('should describe nicely', function () {
				var description = new Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a promise'));
			});
		});
	});
});
