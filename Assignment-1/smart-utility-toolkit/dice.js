const crypto = require("crypto");

let dice = crypto.randomInt(1, 7);

console.log("Dice Rolled:", dice);