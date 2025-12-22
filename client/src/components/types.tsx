export type FormErrors = {
    [key: string]: string
}

export type ModalMode = 'income' | 'expense';


export type BalanceControlModalProps = {
    open: boolean,
    onClose: () => void;
    modalMode: ModalMode;
}

export type GoalModalProps = {
    open: boolean,
    onClose: () => void;
}

export interface CardsBalanceProps {
    income: number;
    expense: number;
    balance: number;
    setIncome: (value: number) => void;
    setExpense: (value: number) => void;
    setBalance: (value: number) => void;
    setSelectedDiagram: (value: 'summary' | 'income' | 'expense') => void;
}

export type CategoryAmount = {
    category: string;
    amount: number;
}

export type DiagramBalanceProps = {
    incomes: number;
    expenses: number;
    incomesByCategory: CategoryAmount[];
    expensesByCategory: CategoryAmount[];
    selectedDiagram: 'summary' | 'income' | 'expense';
}

export interface TransactionPageProps {
    type: 'all' | 'income' | 'expense';
}

export interface Transactions {
    _id: string;
    userId: string;
    amount: number;
    description: string;
    category: string;
    type: "income" | "expense";
    date: string;
}

export interface Goal {
    _id: string;
    title: string;
    currentAmount: number;
    amount: number;
    date: string;
}

export type AppMode = 'finance' | 'crypto';
