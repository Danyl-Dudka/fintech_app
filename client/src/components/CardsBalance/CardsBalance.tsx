import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useEffect } from "react";
import './cardsBalance.css'
import type { CardsBalanceProps } from "../types";
import { api } from "../../api/api";

export default function CardsBalance({ income, expense, balance, setIncome, setExpense, setBalance, setSelectedDiagram }: CardsBalanceProps) {

    useEffect(() => {
        const fetchBalance = async () => {
            const sessionUserId = sessionStorage.getItem('userId');
            try {
                const response = await api(`http://localhost:3000/user/${sessionUserId}/balance`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    setBalance(data.balance);
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        };

        const fetchSummary = async () => {
            const sessionUserId = sessionStorage.getItem('userId');
            try {
                const response = await api(`http://localhost:3000/user/${sessionUserId}/current_month_summary`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    setIncome(data.incomeSummary)
                    setExpense(data.expenseSummary);
                }
            } catch (error) {
                console.error('Error fetching expense balance: ', error)
            }
        }

        fetchBalance();
        fetchSummary();
    }, [])

    return (
        <div className="financial_cards">
            <div className="current_balance_card" onClick={() => setSelectedDiagram('summary')}>
                <div className="money_information">
                    <p className="balance_title">Current balance: <span className="balance_number">CAD ${balance?.toFixed(2) ?? 0.00}</span></p>
                </div>
                <div className="wallet_icon">
                    <Wallet />
                </div>
            </div>

            <div className="income_balance_card" onClick={() => setSelectedDiagram('income')}>
                <div className="money_information">
                    <p className="balance_title">Income:<span className="balance_number">CAD ${income?.toFixed(2) ?? 0.00}</span></p>
                </div>
                <div className="income_icon">
                    <ArrowUpRight className="arrow_up_icon" />
                </div>
            </div>

            <div className="expense_balance_card" onClick={() => setSelectedDiagram('expense')}>
                <div className="money_information">
                    <p className="balance_title">Expense: <span className="balance_number">CAD ${expense?.toFixed(2) ?? 0.00}</span></p>
                </div>
                <div className="expense_icon">
                    <ArrowDownLeft className="arrow_down_icon" />
                </div>
            </div>
        </div>
    )
}
