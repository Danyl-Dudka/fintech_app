export type FormErrors = {
    [key: string]: string
}

export type ModalMode = 'income' | 'expense';

export type BalanceControlModalProps = {
    open: boolean,
    onClose: () => void;
    modalMode: ModalMode;
    refreshData: () => Promise<void>;
}