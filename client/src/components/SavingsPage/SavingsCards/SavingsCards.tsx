import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import type { Goal } from "../../types";
import './savingsCards.css'
import { Check, Hammer, X } from "lucide-react";
import { Button, IconButton, Modal } from "@mui/material";
import { toast } from "react-toastify";
import { api } from "../../../api/api";
export default function SavingsCards() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isActiveTopUp, setIsActiveTopUp] = useState<string | null>(null);
    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [animateButton, setAnimateButton] = useState(false);

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

    const handleOpenConfirmModal = (goal: Goal) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setGoalToDelete(goal);
        setOpenConfirmModal(true);
    };

    const handleConfirmBreakGoal = () => {
        if (!goalToDelete) {
            return;
        }

        handleDeleteGoal(goalToDelete._id);
        setGoalToDelete(null);
        setOpenConfirmModal(false);
    }

    const handleCancelBreakGoal = () => {
        setGoalToDelete(null);
        setOpenConfirmModal(false);
    }

    const navigate = useNavigate();
    useEffect(() => {
        const fetchSavingsGoals = async () => {
            const sessionUserId = sessionStorage.getItem('userId');

            try {
                const response = await api(`http://localhost:3000/user/${sessionUserId}/goals`, {
                    method: 'GET',
                });

                const data = await response.json();
                if (response.ok) {
                    setGoals(data.goals || [])
                }
            } catch (error) {
                console.error('Error fetching savings goals: ', error)
            }
        };

        fetchSavingsGoals();
    }, [navigate]);

    const handleTopUp = async (goalId: string) => {
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await api(`http://localhost:3000/user/${userId}/${goalId}/top_up`, {
                method: 'POST',
                body: JSON.stringify({ topUpAmount: Number(topUpAmount) }),
            })

            const data = await response.json();

            if (response.ok) {
                data.goalCompleted ? toast.success(`🎯 ${data.message}`) : toast.info(data.message);

                if (data.returnedAmount && data.returnedAmount > 0) {
                    toast.info(
                        `💸 You only needed $${(Number(topUpAmount) - data.returnedAmount).toFixed(2)} to complete this goal.
                        $${data.returnedAmount.toFixed(2)} was returned to your balance.
                        `)
                }

                setGoals((prevGoals) => prevGoals.map((goal) => goal._id === goalId ? { ...goal, currentAmount: data.updatedGoal.currentAmount } : goal));
                setTopUpAmount('')
                setIsActiveTopUp(null);


            } else {
                if (data.goalCompleted) {
                    toast.warn(data.message)
                } else {
                    toast.error(data.message || "Top up error!")
                }
            }
        } catch (error) {
            console.error('Top up error: ', error);
            toast.error("Server error during top up!")
        }
    }

    const handleCancel = () => {
        setAnimateButton(true);
        setIsActiveTopUp(null);
        setTopUpAmount("");
        setTimeout(() => setAnimateButton(false), 400);
    }

    const handleDeleteGoal = async (goalId: string) => {
        const sessionUserId = sessionStorage.getItem('userId');
        try {
            const response = await api(`http://localhost:3000/user/${sessionUserId}/delete_goal/${goalId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const card = document.getElementById(goalId);
                if (card) {
                    card.classList.add("fade-out");
                    setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId))
                }
            }
        } catch (error) {
            console.error('Error deleting goal: ', error);
            toast.error('Goal is not deleted!')
        }
    }
    return (
        <>
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
                                <div className="goal_progress_wrapper">
                                    <div className="goal_progress_bar">
                                        <div className="goal_progress_fill" style={{ width: `${Math.min((goal.currentAmount / goal.amount) * 100, 100)}%` }}></div>
                                    </div>
                                    <span className="goal_progress_percent">
                                        {Math.min(Math.round((goal.currentAmount / goal.amount) * 100), 100)}%
                                    </span>
                                </div>
                                {isActiveTopUp === goal._id ? (
                                    <div className="top_up_inline fade_in">
                                        <input type="number" min="1" max={goal.amount - goal.currentAmount} placeholder={`Enter amount`} value={topUpAmount}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                const remaining = goal.amount - goal.currentAmount;
                                                if (value > remaining) {
                                                    toast.warn(` You can only add up to $${remaining.toFixed(2)}!`);
                                                    setTopUpAmount(String(remaining))
                                                } else {
                                                    setTopUpAmount(e.target.value)
                                                }
                                            }
                                            }
                                            className="top_up_input" autoFocus />
                                        <IconButton onClick={() => handleTopUp(goal._id)} className="top_up_btn">
                                            <Check className="top_up_check_icon" />
                                        </IconButton>
                                        <IconButton onClick={() => handleCancel()}>
                                            <X className="cancel_icon" />
                                        </IconButton>
                                    </div>
                                ) : (
                                    <Button className={`show_top_up_btn ${animateButton ? "fade_in_up" : ""}`} disabled={goal.currentAmount >= goal.amount} onClick={() => setIsActiveTopUp(goal._id)}>💵 Top Up</Button>
                                )}
                                <div className="footer_goal_cards">
                                    <p className="goal_date">Created: {new Date(goal.date).toLocaleDateString()}</p>
                                    <IconButton onClick={() => handleOpenConfirmModal(goal)} className="delete_goal_btn_wrapper">
                                        <Hammer className="delete_goal_btn" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </div >
            <Modal
                open={openConfirmModal}
                onClose={handleCancelBreakGoal}
                disableEnforceFocus
                disableAutoFocus
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(3px)",
                }}
            >
                <>
                    {goalToDelete && (
                        <div className="confirm_modal">
                            {goalToDelete.currentAmount >= goalToDelete.amount ? (
                                <>
                                    <h2 className="confirm_title success">🎉 Goal Completed!</h2>
                                    <p className="confirm_text">You’ve successfully filled your piggy bank {' '}
                                        <strong>{goalToDelete.title}</strong>
                                        <br />
                                        Would you like to break it and enjoy your savings?
                                    </p>
                                    <div className="confirm_buttons">
                                        <Button
                                            className="confirm_break_btn"
                                            variant="contained"
                                            color="success"
                                            onClick={handleConfirmBreakGoal}
                                        >
                                            Break it 🪙
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className="cancel_break_btn"
                                            color="inherit"
                                            onClick={handleCancelBreakGoal}
                                        >
                                            Keep in closed 🔒
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="confirm_title danger">💔 Break the Piggy Bank?</h2>
                                    <p className="confirm_text">
                                        Are you sure you want to break your goal {' '}
                                        <strong>{goalToDelete.title}</strong>
                                        <br />
                                        All saved funds will be returned to your balance.
                                    </p>
                                    <div className="confirm_buttons">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleConfirmBreakGoal}
                                        >
                                            Break it 💣
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleCancelBreakGoal}
                                        >
                                            Keep saving 🪙
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            </Modal>
        </>
    )
}
