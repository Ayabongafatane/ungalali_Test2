const querystring = require('querystring');
const http = require("http");
const fs = require("fs");


//creating the server
http.createServer((req, res) => {

    //displaying the html form
    if(req.method === "GET"){
        //reading html file
        fs.readFile("protectaccess.html",(err, data) => {

            res.writeHead(200, {"content-Type": "text/html"});
            res.write(data);
            res.end();

        });
         
    }
    //when form is submitted
        else if (req.method === "POST") {
            let body = "";

            // getting form data
            req.on("data", chunk =>  {
                body += chunk.toString();
            });
            req.on("end", () => {

                //converting form data
                const formData= querystring.parse(body);

                //store values
                let name = formData.name || "";
                let password = formData.pw || "";
                let id = formData.IDnumber || "";

                // Name:
            // must not be empty
            // must not contain numbers only
            let validName = /[A-Za-z]/.test(name);

            //password
            let validPassword = /^(?=.*[A-Za-z])(?=.*\d).{10,}$/.test(password);

            //IDnumber
            let validID = /^\d{3}-?\d{3}-?\d{3}-?\d{3}$/.test(id);

            //check if all valid
            let success = validName && validPassword && validID;
            //replace password with *
            let hiddenPassword = password.replace(/./g, "*");

            //remove dashes and dots
            let cleanID = id.replace(/[-.]/g, "");

            //reading the file 
            fs.readFile("accessresults.txt", "utf8", (err, fileData) => {
                 if (err) {
                     console.log(err);
                 }
                   
                  
                res.writeHead(200, {"Content-Type": "text/html"});

                //Displaying the file content
                res.write("<h2>" + fileData + "</h2>");

                //if successful
                if(success){
                    res.write(
                        "<h1 style= 'color:green;'>Successful</h1>"
                    );

                }
                //display user details
                res.write(
                    "<p>" +
                    name + "," +
                    hiddenPassword + "," +
                    cleanID +
                    "</p>"

                );
                res.end();
            

            })

        
           })
        }
}).listen(3000);

console.log("Server running on http://localhost:3000")