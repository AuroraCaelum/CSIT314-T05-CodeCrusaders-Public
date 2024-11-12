class BuyerLoanCalculatorController {

    static async loanCalculator(price, loanTerm, interestRate) {
        
        const monthlyInterestRate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
        const loanMonths = parseFloat(loanTerm); // Total payments (months)
        const monthlyPayment = (parseFloat(price) * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanMonths));

        console.log(monthlyPayment)
        return monthlyPayment.toFixed(2)
    }
}

export { BuyerLoanCalculatorController };