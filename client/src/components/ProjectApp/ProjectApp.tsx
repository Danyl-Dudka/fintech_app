import { useNavigate, useParams } from "react-router-dom";
import GreetingHeader from "../GreetingHeader/GreetingHeader";
import './projectApp.css'
import { useEffect, useState } from "react";
import CardsBalance from "../CardsBalance/CardsBalance";
import DiagramBalance from "../DiagramBalance/DiagramBalance";
import type { CategoryAmount } from "../types";
import { api } from "../../api/api";
export default function ProjectApp() {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();


    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [balance, setBalance] = useState(0);

    const [expensesByCategory, setExpensesByCategory] = useState<CategoryAmount[]>([]);
    const [incomesByCategory, setIncomesByCategory] = useState<CategoryAmount[]>([]);

    const [selectedDiagram, setSelectedDiagram] = useState<'summary' | 'income' | 'expense'>("summary");

    useEffect(() => {
        const sessionUserId = sessionStorage.getItem('userId');
        if (!sessionUserId) {
            navigate('/login')
            return
        } else if (urlUserId !== sessionUserId) {
            navigate(`/app/${sessionUserId}`)
            return
        }
    }, [urlUserId, navigate]);

    useEffect(() => {
        const fetchAmountByCategory = async () => {
            const sessionUserId = sessionStorage.getItem('userId');
            try {
                const response = await api(`http://localhost:3000/user/${sessionUserId}/amount_by_category`, {
                    method: 'GET',
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
            <div className="upper_part_main_page">
                <CardsBalance
                    income={income}
                    expense={expense}
                    balance={balance}
                    setIncome={setIncome}
                    setExpense={setExpense}
                    setBalance={setBalance}
                    setSelectedDiagram={setSelectedDiagram}
                />
                <DiagramBalance incomes={income} expenses={expense} incomesByCategory={incomesByCategory} expensesByCategory={expensesByCategory} selectedDiagram={selectedDiagram} />
            </div>
        </div>
    )
}
