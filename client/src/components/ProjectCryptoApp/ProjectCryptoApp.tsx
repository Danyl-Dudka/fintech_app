import BitcoinPrice from '../BitcoinPrice/BitcoinPrice';
import CreateTransactionHistory from '../CreateTransactionHistory/CreateTransactionHistory';
import GreetingHeader from '../GreetingHeader/GreetingHeader';
import './projectCryptoApp.css';

export default function ProjectCryptoApp() {
    return (
        <div className="project_crypto_app_wrapper">
            <GreetingHeader />
            <BitcoinPrice />
            <CreateTransactionHistory />
        </div>
    )
}
