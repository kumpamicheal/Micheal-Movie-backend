const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'sekako'; // Replace with your desired password
    const saltRounds = 10;

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Generated bcrypt hash:', hash);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();
