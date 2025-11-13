import { HandCoins } from 'lucide-react';
import './createNewPasswordPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { newPasswordSchema } from '../validation/validationSchema';
import { ValidationError } from 'yup';

export default function CreateNewPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectingMessage, setRedirectingMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const verified = sessionStorage.getItem('resetVerified');
        const savedEmail = sessionStorage.getItem('resetEmail');

        if (!verified || !savedEmail) {
            navigate('/forgot_password')
            return
        }
    }, [navigate]);

    const handleNewPasswordCreate = async () => {
        try {
            setFormError(null);
            await newPasswordSchema.validate({ newPassword, confirmNewPassword }, { abortEarly: false });
            setIsLoading(true);

            const savedEmail = sessionStorage.getItem('resetEmail');

            const response = await fetch('http://localhost:3000/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: savedEmail, newPassword, confirmNewPassword })
            })

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.message || 'Something went wrong')
                return
            }
            setSuccessMessage("Password successfully updated!");
            setTimeout(() => {
                setRedirectingMessage('Redirecting to login page...')
            }, 1000)
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('resetVerified');
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error) {
            if (error instanceof ValidationError) {
                setFormError(error.errors[0])
            } else {
                console.error('Resetting password error: ', error);
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="create_new_password_wrapper">
            <div className='forgot_box'>
                <div className="logo_container">
                    <span className="logo_button" onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</span>
                </div>
                {successMessage ? (
                    <>
                        <p className="success_message">{successMessage}</p>
                        <p className='redirecting_message'>{redirectingMessage}</p>
                    </>
                ) : (
                    <>
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
                                onClick={handleNewPasswordCreate}
                            >
                                {isLoading ? 'Saving...' : 'Save new password'}
                            </Button>
                        </div>
                        <p className="back_to_login" onClick={() => navigate('/login')}>
                            Back to login
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
