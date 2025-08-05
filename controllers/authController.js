const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// For demo, static admin user (replace with DB check in production)
const adminUser = {
    email: 'ssengendomichealpius@gmail.com',
    passwordHash: '$2b$10$4iqSL.fCPBsJAWcftz2WSOfNx5kczpRzxlXSSx1pE79pkj/Yf.RVi' // bcrypt hash of 'adminpassword'
};

exports.login = async (req, res) => {


    const { email, password } = req.body;


    if (email !== adminUser.email) {

        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, adminUser.passwordHash);

    if (!validPassword) {

        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
};
