/**
 *
 * Write a Node.js function isPrime(n) that takes an integer n as an argument and returns true if n is a prime number and false otherwise.
 *
 */
function isPrime(n) {
  if (n < 2) {
    return false;
  }

  for (let i = 2; i <= Math.floor(n / 2); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

console.log(isPrime(10));
console.log(isPrime(43));
