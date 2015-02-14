var addresses = require('./controllers/addresses');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home');
    });
    app.post('/validate', addresses.verifyAddress);
};