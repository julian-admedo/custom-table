
var express = require('express');        // call express
var app = express();

var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('client'));

app.put("/contact", function (req, res) {
    
    var contact = req.body;
    
    
    var transporter = nodemailer.createTransport(smtpTransport())
    
    var mailOptions = {
        from: 'Visual Systems <contact@visualsystems.org>', // sender address
        to: 'Julian Woodward, jw@vsys.co.uk', // list of receivers
        subject: 'New contact', // Subject line
        text: JSON.stringify(contact) // plaintext body
	//	html: '<b>Hello world ✔</b>' // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        
        if (error) {
            res.status(500).json({ error: error, info: info });
        }
        else {
            res.sendStatus(200);
        }
		

    });

});



app.get('*', function (req, res) {
    res.sendFile('client/index.html', { root: __dirname });
   // res.render('client/index.html');
});

var port = process.env.PORT || 8080;


app.listen(port);
console.log('Magic happens on port ' + port);