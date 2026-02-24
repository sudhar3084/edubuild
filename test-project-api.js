// Test script to verify project API endpoints
const testProjectId = '550e8400-e29b-41d4-a716-446655440001';
const apiBase = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🧪 Testing Project API Endpoints...\n');

    // Test 1: Get all projects
    try {
        console.log('1️⃣ Testing GET /projects');
        const response1 = await fetch(`${apiBase}/projects`);
        const data1 = await response1.json();
        console.log(`✅ Status: ${response1.status}`);
        console.log(`✅ Projects found: ${data1.length}`);
        console.log(`✅ First project: ${data1[0]?.title}\n`);
    } catch (error) {
        console.error('❌ Failed:', error.message, '\n');
    }

    // Test 2: Get project by ID
    try {
        console.log(`2️⃣ Testing GET /projects/${testProjectId}`);
        const response2 = await fetch(`${apiBase}/projects/${testProjectId}`);
        const data2 = await response2.json();
        console.log(`✅ Status: ${response2.status}`);
        console.log(`✅ Title: ${data2.title}`);
        console.log(`✅ Has description: ${!!data2.description}`);
        console.log(`✅ Has materials: ${!!data2.materials}`);
        console.log(`✅ Has steps: ${!!data2.steps}`);
        console.log(`✅ Has videoUrl: ${!!data2.videoUrl}`);
        console.log(`✅ Full data:`, JSON.stringify(data2, null, 2), '\n');
    } catch (error) {
        console.error('❌ Failed:', error.message, '\n');
    }

    // Test 3: Check for undefined fields
    try {
        console.log('3️⃣ Checking for missing fields in database model');
        const response3 = await fetch(`${apiBase}/projects/${testProjectId}`);
        const project = await response3.json();

        const requiredFields = ['id', 'title', 'description', 'budget', 'classLevel', 'subject', 'materials', 'steps'];
        const missingFields = requiredFields.filter(field => !project[field]);

        if (missingFields.length > 0) {
            console.error('❌ Missing fields:', missingFields);
        } else {
            console.log('✅ All required fields present\n');
        }
    } catch (error) {
        console.error('❌ Failed:', error.message, '\n');
    }
}

testAPI().catch(console.error);
