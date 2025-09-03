import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './cardsBalance.css'
import type { CardsBalanceProps } from "../types";

export default function CardsBalance({ income, expense, balance, setIncome, setExpense, setBalance }: CardsBalanceProps) {
    const navigate = useNavigate();
    const fetchBalance = async () => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');
        if (!token || !sessionUserId) {
            navigate('/login')
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/balance`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');

        if (!token || !sessionUserId) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/current_month_summary`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
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

    const fetchMoney = () => {
        fetchBalance();
        fetchSummary();
    }

    useEffect(() => {
        fetchMoney()
        const interval = setInterval(fetchMoney, 5000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="financial_cards">
            <div className="current_balance_card">
                <div className="money_information">
                    <p className="balance_title">Current balance: <span className="balance_number">CAD ${balance?.toFixed(2) ?? 0.00}</span></p>
                </div>
                <div className="wallet_icon">
                    <Wallet />
                </div>
            </div>

            <div className="income_balance_card">
                <div className="money_information">
                    <p className="balance_title">Income:<span className="balance_number">CAD ${income?.toFixed(2) ?? 0.00}</span></p>
                </div>
                <div className="income_icon">
                    <ArrowUpRight className="arrow_up_icon" />
                </div>
            </div>

            <div className="expense_balance_card">
                <div className="money_information">
                    <p className="balance_title">Expense: <span className="balance_number">CAD ${expense?.toFixed(2) ?? 0.00}</span></p>
                </div>
                <div className="expense_icon">
                    <ArrowDownLeft className="arrow_down_icon" />
                </div>
            </div>
        </div>)
}
