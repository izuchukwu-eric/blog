const express = require("express");
const bodyPaser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(bodyPaser.json())
app.use(cors({
    origin: "*"
}))


const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
})


app.post("/events", (req, res) => {
    const { type, data } = req.body;

    if (type === "PostCreated") {
        const { id, title } = data;

        posts[id] = {
            id,
            title,
            comments: []
        }
    }

    if (type === "CommentCreated") {
        const { id, content, postId } = data;

        //get the correct post
        const post = posts[postId]

        post.comments.push({ id, content })
    }

    if (type === "CommentedUpdated") {
        const { id, postId, status, content } = data;

        //get the particular post
        const post = posts[postId];

        //get the specific comment by id and update the status
        const comment = posts.comments.find(comment => {
            return comment.id === id;
        })
        comment.status = status;
        comment.content = content;
    }

    res.send({});
})


app.listen(4002, () => {
    console.log("Listening on 4002");
})