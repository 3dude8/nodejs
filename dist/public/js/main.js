// src/public/js/main.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', function () {
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
function handlePostLike(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = event.currentTarget;
        const postId = btn.dataset.postId;
        if (!postId)
            return;
        try {
            const response = yield fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = yield response.json();
                // Update like count
                const postFooter = btn.closest('.post-footer');
                const likesCount = postFooter === null || postFooter === void 0 ? void 0 : postFooter.querySelector('.likes-count');
                if (likesCount) {
                    likesCount.innerHTML = `<i class="fas fa-heart"></i> ${data.likesCount} likes`;
                }
                // Toggle button state
                if (data.isLiked) {
                    btn.classList.add('liked');
                    const likeText = btn.querySelector('.like-text');
                    if (likeText)
                        likeText.textContent = 'Unlike';
                }
                else {
                    btn.classList.remove('liked');
                    const likeText = btn.querySelector('.like-text');
                    if (likeText)
                        likeText.textContent = 'Like';
                }
            }
            else {
                const errorData = yield response.json();
                if (response.status === 401) {
                    alert('Please log in to like posts');
                    window.location.href = '/';
                }
                else {
                    alert(errorData.message || 'Error liking the post.');
                }
            }
        }
        catch (error) {
            console.error('Error toggling post like:', error);
            alert('Error liking the post.');
        }
    });
}
// Handle comment like/unlike
function handleCommentLike(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = event.currentTarget;
        const commentId = btn.dataset.commentId;
        if (!commentId)
            return;
        try {
            const response = yield fetch(`/api/comments/${commentId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = yield response.json();
                // Update like count
                const commentFooter = btn.closest('.comment-footer');
                const likesCount = commentFooter === null || commentFooter === void 0 ? void 0 : commentFooter.querySelector('.comment-likes-count');
                if (likesCount) {
                    likesCount.textContent = `${data.likesCount} likes`;
                }
                // Toggle button state
                if (data.isLiked) {
                    btn.classList.add('liked');
                    btn.textContent = 'Unlike';
                }
                else {
                    btn.classList.remove('liked');
                    btn.textContent = 'Like';
                }
            }
        }
        catch (error) {
            console.error('Error toggling comment like:', error);
        }
    });
}
// Handle post delete
function handlePostDelete(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = event.currentTarget;
        const postId = btn.dataset.postId;
        if (!postId)
            return;
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }
        try {
            const response = yield fetch(`/api/posts/${postId}`, {
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
        }
        catch (error) {
            console.error('Error deleting post:', error);
        }
    });
}
// Handle comment delete
function handleCommentDelete(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = event.currentTarget;
        const commentId = btn.dataset.commentId;
        if (!commentId)
            return;
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        try {
            const response = yield fetch(`/api/comments/${commentId}`, {
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
        }
        catch (error) {
            console.error('Error deleting comment:', error);
        }
    });
}
