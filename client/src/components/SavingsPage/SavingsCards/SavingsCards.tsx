import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import type { Goal } from "../../types";
import './savingsCards.css'
export default function SavingsCards() {
    const [goals, setGoals] = useState<Goal[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchSavingsGoals = async () => {
            const token = sessionStorage.getItem('token');
            const sessionUserId = sessionStorage.getItem('userId');

            if (!token || !sessionUserId) {
                navigate('/login');
                return
            }
            try {
                const response = await fetch(`http://localhost:3000/user/${sessionUserId}/goals`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                if (response.ok) {
                    setGoals(data.goals || [])
                }
                console.log(goals)
            } catch (error) {
                console.error('Error fetching savings goals: ', error)
            }
        };

        fetchSavingsGoals();
    }, [])
    return (
        <div className="savings_card_wrapper">
            <div className="savings_title_page">💰 My Savings Goals</div>

            {goals.length === 0 ? (
                <div className="no_goals">
                    <p className="no_goals_text">You don't have any goals yet.</p>
                </div>
            ) : (
                <div className="goals_flex_container">
                    {goals.map((goal) => (
                        <div key={goal._id} className="goal_card">
                            <div className="goal_header">
                                <span className="goal_icon">🎯</span>
                                <h3 className="goal_name">{goal.title}</h3>
                            </div>
                            <p className="goal_amount">CAD ${goal.amount.toFixed(2)}</p>
                            <p className="goal_date">Created: {new Date(goal.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
