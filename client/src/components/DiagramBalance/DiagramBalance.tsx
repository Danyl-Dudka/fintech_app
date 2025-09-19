import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { DiagramBalanceProps } from '../types';
import './diagramBalance.css';
import { useNavigate } from 'react-router-dom';
import { INCOME_CATEGORY_COLORS, EXPENSE_CATEGORY_COLORS } from './constants.ts';
import { useContext } from 'react';
import { AuthContext } from '../../content.ts';
export default function DiagramBalance({ incomes, expenses, incomesByCategory, expensesByCategory }: DiagramBalanceProps) {

    const { userId } = useContext(AuthContext);

    const navigate = useNavigate();

    const summaryAmountNavigate = () => {
        navigate(`/app/${userId}/all_transactions`)
    };

    const incomesAmountNavigate = () => {
        navigate(`/app/${userId}/incomes_transactions`)
    }

    const expensesAmountNavigate = () => {
        navigate(`/app/${userId}/expenses_transactions`)
    }

    const totalData = [
        { type: "Income", amount: incomes, color: "#4CAF50" },
        { type: "Expense", amount: expenses, color: "#FF4C4C" },
    ].filter(item => item.amount > 0);

    return (
        <div className="charts_wrapper">
            <div className="chart_container summary">
                {incomes === 0 && expenses === 0 ? (
                    <div className="no_data">No income or expenses recorded for this month</div>
                ) : (
                    <ResponsiveContainer width='100%' height={350}>
                        <PieChart >
                            <Pie className='pie' onClick={summaryAmountNavigate} data={totalData} dataKey='amount' nameKey="type" cx='50%' cy='50%' outerRadius={140} label={({ name, value }) => `${name}: $${value?.toFixed(2)}`} >
                                {totalData.map((transaction) => (
                                    <Cell key={transaction.type} fill={transaction.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>)}
            </div>

            <div className="chart_container income">
                {incomesByCategory.length > 0 ? (
                    <ResponsiveContainer width='100%' height={350}>
                        <PieChart >
                            <Pie className='pie' onClick={incomesAmountNavigate} data={incomesByCategory} dataKey='amount' nameKey="category" cx='50%' cy='50%' outerRadius={140} label={({ name, value }) => `${name}: $${value?.toFixed(2)}`} >
                                {incomesByCategory.map((transaction, index) => (
                                    <Cell key={transaction.category} fill={INCOME_CATEGORY_COLORS[index % INCOME_CATEGORY_COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no_data">No income recorded this month</div>
                )}
            </div>

            <div className="chart_container expense">
                {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width='100%' height={350}>
                        <PieChart >
                            <Pie className='pie' onClick={expensesAmountNavigate} data={expensesByCategory} dataKey='amount' nameKey="category" cx='50%' cy='50%' outerRadius={140} label={({ name, value }) => `${name}: $${value?.toFixed(2)}`} >
                                {expensesByCategory.map((transaction, index) => (
                                    <Cell key={transaction.category} fill={EXPENSE_CATEGORY_COLORS[index % EXPENSE_CATEGORY_COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no_data">No expenses recorded this month</div>
                )}
            </div>

        </div>
    )
}