import { Route, Routes } from "react-router-dom";
import ProjectApp from "../ProjectApp/ProjectApp";
import SavingsPage from "../SavingsPage/SavingsPage";
import TransactionsPage from "../TransactionsHistory/TransactionsPage";
import PageWrapper from "../PageWrapper";

export default function FinanceContent() {
    return (
        <Routes>
            <Route path="/app/:userId" element={<PageWrapper><ProjectApp /></PageWrapper>} />
            <Route path="/app/:userId/all_transactions" element={<PageWrapper><TransactionsPage type="all" /></PageWrapper>} />
            <Route path="/app/:userId/incomes_transactions" element={<PageWrapper><TransactionsPage type="income" /></PageWrapper>} />
            <Route path="/app/:userId/expenses_transactions" element={<PageWrapper><TransactionsPage type="expense" /></PageWrapper>} />
            <Route path="/app/:userId/savings" element={<PageWrapper><SavingsPage /></PageWrapper>} />
        </Routes>
    )
}
