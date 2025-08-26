import { Modal, Box, TextField, Button } from "@mui/material";
import type { BalanceControlModalProps } from "../types";
import { useState } from "react";
import './balanceControlModal.css'
export default function BalanceControlModal({ open, onClose, modalMode }: BalanceControlModalProps) {
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState<string>('');

    const handleSubmit = () => {
        setAmount('');
        setDescription('');
        onClose();
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
                        />

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
                                onClick={handleSubmit}
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
