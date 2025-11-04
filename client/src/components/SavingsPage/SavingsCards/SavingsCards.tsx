import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import type { Goal } from "../../types";
import './savingsCards.css'
import { Check, Hammer, X } from "lucide-react";
import { Button, IconButton } from "@mui/material";
import { toast } from "react-toastify";
export default function SavingsCards() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isActiveTopUp, setIsActiveTopUp] = useState<string | null>(null);
    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [animateButton, setAnimateButton] = useState(false)

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
    }, []);

    const handleTopUp = async (goalId: string) => {
    }

    const handleCancel = () => {
        setAnimateButton(true);
        setIsActiveTopUp(null);
        setTopUpAmount("");
        setTimeout(() => setAnimateButton(false), 400);
    }

    const handleDeleteGoal = async (goalId: string) => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');

        if (!token || !sessionUserId) {
            navigate('/login');
            return
        }

        try {
            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/delete_goal/${goalId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                const card = document.getElementById(goalId);
                if (card) {
                    card.classList.add("fade-out");
                    setTimeout(() => {
                        setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId))
                    }, 1500)
                }
                toast.success(data.message);
            }
        } catch (error) {
            console.error('Error deleting goal: ', error);
            toast.error('Goal is not deleted!')
        }
    }
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
                        <div id={goal._id} key={goal._id} className="goal_card">
                            <div className="goal_header">
                                <span className="goal_icon">🎯</span>
                                <h3 className="goal_name">{goal.title}</h3>
                            </div>
                            <p className="goal_amount">${goal.currentAmount.toFixed(2)}/${goal.amount.toFixed(2)}</p>
                            {isActiveTopUp === goal._id ? (
                                <div className="top_up_inline fade_in">
                                    <input type="number" min="1" placeholder="Enter amount" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className="top_up_input" autoFocus />
                                    <IconButton onClick={() => handleTopUp(goal._id)} className="top_up_btn">
                                        <Check className="top_up_check_icon" />
                                    </IconButton>
                                    <IconButton onClick={() => handleCancel()}>
                                        <X className="cancel_icon" />
                                    </IconButton>
                                </div>
                            ) : (
                                <Button className={`show_top_up_btn ${animateButton ? "fade_in_up" : ""}`} onClick={() => setIsActiveTopUp(goal._id)}>💵 Top Up</Button>
                            )}
                            <div className="footer_goal_cards">
                                <p className="goal_date">Created: {new Date(goal.date).toLocaleDateString()}</p>
                                <IconButton onClick={() => handleDeleteGoal(goal._id)} className="delete_goal_btn_wrapper">
                                    <Hammer className="delete_goal_btn" />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    )
}
