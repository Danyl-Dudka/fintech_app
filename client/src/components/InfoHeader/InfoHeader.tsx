import './infoHeader.css';
import { Button } from '@mui/material';
import { HandCoins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function InfoHeader() {
    const navigate = useNavigate();

    return (
        <header>
            <div className='logo_div'>
                <p onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</p>
            </div>
            <div className="info_block">
                <p onClick={() => navigate('/pricing')}>Pricing</p>
                <p onClick={() => navigate('/features')}>Features</p>
                <p onClick={() => navigate('/dashboard')}>Dashboard</p>
                <p onClick={() => navigate('/contacts')}>Contacts</p>
            </div>
            <div className='login_block'>
                <Button variant="contained" className='login_btn' onClick={() => navigate('/login')}>Login</Button>
            </div>
        </header>
    )
}
