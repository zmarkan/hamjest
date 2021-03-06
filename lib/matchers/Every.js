'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');
const acceptingMatcher = require('../utils/acceptingMatcher');
const promiseAgnostic = require('./promiseAgnostic');

const Every = acceptingMatcher((matcher) => {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual) || _.isObject(actual);
		},
		matchesSafely: function (actual) {
			const results = _.map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description
				.append('every item is ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			let results;
			if (_.isArray(actual)) {
				results  = _.map(actual, (value) => {
					return matcher.matches(value);
				});
			}
			else {
				results  = _.mapValues(actual, (value) => {
					return matcher.matches(value);
				});
			}

			let first = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, key) => {
				if (result) {
					return;
				}

				if (!first) {
					description.append(', ');
				}
				first = false;
				description.append('item ').appendValue(key).append(' ');
				matcher.describeMismatch(actual[key], description);
			});
		}
	});
});

Every.everyItem = function (matcherOrValue) {
	return new Every(matcherOrValue);
};

module.exports = Every;
