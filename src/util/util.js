export function generateTransferCode() {
    // Function to generate a random digit
    const getRandomDigit = () => Math.floor(Math.random() * 10);

    // Get the current year and extract the last two digits
    const currentYear = new Date().getFullYear();
    const year = currentYear % 100; // Last two digits of the year

    // Constructing the transfer code in the format YY-DDD-DDD-DDD
    const transferCode = `${String(year).padStart(2, '0')}-${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}-${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}-${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}`;

    return transferCode;
}