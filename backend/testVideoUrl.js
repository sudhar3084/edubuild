import fetch from 'node-fetch';

async function testVideoUrl() {
    const token = 'YOUR_ADMIN_TOKEN_HERE'; // Replace with actual token after login

    try {
        // Test creating a project with videoUrl
        const response = await fetch('http://localhost:5000/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Video Project',
                description: 'Testing video URL',
                subject: 'Physics',
                classLevel: '6-8',
                budget: 100,
                difficulty: 'Easy',
                materials: ['Test'],
                steps: ['Step 1'],
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                image: ''
            })
        });

        const data = await response.json();
        console.log('Response:', data);
        console.log('Video URL in response:', data.project?.videoUrl);
    } catch (error) {
        console.error('Error:', error);
    }
}

testVideoUrl();
