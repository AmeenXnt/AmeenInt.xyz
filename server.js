const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from "public" directory

// Configure your email service
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ameenxnt@gmail.com',
        pass: 'MEERAMEEN'
    }
});

// Store OTPs in memory (for demonstration purposes; use a database in production)
const otps = {};

app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = generateOtp();
    otps[email] = otp;

    const mailOptions = {
        from: 'ameenxnt@gmail.com',
        to: email,
        subject: 'AMEEN INT VERIFICATION',
        text: `Your OTP Code Is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({ success: false, message: 'Failed to send email' });
        }

        res.json({ success: true });
    });
});

app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otps[email] && otps[email] === otp) {
        delete otps[email]; // Clear OTP after successful verification
        res.json({ success: true, username: email.split('@')[0] });
    } else {
        res.json({ success: false });
    }
});

function generateOtp() {
    return crypto.randomInt(1000, 9999).toString();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
