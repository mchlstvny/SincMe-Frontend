// Community Stories JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Post new story functionality
    const postStory = document.getElementById('postStory');
    const storyInput = document.getElementById('storyInput');
    
    postStory.addEventListener('click', function() {
        const storyContent = storyInput.value.trim();
        if (storyContent) {
            addNewStory(storyContent);
            storyInput.value = '';
            postStory.disabled = true;
            // Hide emoji picker if open
            document.getElementById('emojiPicker').classList.remove('show-emoji-picker');
        }
    });
    
    // Add a new story to the top of the list
    function addNewStory(content) {
        const storiesContainer = document.getElementById('storiesContainer');
        const now = new Date();
        const timeString = 'Baru saja';
        
        const newStory = document.createElement('div');
        newStory.className = 'story-card bg-white rounded-xl p-6 shadow-sm mb-4';
        newStory.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-[#AEE3F3] flex items-center justify-center">
                        <span class="text-sm font-medium">A</span>
                    </div>
                    <div>
                        <h3 class="font-medium">Andini</h3>
                        <p class="text-xs text-gray-500">${timeString}</p>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <div class="mb-4">
                <p>${content}</p>
                <div class="flex flex-wrap mt-3 gap-2">
                    <span class="bg-[#F2F2F2] text-xs px-3 py-1 rounded-full">#support</span>
                </div>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex space-x-4">
                    <button class="flex items-center space-x-1 text-gray-500 hover:text-[#4A90E2]">
                        <i class="far fa-heart"></i>
                        <span class="text-sm">0</span>
                    </button>
                    <button class="flex items-center space-x-1 text-gray-500 hover:text-[#4A90E2]">
                        <i class="far fa-comment"></i>
                        <span class="text-sm">0</span>
                    </button>
                </div>
                <button class="text-gray-500 hover:text-[#4A90E2]">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        `;
        
        storiesContainer.insertBefore(newStory, storiesContainer.firstChild);
        
        // Add event listeners to the new story's buttons
        addStoryEventListeners(newStory);
    }
    
    // Add event listeners to all story cards
    function addStoryEventListeners(storyCard) {
        // Like button
        const likeButton = storyCard.querySelector('.fa-heart');
        likeButton.addEventListener('click', function() {
            const likeCount = this.nextElementSibling;
            if (this.classList.contains('far')) {
                this.classList.remove('far');
                this.classList.add('fas', 'text-red-500');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            } else {
                this.classList.remove('fas', 'text-red-500');
                this.classList.add('far');
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            }
        });
        
        // Comment button
        const commentButton = storyCard.querySelector('.fa-comment');
        commentButton.addEventListener('click', function() {
            // In a real app, this would toggle the comments section
            alert('Fitur komentar akan ditampilkan di sini');
        });
        
        // Bookmark button
        const bookmarkButton = storyCard.querySelector('.fa-bookmark');
        bookmarkButton.addEventListener('click', function() {
            if (this.classList.contains('far')) {
                this.classList.remove('far');
                this.classList.add('fas', 'text-[#4A90E2]');
            } else {
                this.classList.remove('fas', 'text-[#4A90E2]');
                this.classList.add('far');
            }
        });
    }
    
    // Initialize event listeners for existing stories
    document.querySelectorAll('.story-card').forEach(story => {
        addStoryEventListeners(story);
    });
});