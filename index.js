const express = require('express');
const app = express();
const PORT = 8000;
const cors = require('cors');
const router = require("./routes");

app.use(cors());
app.use(express.json());

app.use(router);
app.get('/', (req, res) => {
    res.send('<h1> SERVER IS RUNNING 🏃🏻 </h1>');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
