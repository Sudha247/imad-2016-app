var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
 'article-one' : {
	title: 'Article One | Sudha',
	heading : 'Artile One',
	date: 'Nov 20, 2016',
	content:  ` <p>                                                                                                                                                                                                                                                                                                     
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
             <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
             <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p> `
            
},

 'article-two' : {
	title: 'Article Two | Sudha',
	heading: 'Article Two',
	date: 'Nov 20, 2016',
	content: `
      <p>Hi I am article two!</p>
	`
},

 'article-three' : {
	title: 'Article Three | Sudha',
	heading: 'Article Three',
	date: 'Nov 20, 2016',
	content: `
      <p>Hi I am article three!</p>
	`
}

};


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
            ${date}
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

/*app.get('/:articleName', function(req, res){
    //articleName == article-one
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});*/


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

app.get('/rpsls', function(req, res){
    res.send(path.join(__dirname,'ui/rpsls','rpsls.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
