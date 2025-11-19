import { useEffect, useState } from 'react'
import './emailVerificationPage.css'
import { HandCoins } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { codeSchema } from '../validation/validationSchema';
import { ValidationError } from 'yup';

export default function EmailVerificationPage() {
    const [verificationCode, setVerificationCode] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const storedEmail = sessionStorage.getItem('emailVerification')

    const email = location.state?.email || storedEmail;

    useEffect(() => {

        if (!storedEmail) {
            navigate('/login');
            return
        }
    }, [navigate]);

    if (!email) {
        return null;
    }

    const handleVerify = async () => {
        setIsLoading(true);
        setFormError(null);

        try {
            await codeSchema.validate(
                { code: verificationCode },
                { abortEarly: false }
            );

            const response = await fetch("http://localhost:3000/verify_email", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: verificationCode
                })

            })

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.message);
                setIsLoading(false);
                return;
            }

            setIsCorrect(true);
            setTimeout(() => {
                navigate('/login')
            }, 3000)
            sessionStorage.removeItem('emailVerification');
        } catch (error: any) {
            if (error instanceof ValidationError) {
                setFormError(error.errors[0]);
            } else {
                console.error(error);
                setFormError("Server error. Try again.");
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='email_verification_wrapper'>
            <div className='verification_box'>
                <div className="logo_container">
                    <span className="logo_button" onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</span>
                </div>
                {!isCorrect ? (
                    <>
                        <h2 className='verification_info'>Verify your account</h2>
                        <p className='verification_instruction'>Enter the 6-digit code sent to <strong>{email}</strong>.
                        </p>
                        {formError && <p className='server_error_message'>{formError}</p>}
                        <TextField
                            required
                            className='verification_code_field'
                            placeholder='Enter your code'
                            fullWidth
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />

                        <div className='forgot_btn_container'>
                            <Button className='forgot_btn' disabled={isLoading} onClick={handleVerify}>
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className='success_info'>Account verified!</h2>
                        <p className='success_redirecting'>
                            Your account has been successfully activated.
                            Redirecting to login...
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
