import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import './greetingHeader.css'
import { Sun, BanknoteArrowUp, BanknoteArrowDown, PiggyBank, Moon } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext, ThemeContext } from '../../content';
import { useNavigate } from 'react-router-dom';
import BalanceControlModal from '../BalanceControlModal/BalanceControlModal';
import type { ModalMode } from '../types';
export default function GreetingHeader() {
    const { setIsAuth } = useContext(AuthContext)
    const navigate = useNavigate();
    const fullname = sessionStorage.getItem('fullname');
    const initials = fullname?.split(' ').map(name => name[0]?.toUpperCase()).join('');

    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('income');

    const { userId } = useContext(AuthContext);

    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        setIsAuth(false)
        navigate('/login')
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenModalIncome = () => {
        setIsModalOpen(true);
        setModalMode('income');
    }

    const handleOpenModalExpense = () => {
        setIsModalOpen(true);
        setModalMode('expense');
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleSavingsNavigate = () => {
        navigate(`/app/${userId}/savings`)
    }

    return (
        <>
            <div className="header_wrapper">
                <div className="upper_part_header">
                    <div className='left_section'>
                        <p className='title_upper'>Finance Overview</p>
                    </div>
                    <div className='right_section'>
                        <IconButton className="theme_button" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun className='theme_icon' fontSize="inherit" color='white' /> : <Moon className='theme_icon' fontSize='inherit' color='white' />}
                        </IconButton> 
                        <p className='accounting_info'>Current account: <span className='accounting_option'>Finance</span></p>
                        <Button onClick={handleSavingsNavigate} className='savings_button'>
                            <span className='savings_title'>Savings</span>
                            <PiggyBank fontSize="inherit" color='white' />
                        </Button>
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
                        <Button disableRipple className='income_button' onClick={handleOpenModalIncome}><BanknoteArrowUp className='income_icon_header' /><span className='control_button_text'>Income</span></Button>
                        <Button disableRipple className='expense_button' onClick={handleOpenModalExpense}><BanknoteArrowDown className='expense_icon_header' /><span className='control_button_text'>Expense</span></Button>
                    </div>
                </div>
            </div>
            <BalanceControlModal
                open={isModalOpen}
                onClose={handleCloseModal}
                modalMode={modalMode}
            />
        </>
    )
}
