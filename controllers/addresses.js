var address = require('../models/address');

module.exports.verifyAddress = function(req, res) {
    //err when form does not follow rules
    //apiErr when address is not valid
    address.getNormalAddress(req.body, function(err, apiErr, message) {
        if (err) {
            res.render('error', {error: err.toString()});
        } else if (apiErr) {
            res.render('invalid-address', {error: apiErr.Messages[0].Summary});
        } else {
            res.render('success', {address: JSON.stringify(message.Address, null, "\t")});
        }
    });
};