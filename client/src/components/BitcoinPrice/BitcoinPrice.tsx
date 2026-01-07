import { useEffect, useState } from "react"
import './bitcoinPrice.css'
export default function BitcoinPrice() {
    const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);

    useEffect(() => {
        const fetchBitcoinPrice = async () => {
            try {
                const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
                const data = await res.json();
                setBitcoinPrice(Number(data.price))
            } catch (error) {
                console.error('Error fetching BTC price: ', error)
            }
        }

        fetchBitcoinPrice();

        const interval = setInterval(fetchBitcoinPrice, 1000);
        return () => {
            clearInterval(interval)
        }

    }, [])
    return (
        <div className="bitcoin_price_wrapper">
            <div className="bitcoin_price_info">
                BTC Price: <span className="bitcoin_price">{bitcoinPrice !== null ? `$${bitcoinPrice.toFixed(2)}` : 'Loading...'}</span>
            </div>
        </div>
    )
}
