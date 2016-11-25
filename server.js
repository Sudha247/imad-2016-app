var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  user: 'sudha247',
  database: 'sudha247',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomValue',
    cookie: {
        maxAge: 1000*60*60*24*30
    }
}));


function createTemplate(data){
	var title = data.title;
	var heading = data.heading;
	var date = data.date;
	var content = data.content;
var HtmlTemplate = `<!DOCTYPE html>
<html>
    <head>
        <title>
            ${title}
        </title>
    <link href="/ui/style.css" rel="stylesheet" /
    
     </head>
    <body>
        
    <div class="container">   
        <div>
            <a href = "/">Home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
            ${date.toDateString()}
        </div>
        <div>
            ${content}
        </div>
        </div> 
    </body>
</html>` ;
return HtmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db', function(req, res){
    //make a select statement and return a response
    pool.query('SELECT * FROM articles', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
    
});

app.get('/rpsls', function(req, res){
    res.sendFile(path.join(__dirname, 'ui/rpsls', 'rpsls.html'));
});

app.get('/mccarthy', function(req, res){
    res.sendFile(path.join(__dirname, 'ui/misc', 'tribute.html'));
});

function hash(input, salt){
    
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
    
}

app.get('/hash/:input',function(req, res){
    var hashedString = hash(req.params.input, 'this-is-a-random-string');
    res.send(hashedString);
});

app.post('/create-user', function(req, res){
    //{"username": "sudha", "password": "password"}
    
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    
    pool.query('INSERT INTO "user" (username, password) values ($1, $2)', [username, dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send('User successfully created: ' + username);
        }
    });
});

app.post('/login', function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length === 0){
                res.status(403).send('Username or password does not exist!');
            }
            else{
                
            var dbString = result.rows[0].password;
            var salt = dbString.split('$')[2];
            var hashedPassword = hash(password, salt);
            if(hashedPassword === dbString ){
                
                //Set the session
                
                req.session.auth = {userid: result.rows[0].id};
                
                
                res.send('Credentials are correct!');
            } else{
                 res.status(403).send('Username or password does not exist!');
            }
            //res.send('User successfully created: ' + username);
            }
        }
    });
});

/*app.get('/check-login', function(req, res){
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in: '+req.seeion.auth.userId.toString());
   } 
   
   else{
       res.send('You are not logged in!');
   }
});*/
app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

/*app.get('/articles/:articleName', function(req, res){
    //articleName == article-one
    var articleName = req.params.articleName;
    
    //var articleData = 
    pool.query("SELECT * FROM articles WHERE title = ' " + req.params.articleName + "'", function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }  else{
            if(result.rows.length === 0){
                res.status(404).send('Article Not Found');
                
            }  else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
    
}); */

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM articles WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});



/*app.get('/article-one',function(reg,res){
   //res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
   res.send(createTemplate(articles.articleOne));
});
app.get('/article-two',function(reg,res){
   //res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
   res.send(createTemplate(articles.articleTwo));
});
app.get('/article-three',function(reg,res){
   //res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
   res.send(createTemplate(articles.articleThree));
});*/



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
