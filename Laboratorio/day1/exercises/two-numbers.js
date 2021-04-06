const args = process.argv.length;

if (args != 4) {
    console.log("Invalid number of parameters.");
} else {
    if (typeof process.argv[2] === Number && typeof process.argv[3] === Number) {
        console.log("Yes, those are two numbers.");
    } else {
	console.log("Those are not two numbers.");
    }
}

