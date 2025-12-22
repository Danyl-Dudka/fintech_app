import { Button, Menu, MenuItem } from '@mui/material';
import './savingsPageHeader.css'
import { CornerDownLeft } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../content';
import { useNavigate } from 'react-router-dom';
export default function SavingsPageHeader() {
    const { setIsAuth } = useContext(AuthContext)
    const navigate = useNavigate();
    const fullname = sessionStorage.getItem('fullname');
    const userId = sessionStorage.getItem('userId');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        setIsAuth(false)
        navigate('/login')
    }

    const handleMainPageNavigate = () => {
        navigate(`/app/${userId}`)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <div className="header_wrapper">
                <div className="upper_part_header">
                    <div className='left_section'>
                        <p className='title_upper'>Savings</p>
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
                        <p>Here’s your savings overview, {fullname}! <span className='overview_info_subtitle'>Track your total savings progress and recent deposits below.</span></p>
                    </div>
                    <div className='control_balance_buttons'>
                        <Button disableRipple className='move_back_button' onClick={handleMainPageNavigate}><CornerDownLeft className='return_icon_header' /><span className='control_button_text'>Return to Dashboard</span></Button>
                    </div>
                </div>
            </div>
        </>
    )
}
