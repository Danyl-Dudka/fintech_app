import { Button, TextField } from '@mui/material'
import './loginPage.css'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import type { FormErrors } from '../types';
import { AuthContext } from '../../content';
import { HandCoins } from 'lucide-react';
export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const { setIsAuth } = useContext(AuthContext)
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            })

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Login successful!');
                setFormErrors({});

                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.userId);
                sessionStorage.setItem("fullname", data.fullname);
                
                setIsAuth(true);
                setTimeout(() => {
                    setLogin('');
                    setPassword('');
                    navigate(`/app/${data.userId}`)
                }, 1500)
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
                <div className='label_container'>
                    <p className='sign_information'>Sign in to your account</p>
                </div>
                {formErrors.server && <p className='server_error_message'>{formErrors.server}</p>}
                <div className='login_input'>
                    <span>Login</span>
                    <TextField variant="outlined" placeholder="Enter your login" value={login} onChange={(e) => setLogin(e.target.value)} className="login_field" />                </div>
                <div className='password_input'>
                    <span>Password</span>
                    <TextField variant='outlined' type="password" className='password_field' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='login_button_container'>
                    <Button className='login_button' onClick={handleLogin}>Sign in</Button>
                </div>
                <div className='register_button_container'>
                    <p className='no_account_p' onClick={() => navigate('/register')}>No account?</p>
                </div>
            </div>
        </div>
    )
}
