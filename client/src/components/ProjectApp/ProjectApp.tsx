import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import GreetingHeader from "../GreetingHeader/GreetingHeader";
import './projectApp.css'
import { AuthContext } from "../../content";
import { BanknoteArrowUp, BanknoteArrowDown, Wallet } from "lucide-react";
export default function ProjectApp() {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();
    const { balance, setBalance } = useContext(AuthContext);

    const fetchBalance = async () => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');
        if (!token || !sessionUserId) {
            navigate('/login')
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/user/${sessionUserId}/balance`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });

            const data = await response.json();

            if (response.ok) {
                setBalance(data.balance);
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 5000);
        return () => clearInterval(interval);
    })

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId');
        if (!token || !sessionUserId) {
            navigate('/login')
        } else if (urlUserId !== sessionUserId) {
            navigate(`/app/${sessionUserId}`)
        }
    }, [urlUserId, navigate]);

    return (
        <div className="project_app_wrapper">
            <GreetingHeader />
            <div className="financial_cards">
                <div className="current_balance_card">
                    <div className="money_information">
                        <p className="balance_title">Current balance: <span className="balance_number">CAD ${balance.toFixed(2)}</span></p>
                    </div>
                    <div className="wallet_icon">
                        <Wallet />
                    </div>
                </div>
            </div>
        </div>
    )
}
