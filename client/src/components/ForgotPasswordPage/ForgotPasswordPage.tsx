import { useState } from 'react'
import './forgotPasswordPage.css'
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { HandCoins } from 'lucide-react';
import { forgotPasswordSchema } from '../validation/validationSchema';
import { ValidationError } from 'yup';
import { toast } from 'react-toastify';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendReset = async () => {
        try {
            setFormError(null);
            await forgotPasswordSchema.validate({ email: email.trim() }, { abortEarly: false })
            setIsLoading(true);
            const response = await fetch('http://localhost:3000/forgot-password-send-code', {
                method: 'POST',
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json();
            if (!response.ok) {
                setFormError(data.message || 'Failed to send code');
                setIsLoading(false)
                return;
            }
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
    };

    const handleCheckVerificationCode = async () => {
        try {
            setFormError(null);
            setIsLoading(true);
            const response = await fetch('http://localhost:3000/forgot-password-verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, verificationCode })
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.message || 'Invalid verification code');
                return;
            }
            toast.success(data.message || 'Code verified successfully!');
            sessionStorage.setItem('resetVerified', 'true');            
            sessionStorage.setItem('resetEmail', email);
            
            setTimeout(() => {
                navigate('/new_password')
            }, 1500)
        } catch (error) {
            if (error instanceof ValidationError) {
                setFormError(error.errors[0])
            } else {
                console.error('Verification code error: ', error);
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
                        <p className='reset_instruction'>Enter your email and we’ll send you a password reset code.</p>
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
                                {isLoading ? 'Sending...' : 'Send reset code'}
                            </Button>
                        </div>
                        <p className='back_to_login' onClick={() => navigate('/login')}>Back to login</p>
                    </>
                ) : (
                    <>
                        <h2 className='reset_info'>Verification code sent!</h2>
                        <p className='reset_confirmation'>
                            We’ve sent a password reset code to <strong>{email}</strong>.<br />
                            Please check your inbox and enter the code below.
                        </p>
                        {formError && <p className='server_error_message'>{formError}</p>}
                        <TextField
                            className='forgot_password_field'
                            placeholder='Enter verification code'
                            fullWidth
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <Button className='forgot_btn' onClick={handleCheckVerificationCode}>
                            {isLoading ? 'Verifying...' : 'Verify code'}
                        </Button>
                        <p className='back_to_login' onClick={() => navigate('/login')}>Back to login</p>
                    </>
                )}
            </div>
        </div>
    )
}
