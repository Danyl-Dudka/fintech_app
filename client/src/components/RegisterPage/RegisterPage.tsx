import { Button, TextField } from "@mui/material";
import './registerPage.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerSchema from "../validation/validationSchema";
import { ValidationError } from "yup";
import type { FormErrors } from "../types";
import { HandCoins } from "lucide-react";

export default function RegisterPage() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        setIsLoading(true);
        setIsSuccess(false)
        try {
            await registerSchema.validate(
                { fullname, email, password, confirmPassword },
                { abortEarly: false }
            )
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password, confirmPassword })
            })
            const data = await response.json();

            if (response.ok) {
                setFormErrors({});
                sessionStorage.setItem('emailVerification', email);

                setTimeout(() => {
                    setIsLoading(false);
                    setIsSuccess(true)
                }, 500)

                setTimeout(() => {
                    navigate('/email_verification', {
                        state: { email }
                    })
                }, 1600)
            } else {
                setIsLoading(false);
                setFormErrors({ server: data.message })
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                const errors: FormErrors = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path as keyof FormErrors] = err.message
                    }
                })
                setFormErrors(errors)
            } else {
                console.error('Server error: ', error)
            }
        }
    }

    return (
        <div className='register_wrapper'>
            <div className='register_inputs'>
                <div className="logo_container">
                    <span className="logo_button" onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</span>
                </div>

                <p className='sign_information'>Create an account</p>

                <div className='fullname_input'>
                    <span>Fullname</span>
                    <TextField
                        className='fullname_field'
                        placeholder='Enter your fullname'
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    {formErrors.fullname && <p className="error_message">{formErrors.fullname}</p>}
                </div>

                <div className='login_input'>
                    <span>Email</span>
                    <TextField
                        className='login_field'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && <p className="error_message">{formErrors.email}</p>}
                </div>

                <div className='password_input'>
                    <span>Password</span>
                    <TextField
                        type="password"
                        className='password_field'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && <p className="error_message">{formErrors.password}</p>}
                </div>

                <div className="confirm_password_input">
                    <span>Confirm Password</span>
                    <TextField
                        type="password"
                        className='confirm_password_field'
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {formErrors.confirmPassword && <p className="error_message">{formErrors.confirmPassword}</p>}
                </div>

                <div className='register_button_container'>
                    <Button className={`register_button ${isLoading ? 'loading' : ''} ${isSuccess ? 'success' : ''}`} onClick={handleRegister} disabled={isLoading || isSuccess}>
                        {!isLoading && !isSuccess && 'Register'}
                        {isLoading && <span className="loader_small"></span>}
                        {isSuccess && <span className="checkmark">✔</span>}
                    </Button>
                </div>

                <div className='login_button_container'>
                    <p className='account_login_p' onClick={() => navigate('/login')}>Already have an account?</p>
                </div>
            </div>
        </div>
    );
}
