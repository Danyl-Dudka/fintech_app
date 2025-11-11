import { useState } from 'react'
import './forgotPasswordPage.css'
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { HandCoins } from 'lucide-react';
import { forgotPasswordSchema } from '../validation/validationSchema';
import { ValidationError } from 'yup';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendReset = async () => {
        try {
            setFormError(null);
            await forgotPasswordSchema.validate({ email: email.trim() }, { abortEarly: false })
            setIsLoading(true);
            setIsSent(true)
        } catch (error) {
            if (error instanceof ValidationError) {
                setFormError(error.errors[0])
            } else {
                console.error('Forgot password error: ', error);
            }
        } finally {

            setIsLoading(false)
        }
    }

    return (
        <div className="forgot_password_page_wrapper">
            <div className='forgot_box'>
                <div className="logo_container">
                    <span className="logo_button" onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</span>
                </div>
                {!isSent ? (
                    <>
                        <h2 className='reset_info'>Reset your password</h2>
                        <p className='reset_instruction'>Enter your email and we’ll send you a reset link.</p>
                        {formError && <p className='server_error_message'>{formError}</p>}
                        <TextField
                            className='forgot_password_field'
                            placeholder='Enter your email'
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className='forgot_btn_container'>
                            <Button className='forgot_btn' onClick={handleSendReset} disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send reset link'}
                            </Button>
                        </div>
                        <p className='back_to_login' onClick={() => navigate('/login')}>Back to login</p>
                    </>
                ) : (
                    <>
                        <h2 className='reset_info'>Email sent!</h2>
                        <p className='reset_confirmation'>
                            We’ve sent a password reset link to <strong>{email}</strong>.<br />
                            Please check your inbox and follow the instructions.
                        </p>
                        <Button className='forgot_btn' onClick={() => navigate('/login')}>
                            Back to login
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
