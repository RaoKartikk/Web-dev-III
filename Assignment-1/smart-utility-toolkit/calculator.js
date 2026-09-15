let op = process.argv[2];
let a = Number(process.argv[3]);
let b = Number(process.argv[4]);

if (op == "add")
    console.log("Result:", a + b);

else if (op == "sub")
    console.log("Result:", a - b);

else if (op == "mul")
    console.log("Result:", a * b);

else if (op == "div")
    console.log("Result:", a / b);

else
    console.log("Invalid operation");