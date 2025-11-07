import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { DiagramBalanceProps } from '../types';
import './diagramBalance.css';
import { useNavigate } from 'react-router-dom';
import { INCOME_CATEGORY_COLORS, EXPENSE_CATEGORY_COLORS } from './constants.ts';
import { useContext } from 'react';
import { AuthContext } from '../../content.ts';
export default function DiagramBalance({ incomes, expenses, incomesByCategory, expensesByCategory, selectedDiagram }: DiagramBalanceProps) {

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

    const renderCustomLegend = (props: any) => {
        const { payload } = props;
        if (!payload || payload.length === 0) {
            return null;
        }

        const sortedPayload = [...payload].sort((a: any, b: any) => {
            const amountA = Number(a.payload.amount ?? 0);
            const amountB = Number(b.payload.amount ?? 0);

            return amountB - amountA;
        });

        return (
            <ul className='legend_ul'>
                {sortedPayload.map((entry: any, index: number) => {
                    const name = entry.value;
                    const amount = Number(entry.payload.amount ?? 0);
                    const color = entry.color;

                    return (
                        <li key={`legend-${index}`} className='legend_li'>
                            <span className='legend_color_span' style={{ backgroundColor: color }} />
                            <span className='legend_name_span'>{name}</span>
                            <span className='legend_amount_span'>${amount.toFixed(2)}</span>
                        </li>
                    )
                })}
            </ul>
        )
    }
    return (
        <div className="charts_wrapper">
            <h3 className='diagram_title'>
                {selectedDiagram === "summary" ? 'Your Monthly Financial Snapshot' : selectedDiagram === 'income' ? 'Where Your Money Comes From' : 'Where Your Money Goes'}
            </h3>
            {selectedDiagram === 'summary' && (
                <div className="chart_container summary">
                    {incomes === 0 && expenses === 0 ? (
                        <div className="no_data">No income or expenses recorded for this month</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={430}>
                            <PieChart >
                                <Pie animationDuration={800} className='pie' onClick={summaryAmountNavigate} data={totalData} dataKey='amount' nameKey="type" cx='50%' cy='50%' outerRadius={150} labelLine={false} label={false} >
                                    {totalData.map((transaction) => (
                                        <Cell key={transaction.type} fill={transaction.color} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} content={renderCustomLegend} />
                            </PieChart>
                        </ResponsiveContainer>)}
                </div>
            )}

            {selectedDiagram === 'income' && (
                <div className="chart_container income">
                    {incomesByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={430}>
                            <PieChart >
                                <Pie animationDuration={800} className='pie' onClick={incomesAmountNavigate} data={incomesByCategory} dataKey='amount' nameKey="category" cx='50%' cy='50%' outerRadius={150} labelLine={false} label={false}  >
                                    {incomesByCategory.map((transaction, index) => (
                                        <Cell key={transaction.category} fill={INCOME_CATEGORY_COLORS[index % INCOME_CATEGORY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} content={renderCustomLegend} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no_data">No income recorded this month</div>
                    )}
                </div>
            )}

            {selectedDiagram === 'expense' && (
                <div className="chart_container expense">
                    {expensesByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={430}>
                            <PieChart >
                                <Pie animationDuration={800} className='pie' onClick={expensesAmountNavigate} data={expensesByCategory} dataKey='amount' nameKey="category" cx='50%' cy='50%' labelLine={false} outerRadius={150} label={false} >
                                    {expensesByCategory.map((transaction, index) => (
                                        <Cell key={transaction.category} fill={EXPENSE_CATEGORY_COLORS[index % EXPENSE_CATEGORY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} content={renderCustomLegend} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no_data">No expenses recorded this month</div>
                    )}
                </div>
            )}

        </div>
    )
}