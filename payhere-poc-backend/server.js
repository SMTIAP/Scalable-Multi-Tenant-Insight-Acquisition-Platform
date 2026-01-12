import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();

app.use(cors());
app.use(express.json());

const MERCHANT_ID = '1233563';
const MERCHANT_SECRET = 'MjQ1NTQ4Njg5MDk1MDA2MzM5NzE0NDU1NTg4Njc0MDk5NjA1MTIy';

app.post('/payhere-hash', (req, res) => {
    const { order_id, amount, currency } = req.body;

    const formattedAmount = Number(amount)
        .toLocaleString('en-us', { minimumFractionDigits: 2 })
        .replaceAll(',', '');

    const hashedSecret = crypto
        .createHash('md5')
        .update(MERCHANT_SECRET)
        .digest('hex')
        .toUpperCase();

    const mainString = MERCHANT_ID + order_id + formattedAmount + currency + hashedSecret;

    const hash = crypto
        .createHash('md5')
        .update(mainString)
        .digest('hex')
        .toUpperCase();

    // Log to terminal to verify the values DEBUG
    console.log(`Generating hash for Order: ${order_id}, Amount: ${formattedAmount}`);

    res.json({ hash });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`PayHere POC backend running on http://localhost:${PORT}`);
});