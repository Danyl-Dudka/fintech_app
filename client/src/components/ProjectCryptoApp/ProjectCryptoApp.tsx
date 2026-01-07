import BitcoinPrice from '../BitcoinPrice/BitcoinPrice';
import CryptoBalance from '../CryptoBalance/CryptoBalance';
import GreetingHeader from '../GreetingHeader/GreetingHeader';
import './projectCryptoApp.css';

export default function ProjectCryptoApp() {
    return (
        <div className="project_crypto_app_wrapper">
            <GreetingHeader />
            <BitcoinPrice />
            <CryptoBalance />
        </div>
    )
}
