const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const pdf = require("html-pdf");
const port = process.env.PORT || 3000;

const fs = require('fs');

app.use(express.json());


let students = [
    {name: "Joy",
     email: "joy@example.com",
     city: "New York",
     country: "USA"},
    {name: "John",
     email: "John@example.com",
     city: "San Francisco",
     country: "USA"},
    {name: "Clark",
     email: "Clark@example.com",
     city: "Seattle",
     country: "USA"},
    {name: "Watson",
     email: "Watson@example.com",
     city: "Boston",
     country: "USA"},
    {name: "Tony",
     email: "Tony@example.com",
     city: "Los Angels",
     country: "USA"
 }];

 let users = ['geddy', 'neil', 'alex'];

// Set EJS as templating engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('pages/home', {
        users : users,
        title : "Ejs Home"
	});
});

app.get('/home', (req, res) => {
	res.render('pages/home', {
        users : users,
        title : "Ejs Home"
	});
});

app.get('/about', (req, res) => {
    console.log('__dirname', __dirname);
	res.render('pages/about', {
        users : users,
        title : "Ejs About"
	});
});

app.get('/hello', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});


app.post('/api/generate-pdf', (req, res) => {
    console.log("$$req", req.body);
    // console.log('__dirname', __dirname);
    // console.log('path', path.join(__dirname, './views/', 'pages/report-template.ejs'));
    if(Array.isArray(req.body)) {
        students = req.body;
    }

    ejs.renderFile(path.join(__dirname, './views/', 'pages/report-template.ejs'), {
        students: students
	}, (err, data) => {
        if(err) {
            console.log(err);
        }
        else {
            //res.send('pages/home');
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile("report.pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    //const file = fs.createWriteStream("./report.pdf");
                    //res.download('report.pdf');
                    //res.send("File created successfully");

                    //download file
                    //res.download('report.pdf');

                    //send file
                    var fileName = path.join(__dirname, '/report.pdf'); 
                    console.log("fileName", fileName);
                    res.sendFile(fileName, options, function (err) { 
                        if (err) { 
                            next(err); 
                        } else { 
                            console.log('Sent:', fileName); 
                        } 
                    }); 
                }
            });
        }
        
    });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
