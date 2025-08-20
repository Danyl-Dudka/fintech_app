import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@mui/material";
import { AuthContext } from "../../content";
export default function ProjectApp() {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();
    const { setIsAuth } = useContext(AuthContext)

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const sessionUserId = sessionStorage.getItem('userId')
        if (!token || !sessionUserId) {
            navigate('/login')
        } else if (urlUserId !== sessionUserId) {
            navigate(`/app/${sessionUserId}`)
        }
    }, [urlUserId, navigate])

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        setIsAuth(false)
        navigate('/login')
    }
    return (
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}
