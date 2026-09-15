const http = require("http");

let server = http.createServer((req, res) => {

    if (req.url == "/")
        res.end("Welcome to Node Server");

    else if (req.url == "/about")
        res.end("About Page");

    else if (req.url == "/contact")
        res.end("Contact Page");

    else {
        res.statusCode = 404;
        res.end("404 Error");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});