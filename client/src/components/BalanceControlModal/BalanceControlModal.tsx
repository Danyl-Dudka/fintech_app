import { Modal, Box, TextField, Button, InputAdornment } from "@mui/material";
import type { BalanceControlModalProps, FormErrors } from "../types";
import { transactionSchema } from "../validation/validationSchema";
import { useState } from "react";
import './balanceControlModal.css'
import { toast } from "react-toastify";
import { ValidationError } from "yup";
import { DollarSign, Bitcoin, BriefcaseBusiness, CircleDollarSign, Gift, BanknoteArrowDown, BanknoteArrowUp, PiggyBank, Landmark, Banknote, Files, Cable, GraduationCap } from "lucide-react";
import { House, Coins, Fuel, Apple, Wine, HeartPlus, Drama, Utensils, Coffee } from "lucide-react";
import { api } from "../../api/api";
export default function BalanceControlModal({ open, onClose, modalMode }: BalanceControlModalProps) {
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState<string>('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [selectedCategory, setSelectedCategory] = useState('');

    const [successBanner, setSuccessBanner] = useState(false);

    const incomeCategories = [
        { name: 'Salary', icon: <DollarSign /> },
        { name: 'Freelance', icon: <Banknote /> },
        { name: 'Investments', icon: <Landmark /> },
        { name: 'Business', icon: <BriefcaseBusiness /> },
        { name: 'Bonus', icon: <CircleDollarSign /> },
        { name: 'Gift', icon: <Gift /> },
        { name: 'Refunds', icon: <BanknoteArrowDown /> },
        { name: 'Crypto', icon: <Bitcoin /> },
        { name: 'Cashback', icon: <PiggyBank /> },
        { name: 'Debt Repayment', icon: <BanknoteArrowUp /> },
    ];

    const expenseCategories = [
        { name: 'Rent', icon: <House /> },
        { name: 'Insurance', icon: <Coins /> },
        { name: 'Gas', icon: <Fuel /> },
        { name: 'Groceries', icon: <Apple /> },
        { name: 'Alcohol', icon: <Wine /> },
        { name: 'Savings', icon: <PiggyBank /> },
        { name: 'Health', icon: <HeartPlus /> },
        { name: 'Entertainment', icon: <Drama /> },
        { name: 'Restaurants', icon: <Utensils /> },
        { name: 'Coffee', icon: <Coffee /> },
        { name: 'Documents', icon: <Files /> },
        { name: 'Electrionics', icon: <Cable /> },
        { name: 'Education', icon: <GraduationCap /> }
    ]


    const handleSubmit = async () => {
        const sessionUserId = sessionStorage.getItem('userId');
        try {
            await transactionSchema.validate(
                { amount, description, category: selectedCategory },
                { abortEarly: false }
            )

            const response = await api(`http://localhost:3000/user/${sessionUserId}/money_control`, {
                method: 'POST',
                body: JSON.stringify({ amount, description, category: selectedCategory, type: modalMode })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessBanner(true)
                setFormErrors({});
                setAmount('');
                setDescription('');
                setSelectedCategory('');
                onClose();
                setTimeout(() => {
                    setSuccessBanner(false)
                    window.location.reload();
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
            {successBanner && <div className="tag_success">Saved!</div>}
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

                        {formErrors.category && <p className="error_message">{formErrors.category}</p>}
                        <div className="categories">
                            {modalMode === 'income' ?
                                incomeCategories.map((category) => (
                                    <Button
                                        key={category.name}
                                        startIcon={category.icon}
                                        variant={selectedCategory === category.name ? 'contained' : 'outlined'}
                                        color={selectedCategory === category.name ? 'info' : 'primary'}
                                        onClick={() => setSelectedCategory(category.name)}
                                    >
                                        {category.name}
                                    </Button>
                                ))
                                : expenseCategories.map((category) => (
                                    <Button
                                        key={category.name}
                                        startIcon={category.icon}
                                        variant={selectedCategory === category.name ? 'contained' : 'outlined'}
                                        color={selectedCategory === category.name ? 'info' : 'primary'}
                                        onClick={() => setSelectedCategory(category.name)}
                                    >
                                        {category.name}
                                    </Button>
                                ))
                            }
                        </div>
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
