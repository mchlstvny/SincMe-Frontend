document.addEventListener("DOMContentLoaded", function () {
    const storyInput = document.getElementById("storyInput");
    const postStory = document.getElementById("postStory");
    const storiesContainer = document.getElementById("storiesContainer");
    const emojiToggle = document.getElementById("emojiToggle");
    const emojiPicker = document.getElementById("emojiPicker");
    const lockToggle = document.getElementById("lockToggle");

    // Buat userId unik jika belum ada
    if (!localStorage.getItem("currentUserId")) {
        localStorage.setItem("currentUserId", `user_${Date.now()}`);
    }
    const currentUserId = localStorage.getItem("currentUserId");

    let stories = JSON.parse(localStorage.getItem("stories") || "[]");
    let likedStories = JSON.parse(localStorage.getItem("likedStories") || "[]");
    let savedStories = JSON.parse(localStorage.getItem("savedStories") || "[]");

    let isPrivate = false;

    renderStories();

    storyInput.addEventListener("input", () => {
        postStory.disabled = storyInput.value.trim() === "";
    });

    lockToggle.addEventListener("click", () => {
        isPrivate = !isPrivate;
        lockToggle.innerHTML = isPrivate
            ? '<i class="fas fa-lock text-gray-700"></i>'
            : '<i class="fas fa-lock-open text-gray-400"></i>';
    });

    postStory.addEventListener("click", () => {
        const now = new Date();
        const newStory = {
            id: Date.now(),
            name: "Anonymous",
            content: storyInput.value.trim(),
            likes: 0,
            timestamp: now.toISOString(),
            private: isPrivate,
            ownerId: currentUserId
        };

        stories.unshift(newStory);
        localStorage.setItem("stories", JSON.stringify(stories));
        storyInput.value = "";
        postStory.disabled = true;
        isPrivate = false;
        lockToggle.innerHTML = '<i class="fas fa-lock-open text-gray-400"></i>';
        renderStories();
    });

    emojiToggle.addEventListener("click", () => {
        emojiPicker.classList.toggle("show-emoji-picker");
    });

    document.querySelectorAll(".emoji-option").forEach(emoji => {
        emoji.addEventListener("click", () => {
            storyInput.value += emoji.textContent;
            storyInput.dispatchEvent(new Event("input"));
        });
    });

    function renderStories() {
        storiesContainer.innerHTML = "";

        stories.forEach(story => {
            if (story.private && story.ownerId !== currentUserId) return;

            const card = document.createElement("div");
            card.className = "bg-white rounded-xl p-4 shadow-sm story-card";

            const date = new Date(story.timestamp);
            const formattedTime = `Diposting ${date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })} pukul ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

            const nameDiv = `
                <div>
                    <div class="font-semibold text-[#4A90E2]">${story.name}</div>
                    <div class="text-xs text-gray-400">${formattedTime}${story.private ? " • Pribadi 🔒" : ""}</div>
                </div>
            `;
            const contentDiv = `<p class="text-gray-700 mt-2">${story.content}</p>`;

            const likeButton = document.createElement("button");
            likeButton.className = "mt-3 text-sm text-gray-500 hover:text-[#4A90E2] mr-4";
            const isLiked = likedStories.includes(story.id);
            likeButton.innerHTML = `<i class="fas fa-heart ${isLiked ? 'text-red-500' : ''} mr-1"></i> <span>${story.likes}</span>`;
            likeButton.addEventListener("click", () => {
                const index = stories.findIndex(s => s.id === story.id);
                if (index === -1) return;
                if (likedStories.includes(story.id)) {
                    stories[index].likes--;
                    likedStories = likedStories.filter(id => id !== story.id);
                } else {
                    stories[index].likes++;
                    likedStories.push(story.id);
                }
                localStorage.setItem("stories", JSON.stringify(stories));
                localStorage.setItem("likedStories", JSON.stringify(likedStories));
                renderStories();
            });

            const saveButton = document.createElement("button");
            saveButton.className = "mt-3 text-sm text-gray-500 hover:text-yellow-500";
            const isSaved = savedStories.includes(story.id);
            saveButton.innerHTML = `<i class="fas fa-bookmark ${isSaved ? 'text-yellow-400' : ''} mr-1"></i> <span>${isSaved ? 'Saved' : 'Save'}</span>`;
            saveButton.addEventListener("click", () => {
                if (isSaved) {
                    savedStories = savedStories.filter(id => id !== story.id);
                } else {
                    savedStories.push(story.id);
                }
                localStorage.setItem("savedStories", JSON.stringify(savedStories));
                renderStories();
            });

            const menuWrapper = document.createElement("div");
            menuWrapper.className = "relative ml-auto";

            const menuButton = document.createElement("button");
            menuButton.innerHTML = "&#8942;";
            menuButton.className = "text-gray-400 hover:text-gray-600 text-xl";

            const dropdown = document.createElement("div");
            dropdown.className = "absolute right-0 mt-2 w-28 bg-white rounded shadow-md z-10 hidden";
            dropdown.innerHTML = `<button class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100">Report</button>`;

            menuButton.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("hidden");
            });

            document.addEventListener("click", () => {
                dropdown.classList.add("hidden");
            });

            dropdown.querySelector("button").addEventListener("click", () => {
                dropdown.classList.add("hidden");
                showReportReason(story.id);
            });

            menuWrapper.appendChild(menuButton);
            menuWrapper.appendChild(dropdown);

            const topWrapper = document.createElement("div");
            topWrapper.className = "flex justify-between items-start";
            topWrapper.innerHTML = nameDiv;
            topWrapper.appendChild(menuWrapper);

            const actionWrapper = document.createElement("div");
            actionWrapper.className = "flex items-center space-x-4 mt-3";
            actionWrapper.appendChild(likeButton);
            actionWrapper.appendChild(saveButton);

            // Tombol Delete (hanya untuk cerita milik sendiri)
            if (story.ownerId === currentUserId) {
            const deleteButton = document.createElement("button");
            deleteButton.className = "mt-3 text-sm text-gray-500 hover:text-red-500";
            deleteButton.innerHTML = `<i class="fas fa-trash mr-1"></i> Delete`;
            
            deleteButton.addEventListener("click", () => {
                if (confirm("Yakin ingin menghapus cerita ini?")) {
                    stories = stories.filter(s => s.id !== story.id);
                    localStorage.setItem("stories", JSON.stringify(stories));
                    renderStories();
                }
            });

            actionWrapper.appendChild(deleteButton);
        }


            card.innerHTML = "";
            card.appendChild(topWrapper);
            card.insertAdjacentHTML("beforeend", contentDiv);
            card.appendChild(actionWrapper);

            storiesContainer.appendChild(card);
        });
    }

    function showReportReason(storyId) {
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 flex items-center justify-center bg-[#00000080] z-50";
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
                <h2 class="text-lg font-semibold mb-4">Pilih alasan pelaporan</h2>
                <div class="space-y-2">
                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded reason-btn">Spam</button>
                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded reason-btn">Konten tidak pantas</button>
                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded reason-btn">Mengandung kebencian</button>
                </div>
                <button class="mt-4 text-sm text-gray-500 hover:underline cancel-btn">Batal</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelectorAll(".reason-btn").forEach(button => {
            button.addEventListener("click", () => {
                alert(`Terima kasih. Cerita telah dilaporkan karena: ${button.textContent}`);
                document.body.removeChild(modal);
            });
        });
        modal.querySelector(".cancel-btn").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
    }
});
