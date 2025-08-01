import { Button } from '@mui/material';
import './mainPage.css';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function MainPage() {

    const navigate = useNavigate();

    return (
        <div className="about_info">
            <p className='main_title'>See Where Every Dollar Goes</p>
            <p className='subtitle'>Clear, intuitive tools for smarter budgeting</p>
            <Button variant='contained' onClick={() => navigate('/login')}>Get started<MoveRight className='arrow_icon' /></Button>
            <div className='image-wrapper'>
                <img src="/example_page.png" alt="example_project_page" />
            </div>
        </div>
    )
}
