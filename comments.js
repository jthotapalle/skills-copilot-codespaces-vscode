//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, 'comments.json');
const comments = require(commentsPath);
const port = 3000;
// 
// 
// //Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
// //Routes
app.get('/comments', (req, res) => {
    res.json(comments);
});
app.post('/comments', (req, res) => {
    const comment = req.body;
    comment.id = Date.now();
    comments.push(comment);
    fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));
    res.status(201).json(comment);
});
app.delete('/comments/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = comments.findIndex(comment => comment.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Comment not found' });
    } else {
        comments.splice(index, 1);
        fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));
        res.status(204).end();
    }
});
// //Start server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});