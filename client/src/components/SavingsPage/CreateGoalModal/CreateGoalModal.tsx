import { Modal, Box, TextField, InputAdornment, Button } from "@mui/material";
import type { GoalModalProps } from "../../types";
import './createGoalModal.css'
import { useState } from "react";
import { toast } from "react-toastify";
export default function CreateGoalModal({ open, onClose }: GoalModalProps) {
    const [goalTitle, setGoalTitle] = useState('');
    const [goalAmount, setGoalAmount] = useState('');

    const sessionUserId = sessionStorage.getItem('userId');

    const handleCreateGoal = async () => {
        try {
            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/create_goal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goalAmount, goalTitle })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Goal was successfully created!');
                setGoalTitle('');
                setGoalAmount('')
                onClose();
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }

        } catch (error) {
            toast.error('Goal is not created');
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
                            type="string"
                            variant="outlined"
                            label="Savings goal"
                            className="goal_name_input"
                            onChange={(event) => setGoalTitle(event.target.value)}
                        />
                        <div className="add_goal_button_wrapper">
                            <Button onClick={handleCreateGoal} variant='contained' className="add_goal_button">ADD GOAL</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
