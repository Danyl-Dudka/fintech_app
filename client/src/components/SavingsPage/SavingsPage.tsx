import { Button } from "@mui/material";
import SavingsPageHeader from "./SavingsPageHeader/SavingsPageHeader";
import './savingsPage.css'
import { useState } from "react";
import CreateGoalModal from "./CreateGoalModal/CreateGoalModal";
import SavingsCards from "./SavingsCards/SavingsCards";
export default function SavingsPage() {
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const handleGoalModalOpen = () => {
        setIsGoalModalOpen(true)
    }

    const handleGoalModalClose = () => {
        setIsGoalModalOpen(false)
    }
    return (
        <div className="savings_wrapper">
            <SavingsPageHeader />
            <div className="savings_page_wrapper">
                <Button onClick={handleGoalModalOpen} className="create_goal_button" variant="contained">Create new Goal</Button>
                <SavingsCards />
            </div>
            <CreateGoalModal
                open={isGoalModalOpen}
                onClose={handleGoalModalClose}
            />
        </div>
    )
}
