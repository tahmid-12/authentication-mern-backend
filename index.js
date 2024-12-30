import express from "express";

const app = express();

app.get('/',(req,res) => {
    res.send("runninf at port 3000 fhfhf");
})

app.listen(3000, () => {
    console.log("App is running at port 3000");
});