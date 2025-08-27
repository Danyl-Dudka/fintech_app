import { Modal, Box, TextField, Button, InputAdornment } from "@mui/material";
import type { BalanceControlModalProps, FormErrors } from "../types";
import { transactionSchema } from "../validation/validationSchema";
import { useState } from "react";
import './balanceControlModal.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ValidationError } from "yup";
export default function BalanceControlModal({ open, onClose, modalMode }: BalanceControlModalProps) {
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState<string>('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const navigate = useNavigate();

    const handleSubmitIncome = async () => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');
        if (!token || !sessionUserId) {
            navigate('/login')
            return;
        }
        try {
            await transactionSchema.validate(
                { amount, description },
                { abortEarly: false }
            )
            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/income`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amount, description })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'New transaction was successfully created!');
                setFormErrors({});
                setTimeout(() => {
                    setAmount('');
                    setDescription('');
                    onClose();
                }, 1500)
            } else {
                toast.error(data.message || 'Transaction failed')
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                const errors: FormErrors = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path as keyof FormErrors] = err.message;
                    }
                })
                setFormErrors(errors)
            } else {
                toast.error('Unexpected error during validation!')
                console.error('Server error:', error)
            }
        }

    }

    const handleSubmitExpense = async () => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');

        if (!token || !sessionUserId) {
            navigate('/login');
            return;
        }

        try {
            await transactionSchema.validate(
                { amount, description },
                { abortEarly: false }
            )

            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/expense`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amount, description })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'New transaction was successfully created!');
                setFormErrors({});
                setTimeout(() => {
                    setAmount('');
                    setDescription('');
                    onClose();
                }, 1500)
            } else {
                toast.error(data.message || 'Transaction failed')
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                const errors: FormErrors = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path as keyof FormErrors] = err.message;
                    }
                })
                setFormErrors(errors)
            } else {
                toast.error('Unexpected error during validation!')
                console.error('Server error:', error)
            }
        }
    }
    return (
        <>
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
                    <div className="balance_modal_wrapper">
                        <div className="balance_modal_title">
                            <strong>{modalMode === 'income' ? 'Add New Income' : 'Add New Expense'}</strong>
                        </div>

                        {formErrors.amount && <p className="error_message">{formErrors.amount}</p>}
                        <TextField
                            className={modalMode === 'income' ? "income_textfield" : "expense_textfield"}
                            value={amount}
                            type="number"
                            label="Amount"
                            variant="standard"
                            onChange={(event) => {
                                const value = event.target.value;
                                setAmount(value === '' ? '' : Number(value))
                            }
                            }
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span className={modalMode === 'income' ? 'income_label' : 'expense_label'}>CAD $</span>
                                        </InputAdornment>
                                    ),
                                }
                            }}

                        />

                        {formErrors.description && <p className="error_message">{formErrors.description}</p>}
                        <TextField
                            className={modalMode === 'income' ? "income_textfield" : "expense_textfield"}
                            value={description}
                            type="string"
                            label="Description"
                            variant="outlined"
                            onChange={(event) => setDescription(event.target.value)}
                        />

                        <div className="balance_modal_button">
                            <Button
                                variant='contained'
                                onClick={modalMode === 'income' ? handleSubmitIncome : handleSubmitExpense}

                            >
                                {modalMode === 'income' ? 'Add Income' : 'Add Expense'}
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    )
}
