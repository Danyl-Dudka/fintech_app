import { Button, TextField } from '@mui/material'
import './loginPage.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    return (
        <div className='login_wrapper'>
            <div className='login_inputs'>
                <div className="icon_container">
                    <span className="icon">$</span>
                </div>
                <div className='label_container'>
                    <p className='sign_information'>Sign in to your account</p>
                </div>
                <div className='login_input'>
                    <span>Login</span>
                    <TextField  variant="outlined" placeholder="Enter your login" value={login} onChange={(e) => setLogin(e.target.value)} className="login_field" />                </div>
                <div className='password_input'>
                    <span>Password</span>
                    <TextField variant='outlined' type="password" className='password_field' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='login_button_container'>
                    <Button className='login_button'>Sign in</Button>
                </div>
                <div className='register_button_container'>
                    <p className='no_account_p' onClick={() => navigate('/register')}>No account?</p>
                </div>
            </div>
        </div>
    )
}
