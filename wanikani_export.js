'use strict';

//
// Run
//   node wanikani_export.js <resource>
// where
//   resource = radical | kanji | vocabulary
// to create a <resource>.json file of all 50 levels for that resource
//

var MAX_REQUESTS = 5;

var async = require('async');
var fs = require('fs');
var os = require('os');
var request = require('request');
var util = require('util');
var _ = require('underscore');

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var USER_API_KEY;
try {
    USER_API_KEY = fs.readFileSync('./user_api_key.txt');
}
catch (error) {
    console.log(error.message);
    console.log("Ensure you have created the user_api_key.txt file with the correct values as per the README.md");
    process.exit(1);
}

var base_url = 'https://www.wanikani.com/api/user/' + USER_API_KEY + '/';
var resourceTemplate = _.template(base_url + '/{{resource}}/{{resource_level}}');

var makeResource = function (name, max_level, blacklist_keys) {
    return function (callback) {
        var resources =
            _.range(1, max_level+1)
            .map(function (level) {
                return resourceTemplate({resource: name, resource_level: level});
            });
        async.mapLimit(resources, MAX_REQUESTS, request, function(error, responses) {
            if (error) {
                return callback(error);
            }
            
            var notOk = _.filter(responses, function (response) {
                return response.statusCode !== 200;
            });
            
            if (notOk.length) {
                return callback(_.reduce(notOk, function (memo, response) {
                    return memo + os.EOL + 'Request returned response statusCode=' + response.statusCode;
                }, ""));
            }

            var results =  _.chain(responses)
                .map(function(response) {
                    var json = JSON.parse(response.body);
                    var requestedInformation = json.requested_information;
                    var a = _(requestedInformation).map(function (o) {
                        return _.omit(o, blacklist_keys);
                    });
                    return a;
                })
                .flatten()
                .value();

            var filename = name + '.json';
            fs.writeFile(filename, JSON.stringify(results), function (error) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, filename);
                }
            });
        });
    };
};

var args = process.argv.slice(2);
if (args.length != 1) {
    console.log(process.argv[1] + " <resource> - where resource should be one of radical, kanji, vocabulary");
    process.exit(1);
}

var resource = makeResource(args[0], 50, ['user_specific']);
resource(function (error, results) {
    if (error) {
        console.log("ERROR: " + error);
    }
    else {
        console.log("Exported file to " + results);
    }
});
