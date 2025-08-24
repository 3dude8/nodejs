// src/public/js/main.ts

document.addEventListener('DOMContentLoaded', function() {
    // Handle post likes
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', handlePostLike);
    });

    // Handle comment likes
    document.querySelectorAll('.comment-like-btn').forEach(btn => {
        btn.addEventListener('click', handleCommentLike);
    });

    // Handle post deletes
    document.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', handlePostDelete);
    });

    // Handle comment deletes
    document.querySelectorAll('.delete-comment-btn').forEach(btn => {
        btn.addEventListener('click', handleCommentDelete);
    });
});

// Handle post like/unlike
async function handlePostLike(event: Event): Promise<void> {
    const btn = event.currentTarget as HTMLButtonElement;
    const postId = btn.dataset.postId;
    
    if (!postId) return;
    
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update like count
            const postFooter = btn.closest('.post-footer');
            const likesCount = postFooter?.querySelector('.likes-count');
            if (likesCount) {
                likesCount.innerHTML = `<i class="fas fa-heart"></i> ${data.likesCount} likes`;
            }
            
            // Toggle button state
            if (data.isLiked) {
                btn.classList.add('liked');
                const likeText = btn.querySelector('.like-text');
                if (likeText) likeText.textContent = 'Unlike';
            } else {
                btn.classList.remove('liked');
                const likeText = btn.querySelector('.like-text');
                if (likeText) likeText.textContent = 'Like';
            }
        } else {
            const errorData = await response.json();
            if (response.status === 401) {
                alert('Please log in to like posts');
                window.location.href = '/';
            } else {
                alert(errorData.message || 'Error liking the post.');
            }
        }
    } catch (error) {
        console.error('Error toggling post like:', error);
        alert('Error liking the post.');
    }
}

// Handle comment like/unlike
async function handleCommentLike(event: Event): Promise<void> {
    const btn = event.currentTarget as HTMLButtonElement;
    const commentId = btn.dataset.commentId;
    
    if (!commentId) return;
    
    try {
        const response = await fetch(`/api/comments/${commentId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update like count
            const commentFooter = btn.closest('.comment-footer');
            const likesCount = commentFooter?.querySelector('.comment-likes-count');
            if (likesCount) {
                likesCount.textContent = `${data.likesCount} likes`;
            }
            
            // Toggle button state
            if (data.isLiked) {
                btn.classList.add('liked');
                btn.textContent = 'Unlike';
            } else {
                btn.classList.remove('liked');
                btn.textContent = 'Like';
            }
        }
    } catch (error) {
        console.error('Error toggling comment like:', error);
    }
}

// Handle post delete
async function handlePostDelete(event: Event): Promise<void> {
    const btn = event.currentTarget as HTMLButtonElement;
    const postId = btn.dataset.postId;
    
    if (!postId) return;
    
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Remove post from DOM
            const postCard = btn.closest('.post-card, .post-detail-container');
            if (postCard) {
                postCard.remove();
            }
            
            // Redirect to posts list if on post detail page
            if (window.location.pathname.includes('/posts/') && !window.location.pathname.includes('/edit')) {
                window.location.href = '/posts';
            }
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Handle comment delete
async function handleCommentDelete(event: Event): Promise<void> {
    const btn = event.currentTarget as HTMLButtonElement;
    const commentId = btn.dataset.commentId;
    
    if (!commentId) return;
    
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Remove comment from DOM
            const comment = btn.closest('.comment');
            if (comment) {
                comment.remove();
            }
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}
