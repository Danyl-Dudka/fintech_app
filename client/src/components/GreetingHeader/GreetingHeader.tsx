import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import './greetingHeader.css'
import { Sun, BanknoteArrowUp, BanknoteArrowDown } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../content';
import { useNavigate } from 'react-router-dom';
export default function GreetingHeader() {
    const { setIsAuth } = useContext(AuthContext)
    const navigate = useNavigate();
    const fullname = sessionStorage.getItem('fullname');
    const initials = fullname?.split(' ').map(name => name[0]?.toUpperCase()).join('');

    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        setIsAuth(false)
        navigate('/login')
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className="header_wrapper">
            <div className="upper_part_header">
                <div className='left_section'>
                    <p className='title_upper'>Finance Overview</p>
                </div>
                <div className='right_section'>
                    <IconButton className="theme_button">
                        <Sun fontSize="inherit" color='white' />
                    </IconButton>
                    <p className='accounting_info'>Current account: <span className='accounting_option'>Trading</span></p>
                    <div className='user_info'>
                        <Button className="user_button" onClick={handleClick}>
                            <span className='user_avatar'>{initials}</span>
                            <span className='user_fullname'>{fullname}</span>
                        </Button>
                    </div>
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem className='menu_item'>Profile</MenuItem>
                    <MenuItem className='menu_item'>Settings</MenuItem>
                    <MenuItem className='menu_item'>
                        <Button color='error' onClick={handleLogout}>Logout</Button>
                    </MenuItem>
                </Menu>
            </div>
            <div className="lower_part_header">
                <div className='text_information'>
                    <p>Welcome back, {fullname}! <span className='overview_info_subtitle'>This is your financial overview.</span></p>
                </div>
                <div className='control_balance_buttons'>
                    <Button className='income_button'><BanknoteArrowUp className='income_icon'/><span className='control_button_text'>Income</span></Button>
                    <Button className='expense_button'><BanknoteArrowDown className='expense_icon'/><span className='control_button_text'>Expense</span></Button>
                </div>
            </div>
        </div>
    )
}
