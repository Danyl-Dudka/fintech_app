import type { TransactionPageProps } from "../types";

export default function TransactionsHistory({ type }: TransactionPageProps) {
  return (
    <div style={{ color: 'white' }}>{type === 'all' ? 'All Transaction' : type === 'income' ? 'Incomes transaction' : 'Expenses transaction'}</div>
  )
}
