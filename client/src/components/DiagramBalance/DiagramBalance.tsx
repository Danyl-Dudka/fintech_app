import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { DiagramBalanceProps } from '../types';
import './diagramBalance.css'
export default function DiagramBalance({ incomes, expenses, incomesByCategory, expensesByCategory }: DiagramBalanceProps) {
    const totalData = [
        { type: "Income", amount: incomes },
        { type: "Expense", amount: expenses },
    ];

    return (
        <div className="charts_wrapper">
            <div className="chart_container">
                {incomes === 0 && expenses === 0 ? (
                    <div className="no_data">No income or expenses recorded for this month</div>
                ) : (
                    <ResponsiveContainer width='100%' height={350}>
                        <PieChart >
                            <Pie className='pie' data={totalData} dataKey='amount' nameKey="type" cx='50%' cy='50%' outerRadius={120} label >
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>)}
            </div>

            <div className="chart_container">
                {incomesByCategory.length > 0 ? (
                    <ResponsiveContainer width='100%' height={350}>
                        <PieChart >
                            <Pie className='pie' data={incomesByCategory} dataKey='amount' nameKey="category" cx='50%' cy='50%' outerRadius={120} label >
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no_data">No income recorded this month</div>
                )}
            </div>

            <div className="chart_container">
                {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width='100%' height={350}>
                        <PieChart >
                            <Pie className='pie' data={expensesByCategory} dataKey='amount' nameKey="category" cx='50%' cy='50%' outerRadius={120} label >
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
