



firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const form = document.getElementById('add-member-form');
const nameInput = document.getElementById('name');
const usernameInput = document.getElementById('leetcode-username');
const statusMessage = document.getElementById('status-message');


form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const name = nameInput.value.trim();
    const username = usernameInput.value.trim();

    if (!name || !username) {
        statusMessage.textContent = "Please fill out both fields.";
        statusMessage.className = 'error';
        return;
    }

    statusMessage.textContent = "Saving...";
    statusMessage.className = 'saving';

    try {
        
        await db.collection('members').add({
            name: name,
            'leetcode-username': username 
        });
        
        statusMessage.textContent = "Success! You have been added. Redirecting...";
        statusMessage.className = 'success';

        
        form.reset();
        
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error("Error adding document: ", error);
        statusMessage.textContent = "Error saving data. Please try again.";
        statusMessage.className = 'error';
    }
});