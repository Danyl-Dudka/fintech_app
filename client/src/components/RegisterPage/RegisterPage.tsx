import { Button, TextField } from "@mui/material";
import './registerPage.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import registerSchema from "../validation/validationSchema";
import { ValidationError } from "yup";
import type { FormErrors } from "../types";

export default function RegisterPage() {
    const [fullname, setFullname] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await registerSchema.validate(
                { fullname, login, password, confirmPassword },
                { abortEarly: false }
            )
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, login, password, confirmPassword })
            })
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Registration successful!');
                setFormErrors({})
                setTimeout(() => {
                    setFullname('');
                    setLogin('');
                    setPassword('');
                    setConfirmPassword('');
                    navigate('/login')
                }, 1500)
            } else {
                toast.error(data.message || 'Registration failed')
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
                toast.error('Unexpected error during validation!')
                console.error('Server error: ', error)
            }
        }
    }

    return (
        <div className='register_wrapper'>
            <div className='register_inputs'>
                <div className="icon_container">
                    <span className="icon">$</span>
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
                    <span>Login</span>
                    <TextField
                        className='login_field'
                        placeholder='Enter your login'
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    {formErrors.login && <p className="error_message">{formErrors.login}</p>}
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
                    <Button className='register_button' onClick={handleRegister}>Register</Button>
                </div>

                <div className='login_button_container'>
                    <p className='account_login_p' onClick={() => navigate('/login')}>Already have an account?</p>
                </div>
            </div>
        </div>
    );
}
