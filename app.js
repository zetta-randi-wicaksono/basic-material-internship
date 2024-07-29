const mongoose = require('mongoose');
const User = require('./user.model.js');
const conn = require('./connection.js');

async function main() {
  console.log(await conn);
}

function adduser() {
  const user = new User({
    name: 'Budi',
    age: 34,
    email: 'rtrtt@gmail.com',
    createdAt: new Date(),
  });

  user.save();
}

main();
adduser();
