const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8085;

app.use(bodyParser.json());
app.use(express.static('public'));

// Set up storage for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

let posts = [];

// Serve uploaded imagesq2  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to get all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Route to create a new post
app.post('/api/posts', upload.single('image'), (req, res) => {
    const { content } = req.body;
    const newPost = {
        id: posts.length + 1,
        content,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        likes: 0,
        comments: [],
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Route to like a post
app.post('/api/posts/:id/like', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Route to comment on a post
app.post('/api/posts/:id/comment', (req, res) => {
    const postId = parseInt(req.params.id);
    const { commentContent } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
        const newComment = {
            id: post.comments.length + 1,
            content: commentContent,
        };
        post.comments.push(newComment);
        res.status(201).json(newComment);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
