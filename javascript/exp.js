const express = require('express');
const app = express();

app.get("/", function(req, res)
{
    res.send("champion mera anuj ")
})

app.get("/profile", function(req, res)
{
    res.send("my name")
})
app.listen(3000)