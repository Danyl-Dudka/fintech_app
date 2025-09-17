import HistoryPageHeader from "../HistoryPageHeader/HistoryPageHeader";
import type { TransactionPageProps } from "../types";
import './transactionsPage.css';
export default function TransactionsHistory({ type }: TransactionPageProps) {
  return (
    <>
      <HistoryPageHeader />
      <div style={{ color: 'white' }}>{type === 'all' ? 'All Transaction' : type === 'income' ? 'Incomes transaction' : 'Expenses transaction'}</div>
    </>
  )
}
