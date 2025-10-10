import { useState } from "react";
import './aiBalance.css'
export default function AIBalance({ userId }: { userId: string }) {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");

    const handleAsk = async () => {
        if (!userId) {
            setAnswer("User not logged in");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/user/${userId}/ai_query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setAnswer(data.answer);
        } catch (err) {
            console.error(err);
            setAnswer("Error connecting to AI server");
        }
    };

    const handleAskPopularCategory = async () => {
        if (!userId) {
            setAnswer("User not logged in");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/user/${userId}/ai_popular_category`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            setAnswer(`Most popular category: ${data.popularCategory}, total: $${data.total}\nAI: ${data.aiAnswer}`);
        } catch (err) {
            console.error(err);
            setAnswer("Error connecting to AI server");
        }
    };

    return (
        <div className="ai_balance_wrapper">
            <input
                type="text"
                placeholder="Ask AI about your balance"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleAsk}>Ask AI</button>
            <button onClick={handleAskPopularCategory}>Most Popular Category</button>
            <p>{answer}</p>
        </div>
    );
}
