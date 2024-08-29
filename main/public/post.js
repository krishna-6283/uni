document.addEventListener('DOMContentLoaded', loadPosts);

function loadPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <p>${post.content}</p>
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image">` : ''}
                    <div>
                        <span class="like-button" onclick="likePost(${post.id})">Like (${post.likes})</span>
                    </div>
                    <div class="comments-section">
                        ${post.comments.map(comment => `<div class="comment">${comment.content}</div>`).join('')}
                        <div class="comment-form">
                            <textarea id="commentContent${post.id}" placeholder="Add a comment..."></textarea>
                            <button onclick="addComment(${post.id})">Comment</button>
                        </div>
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
        });
}

function addPost() {
    const postContent = document.getElementById('postContent').value;
    const postImage = document.getElementById('postImage').files[0];

    if (postContent.trim() === '') {
        alert('Please write something!');
        return;
    }

    const formData = new FormData();
    formData.append('content', postContent);
    if (postImage) {
        formData.append('image', postImage);
    }

    fetch('/api/posts', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(newPost => {
        loadPosts();  // Reload posts to reflect the new post
        document.getElementById('postContent').value = '';  // Clear the textarea
        document.getElementById('postImage').value = '';  // Clear the file input
    });
}

function likePost(postId) {
    fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(updatedPost => {
        loadPosts();  // Reload posts to reflect the like
    });
}

function addComment(postId) {
    const commentContent = document.getElementById(`commentContent${postId}`).value;

    if (commentContent.trim() === '') {
        alert('Please write something!');
        return;
    }

    fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentContent }),
    })
    .then(response => response.json())
    .then(newComment => {
        loadPosts();  // Reload posts to reflect the new comment
    });
}
