import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import GreetingHeader from "../GreetingHeader/GreetingHeader";
import './projectApp.css'
export default function ProjectApp() {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId')
        if (!token || !sessionUserId) {
            navigate('/login')
        } else if (urlUserId !== sessionUserId) {
            navigate(`/app/${sessionUserId}`)
        }
    }, [urlUserId, navigate])
    return (
        <div className="project_app_wrapper">
            <GreetingHeader />
        </div>
    )
}
