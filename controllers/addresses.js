var address = require('../models/address');
module.exports.verifyAddress = function(req, res) {
    address.get(req.body, function(err, message) {
        if (err) {
            res.render('error', {error: err.toString()});
        } else {
            res.render('success', {address: JSON.stringify(message.Address, null, "\t")});
        }
    });
};