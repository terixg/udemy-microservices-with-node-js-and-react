const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    console.log('Event Received: ', req.body.type);

    const { type, data } = req.body;

    if (type === 'PostCreated') {

        const { id, title } = data;
        posts[id] = { id, title, comments: [] };

    } else if (type === 'CommentCreated') {

        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });

    } else if (type === 'CommentUpdated') {

        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);

        comment.status = status;
        comment.content = content;
        comment.postId = postId;
    }

    res.send({});
});


app.listen(4002, () => {
    console.log('Listening on 4002');
});