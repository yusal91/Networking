const http = require('http');
const fs = require('fs');
const path = require('path');

let position = {juma: {x:-8, y:-2, z: 0},                     // set position for the unity character movement.
                monk: {x:-7, y:-1, z: 0}};  

function v3add(v1, v2)
{
    return{x: v1.x + v2.x,
           y: v1.y + v2.y, 
           z: v1.z + v2.z};
}   

// turns a vector into something like {x:1, y:0, z:0}
function v3_4way(v)
{
    if(v.x !== 0)
    {
        return{
            x: v.x / Math.abs(v.x),
            y:0,
            z:0};
    }
    else if(v.y !== 0)
    {
        return{
            x:0,
            y: v.y / Math.abs(v.y),
            z:0};
    }
    else 
    {
        return{
            x:0,
            y:0,
            z:0};
    }
}

function v3eq (v1, v2){
  return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
}

function responsFunc(request, response)                                    // request lets user requests and respone gives answer or something in webside or http server instead
{
    let parts = request.url.split("/").filter(x => x !== '');
 
    switch (parts[0])
    {
        case 'positions':
            let username =parts[1];

            setTimeout(() => {  
                  response.writeHead(200, {'Content-type': 'application /json'});
                  response.end(JSON.stringify(position[username]), 'utf-8');
            }, 300);
            break;
        case 'set-positions':                                          // its either positions or position
            let data ='';
            request.on('data', chunk => {
            data += chunk;    
            console.log("got chunk:", decodeURIComponent(data));
            });

            request.on('end', () =>
            {     
                let username = parts[1];
                
                let movement = JSON.parse(decodeURIComponent(data));
                console.log(movement);
                movement.direction = v3_4way(movement.direction);

                setTimeout(() => {    
                  if(v3eq (movement.current_pos, position[username])){
                           position[username] = v3add(position[username], movement.direction);
                  }                    

                console.log('user', username, "Got new Pos", position[username]);
                response.writeHead(200);
                response.end("nice");
              }, 300);
            });
            
            break;
        default:
            response.writeHead(404);
            response.end(`Your request  ${request.url} didnt match any operations.`, 'utf-8');
    }   
}


let server = http.createServer(responsFunc);

server.listen(8125);

console.log('Server running a "Server": http://127.0.0.1:8125/');