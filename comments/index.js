const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));

const commentsByPostId = {}

app.get("/posts/:id/comments", (req, res) => {
    //send comment for the particular post
    res.send(commentsByPostId[req.params.id] || []);
});


app.post("/posts/:id/comments", async (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;

    //locate the post by id
    const comments = commentsByPostId[req.params.id] || [];

    //push comment to post
    comments.push({ id: commentId, content });

    commentsByPostId[req.params.id] = comments;

    //emmet event after post creation
    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId, 
            content,
            postId: req.params.id
        }
    })

    res.status(201).send(comments)
});


//event handler
app.post("/events", async (req, res) => {
    console.log("Recieved Event", req.body.type);

    const { type, data } = req.body;

    if (type === "CommentModerated") {
        const { id, postId, status, content } = data;

        //get all comments from the particular post
        const comments = commentsByPostId[postId]

        //get the specific comment by id and update the status
        const comment = comments.find(comment => {
            return comment.id === id;
        })
        comment.status = status;

        //emmit an event to the event-bus
        await axios.post("http://localhost:4005/events", {
            type: "CommentUpdated",
            data: {
                id,
                status,
                postId,
                content,
            }
        })
    }

    res.send({})
})


app.listen("4001", () => {
    console.log("Listening on 4001");
})