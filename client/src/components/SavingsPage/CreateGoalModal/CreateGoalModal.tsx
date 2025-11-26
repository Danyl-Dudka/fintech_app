import { Modal, Box, TextField, InputAdornment, Button } from "@mui/material";
import type { GoalModalProps } from "../../types";
import './createGoalModal.css'
import { useState } from "react";
import { api } from "../../../api/api";
export default function CreateGoalModal({ open, onClose }: GoalModalProps) {
    const [goalTitle, setGoalTitle] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

    const sessionUserId = sessionStorage.getItem('userId');

    const handleCreateGoal = async () => {
        try {
            const response = await api(`http://localhost:3000/user/${sessionUserId}/create_goal`, {
                method: 'POST',
                body: JSON.stringify({ goalAmount, goalTitle })
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: data.message || 'Goal was successfully created!', type: 'success' });
                setGoalTitle('');
                setGoalAmount('')
                setTimeout(() => {
                    setNotification(null);
                    onClose();
                    window.location.reload()
                }, 1500)
            }

        } catch (error) {
            setNotification({ message: 'Goal is not created', type: 'error' });
            console.error('Error: ', error)
        }
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                closeAfterTransition
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    className="balance_modal_box"
                >
                    <div className="create_goal_wrapper">
                        <span className="goal_modal_title">ADD NEW GOAL</span>

                        <TextField
                            value={goalAmount}
                            type="number"
                            variant="standard"
                            label="Target amount"
                            className="goal_amount_input"
                            onChange={(event) => setGoalAmount(event.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span className="cad_sign">CAD $</span>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                        <TextField
                            value={goalTitle}
                            type="text"
                            variant="outlined"
                            label="Savings goal"
                            className="goal_name_input"
                            onChange={(event) => setGoalTitle(event.target.value)}
                        />

                        {notification && (
                            <div className={`goal_notification ${notification.type} animate`}>
                                {notification.message}
                            </div>
                        )}
                        <div className="add_goal_button_wrapper">
                            <Button onClick={handleCreateGoal} variant='contained' className="add_goal_button">ADD GOAL</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
