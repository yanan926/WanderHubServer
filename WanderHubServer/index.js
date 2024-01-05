const express = require("express")
const app = express()

require("dotenv").config();

const PORT = process.env.PORT || 3000;

// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test').then(()=>{console.log("connection open!!")})
}

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});