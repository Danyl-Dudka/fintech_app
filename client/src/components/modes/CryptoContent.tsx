import { Route, Routes } from "react-router-dom";
import ProjectCryptoApp from "../ProjectCryptoApp/ProjectCryptoApp";
import PageWrapper from "../PageWrapper";

export default function CryptoContent() {

    return (
        <Routes>
            <Route path="/app/:userId" element={<PageWrapper><ProjectCryptoApp /></PageWrapper>} />
        </Routes>
    )
}
