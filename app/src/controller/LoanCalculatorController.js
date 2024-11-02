class LoanCalculatorController {

    async loanCalculator(loanAmount, loanMonths, interestRate) {
        
        const interest = loanAmount * (interestRate / 100) 
        const monthlyPayment = (loanAmount + interest) / loanMonths

        return monthlyPayment
    }
}