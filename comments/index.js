const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");


const app = express();
app.use(bodyParser.json());

const commentsByPostId = {}

app.get("/posts/:id/comments", (req, res) => {
    //send comment for the particular post
    res.send(commentsByPostId[req.params.id] || []);
});


app.post("/posts/:id/comments", (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;

    //locate the post by id
    const comments = commentsByPostId[req.params.id] || [];

    //push comment to post
    comments.push({ id: commentId, content });

    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments)
});


app.listen("4001", () => {
    console.log("Listening on 4001");
})