export type FormErrors = {
    [key: string]: string
}

export type ModalMode = 'income' | 'expense';

export type BalanceControlModalProps = {
    open: boolean,
    onClose: () => void;
    modalMode: ModalMode;
}

export interface CardsBalanceProps {
    income: number;
    expense: number;
    balance: number;
    setIncome: (value: number) => void;
    setExpense: (value: number) => void;
    setBalance: (value: number) => void;
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
}

export interface TransactionPageProps {
    type: 'all' | 'income' | 'expense';
}