
var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){
        if(request.readyState == XMLHttpRequest.DONE){
            if(request.status === 200){
                
                console.log('User logged in!');
                alert('logged in successfully');
                
                /*var names = request.responseText;
                names = JSON.parse(names);
                var list = '';
                for(var i = 0;i < names.length; i++){
                    list += '<li>' + names[i] + '</li>'; 
                }
                var ul = document.getElementById('namelist');
                ul.innerHTML = list;*/
            } 
            else if(request.status === 403){
                alert('Username or password is incorrect');
            }
            
            else if(req.status === 500){
                alert('Something went wrong on the server');
            }
        }
    };
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://sudha247.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
    
};
