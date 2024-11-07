// CODE FOR INDEX.HTML
// ensure page loads before loading scripts
window.addEventListener('load', function() {
    // Get the container where posts will be displayed
    var postListContainer = document.getElementById('posts-list');

    // Check if postListContainer exists
    if (postListContainer) {
        // Get the blog posts from local storage
        var posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        console.log('Loaded posts from local storage:', posts); // Debug log

        // Check if there are any posts
        if (posts.length === 0) {
            postListContainer.innerHTML = '<p>No posts available.</p>';
        } else {
            // Loop through each post and display it
            for (var i = 0; i < posts.length; i++) {
                var post = posts[i];

                // Create a div for each post
                var postElement = document.createElement('div');
                postElement.className = 'post'; // Set for styling

                // Ensure only one set of HTML is used
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content.substring(0, 100)}...</p> <!-- Display a preview -->
                    <a href="post.html?id=${i}">Read More</a>
                `;

                // Add the post element to the container
                postListContainer.appendChild(postElement);
            }
        }
    }
});

// CODE FOR NEW-POST.HTML
// *** remember to ensure page loads before scripts! ***
// Wait for the page to load before running the script
window.addEventListener('load', function() {
    var postForm = document.getElementById('postForm');

    // Check if postForm exists
    if (postForm) {
        // Add an event listener for form submission
        postForm.onsubmit = function(event) {
            event.preventDefault(); // Prevent page from reloading

            // Get form values
            var title = document.getElementById('title').value.trim();
            var content = document.getElementById('content').value.trim();
            var image = document.getElementById('image').value.trim();

            // Basic form validation
            if (title === '' || content === '') {
                alert('Title and content are required!');
                return;
            }

            // Create a new post object
            var newPost = {
                title: title,
                content: content,
                image: image,
                date: new Date().toLocaleString()
            };

            // Get existing posts from local storage, or initialize an empty array
            var posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

            // Add the new post to the array
            posts.push(newPost);
            console.log('Saving new post:', newPost); // Debug log

            // Save the updated posts array to local storage
            localStorage.setItem('blogPosts', JSON.stringify(posts));

            // Confirmation message and redirect
            alert('New post created successfully!');
            window.location.href = 'index.html'; // Redirect to the homepage
        };
    }
});

// CODE FOR POST.HTML
// getting blog post details
function getParameterByName(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Load and display the specific post
window.addEventListener('load', function() {
    var postId = getParameterByName('id');
    var posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    console.log('Post ID:', postId, 'Loaded posts:', posts); // Debug log

    // Check if required elements exist
    var postContainer = document.getElementById('post-container');
    var postTitle = document.getElementById('post-title');
    var postContent = document.getElementById('post-content');
    var editButton = document.getElementById('edit-button');
    var editForm = document.getElementById('edit-form');
    var deleteButton = document.getElementById('delete-button');

    if (postContainer && postTitle && postContent && postId !== null && posts[postId]) {
        var post = posts[postId];
        postTitle.textContent = post.title;
        postContent.textContent = post.content;

        if (editButton && editForm) {
            // Edit button functionality
            editButton.onclick = function() {
                editForm.style.display = 'block';
                document.getElementById('edit-title').value = post.title;
                document.getElementById('edit-content').value = post.content;
            };

            // Save edited post
            editForm.onsubmit = function(event) {
                event.preventDefault();
                var newTitle = document.getElementById('edit-title').value.trim();
                var newContent = document.getElementById('edit-content').value.trim();

                if (newTitle === '' || newContent === '') {
                    alert('Title and content cannot be empty.');
                    return;
                }

                // Update the post and save back to local storage
                post.title = newTitle;
                post.content = newContent;
                posts[postId] = post;
                localStorage.setItem('blogPosts', JSON.stringify(posts));

                alert('Post updated successfully!');
                window.location.reload(); // Reload to show updated post
            };
        }

        if (deleteButton) {
            // Delete button functionality
            deleteButton.onclick = function() {
                if (confirm('Are you sure you want to delete this post?')) {
                    posts.splice(postId, 1); // Remove the post from the array
                    localStorage.setItem('blogPosts', JSON.stringify(posts)); // Save updated array
                    alert('Post deleted successfully!');
                    window.location.href = 'index.html'; // Redirect to homepage
                }
            };
        }
    } else {
        if (postContainer) {
            postContainer.innerHTML = '<p>Post not found.</p>';
        }
    }
});
