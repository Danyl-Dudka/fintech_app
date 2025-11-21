import { Button, TextField } from '@mui/material'
import './loginPage.css'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import type { FormErrors } from '../types';
import { AuthContext } from '../../content';
import { HandCoins } from 'lucide-react';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const { setIsAuth, setBalance } = useContext(AuthContext)
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        setShowWelcome(false)
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })

            const data = await response.json();

            if (response.ok) {
                setFormErrors({});

                sessionStorage.setItem("token", data.accessToken);
                sessionStorage.setItem("userId", data.userId);
                sessionStorage.setItem("fullname", data.fullname);

                setIsAuth(true);
                setBalance(data.balance);

                setTimeout(() => {
                    setIsLoading(false);
                    setShowWelcome(true);
                }, 600)

                setTimeout(() => {
                    setEmail('');
                    setPassword('');
                    navigate(`/app/${data.userId}`)
                }, 1800)
            } else {
                setFormErrors({ server: data.message })
            }
        } catch (error) {
            toast.error('Login failed!')
            console.error('Error: ', error)
        }
    }


    return (
        <div className='login_wrapper'>
            <div className='login_inputs'>
                <div className="logo_container">
                    <span className="logo_button" onClick={() => navigate('/')}><HandCoins className='logo_icon' />Spendora</span>
                </div>
                {showWelcome && (
                    <div className='welcome_block'>
                        <h2 className='welcome_title'>Welcome back!</h2>
                        <p className='welcome_sub'>Loading your finance dashboard...</p>
                    </div>
                )}
                {isLoading && !showWelcome && (
                    <div className="loading_wrapper">
                        <div className="loader_circle"></div>
                    </div>

                )}
                {!isLoading && !showWelcome && (
                    <>
                        <div className='label_container'>
                            <p className='sign_information'>Sign in to your account</p>
                        </div>
                        {formErrors.server && <p className='server_error_message'>{formErrors.server}</p>}
                        <div className='login_input'>
                            <span>Email</span>
                            <TextField variant="outlined" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="login_field" />                </div>
                        <div className='password_input'>
                            <span>Password</span>
                            <TextField variant='outlined' type="password" className='password_field' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='forgot_password_block'>
                            <p className='forgot_password_link' onClick={() => navigate('/forgot_password')}>Forgot password?</p>
                        </div>
                        <div className='login_button_container'>
                            <Button className='login_button' onClick={handleLogin}>Sign in</Button>
                        </div>
                        <div className='register_button_container'>
                            <p className='no_account_p' onClick={() => navigate('/register')}>No account?</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
