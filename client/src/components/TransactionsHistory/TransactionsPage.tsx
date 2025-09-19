import { useState, useEffect } from "react";
import HistoryPageHeader from "../HistoryPageHeader/HistoryPageHeader";
import type { TransactionPageProps, Transactions } from "../types";
import './transactionsPage.css';
import { useNavigate } from "react-router-dom";
export default function TransactionsHistory({ type }: TransactionPageProps) {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = sessionStorage.getItem('token');
      const sessionUserId = sessionStorage.getItem('userId');

      if (!token || !sessionUserId) {
        navigate('/login');
        return;
      }

      try {
        let url = `http://localhost:3000/user/${sessionUserId}/transactions`;
        if (type !== 'all') {
          url += `?type=${type}`
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json();

        if (response.ok) {
          setTransactions(data)
        } else if (!response.ok) {
          throw new Error(data.message || 'Error fetching transactions')
        }
      } catch (error: any) {
        console.error(error);
        setError(error.message || 'Error fetching transactions')
      }
    }
    fetchTransactions();
  }, [type, navigate])

  return (
    <>
      <HistoryPageHeader />
      <div className="transaction_history_wrapper">
        <h2 className="transaction_history_title">Transaction History</h2>
        {error && <p className="error_transactions">{error}</p>}
        {transactions.length === 0 && <p className="no_transactions">No transactions found...</p>}
        <ul className="transactions_list">
          {transactions.map(t => (
            <li key={t._id} className="transaction_item">
              <span>{new Date(t.date).toLocaleString()}</span>
              <span>{t.category}</span>
              <span className={`transaction_type ${t.type}`}>{t.type}</span>
              <span>CAD ${t.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
