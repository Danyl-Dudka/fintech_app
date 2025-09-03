import { useNavigate, useParams } from "react-router-dom";
import GreetingHeader from "../GreetingHeader/GreetingHeader";
import './projectApp.css'
import { useEffect, useState } from "react";
import CardsBalance from "../CardsBalance/CardsBalance";
import DiagramBalance from "../DiagramBalance/DiagramBalance";
import type { CategoryAmount } from "../types";
export default function ProjectApp() {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();


    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [balance, setBalance] = useState(0);

    const [expensesByCategory, setExpensesByCategory] = useState<CategoryAmount[]>([]);
    const [incomesByCategory, setIncomesByCategory] = useState<CategoryAmount[]>([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');
        if (!token || !sessionUserId) {
            navigate('/login')
            return
        } else if (urlUserId !== sessionUserId) {
            navigate(`/app/${sessionUserId}`)
            return
        }
    }, [urlUserId, navigate]);

    useEffect(() => {
        const fetchAmountByCategory = async () => {
            const token = sessionStorage.getItem('token');
            const sessionUserId = sessionStorage.getItem('userId');
            if (!token || !sessionUserId) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/user/${sessionUserId}/amount_by_category`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                if (response.ok) {
                    setIncomesByCategory(data.incomesAmountByCategory)
                    setExpensesByCategory(data.expensesAmountByCategory);
                }
            } catch (error) {
                console.error("Error fetching expenses by category: ", error)
            }
        }

        fetchAmountByCategory();
    }, [])

    return (
        <div className="project_app_wrapper">
            <GreetingHeader />
            <CardsBalance
                income={income}
                expense={expense}
                balance={balance}
                setIncome={setIncome}
                setExpense={setExpense}
                setBalance={setBalance}
            />
            <DiagramBalance incomes={income} expenses={expense} incomesByCategory={incomesByCategory} expensesByCategory={expensesByCategory} />
        </div>
    )
}
