/**
 * Created by jerational on 2/13/15.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 5000;

//setup
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//load routes
require("./routes")(app);

app.listen(port, function() {
    console.log("listening to port %s", port);
});