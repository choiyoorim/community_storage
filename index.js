const express = require('express');

const app = express();

const PORT = 8000;

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1> SERVER IS RUNNING 🏃🏻 </h1>');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
