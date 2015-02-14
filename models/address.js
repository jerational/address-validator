/**
 * Created by jerational on 2/13/15.
 */
var request = require('request'),
    rules = require('./form-rules'),
    query = require('querystring'),
    url = require('url');


module.exports.getNormalAddress = function(rawAddress, callback) {
    var queryObj = createQuery(rawAddress),
        isValid = isFormValid(queryObj);

    if (isValid) {
        callback(isValid)
    } else {
        request(buildURL(queryObj), function(err, response, body) {
            if (err) {
                console.log(err);                               //Usually different log
                callback(new Error("Internal Service Error"));  //in case error is internal
            } else {
                parseResponse(body, callback);
            }
        });
    }
};

function buildURL(queryObj) {
    var urlObj = require('./config');
    urlObj.search = '?' + query.stringify(queryObj);
    return url.format(urlObj);
}

function createQuery(rawAddress) {
    var queryObj = {};
    var params = Object.keys(rules);
    params.forEach(function(key) {
        rawKey = rules[key].name;
        queryObj[key] = rawAddress[rawKey]
    });
    return queryObj;
}

//Needs to be built out
function parseResponse(message, callback) {
    message = JSON.parse(message);
    console.log(message);
    if (message.ResultCode === "Success") {
        callback(null, null, message);
    } else {
        callback(null, message);
    }
}

function isFormValid(queryObj) {
    var keys = Object.keys(rules);
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!queryObj[key] && rules[key].required) {
            return new Error("Missing required field: " + rules[key].name);
        } else if (!queryObj[key] && !validateOptionalAll(queryObj, key)) {
            return new Error("Missing either " + rules[key].name + "or both of these :" + rules[key].optionalAll.toString());
        } else if (!queryObj[key] && !validateOptionalOr(queryObj, key)) {
            return new Error("Missing either " + rules[key].name + " or " + rules[key].optionalOr.toString());
        } else if (queryObj[key] && !validateLength(queryObj[key], key)) {
            return new Error("Field is too long: " + rules[key].name);
        }
    }

    return null;
}

function validateLength(field, key) {
    if (!(typeof field === 'string')){
        return false;
    }

    return (field.length <= rules[key].limit);
}

//Can be consolidated into one method
function validateOptionalAll(queryObj, key) {
    var optAll = rules[key].optionalAll;
    if (optAll.length === 0) {
        return true;
    }

    for (var i = 0; i < optAll.length; i++) {
        var curr = optAll[i];
        if (!(queryObj[curr] && validateLength(queryObj[curr], curr))) {
            return false;
        }
    }

    return true;
}

function validateOptionalOr(queryObj, key) {
    var optOr = rules[key].optionalOr;
    if (optOr.length === 0) {
        return true;
    }

    for (var i = 0; i < optOr.length; i++) {
        var curr = optOr[i];
        if (queryObj[curr] && validateLength(queryObj[curr], curr)) {
            return true;
        }
    }

    return false;
}
