import { HandCoins } from 'lucide-react';
import './createNewPasswordPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function CreateNewPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verified = sessionStorage.getItem('resetVerified');

        if (!verified) {
            navigate('/forgot_password')
        }
    }, [navigate]);
    return (
        <div className="create_new_password_wrapper">
            <div className='forgot_box'>
                <div className="logo_container">
                    <span className="logo_button" onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</span>
                </div>
                <h2 className="reset_info">Create new password</h2>
                <p className="reset_instruction">
                    Your new password must be different from the previous one.
                </p>
                {formError && <p className="server_error_message">{formError}</p>}

                <TextField
                    type="password"
                    placeholder='Enter new password'
                    className='forgot_password_field'
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <TextField
                    type="password"
                    placeholder='Confirm new password'
                    className='forgot_password_field confirmation_password'
                    fullWidth
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <div className="forgot_btn_container">
                    <Button
                        className="forgot_btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save new password'}
                    </Button>
                </div>
                <p className="back_to_login" onClick={() => navigate('/login')}>
                    Back to login
                </p>
            </div>
        </div>
    )
}
