import './dashboardPage.css';

export default function DashboardPage() {
    return (
        <div className="dashboard_wrapper">
            <div className='dashboard_info'>
                <p className='dashboard_title'>Smart Finance <span className='word_dashboard_title'>dashboard</span></p>
                <p className='dashboard_subtitle'>Track performance, monitor growth, and make smarter decisions with our advanced financial tools.</p>
            </div>
            <div className='dashboard_pictures'>
                <img className='financial_insights_picture' src="/financial_insights.png" alt="financial_insights_picture" />
                <img className='financial_metrics_picture' src="/financial_metrics.png" alt="financial_metrics_picture" />
            </div>
        </div>
    )
}
