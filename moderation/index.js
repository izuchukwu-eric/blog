const express = require("express");
const bodyPaser = require("body-parser");
const axios = require("axios");
const cors = require("cors");


const app = express();
app.use(bodyPaser.json());
app.use(cors({
    origin: "*"
}))

app.post("/events", async (req, res) => {
    const { type, data } = req.body;

    if ( type === "CommentCreated") {
        const status = data.content.includes("orange") ? "rejected" : "approved";

        //emmit event to the event-bus
        await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        })
    }

    res.send({});
})


app.listen(4003, () => {
    console.log("Listening on 4003");
})