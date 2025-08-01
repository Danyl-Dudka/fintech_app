import { Button } from '@mui/material'
import './pricingPage.css'
import { Check } from 'lucide-react'
export default function PricingPage() {
    return (
        <div className='pricing_wrapper'>
            <div className='pricing_info'>
                <div className='pricing_text'>
                    <p className='pricing_title'>Find the Right Plan to Reach <span className='pricing_special_word'>Your Goal</span></p>
                    <p className='pricing_subtitle'>Manage your finances smarter — track your budget, grow your portfolio, and make informed decisions with ease.</p>
                </div>
                <div className='pricing_cards'>
                    <div className='pricing_first_card'>
                        <p className='price_title'>Standard</p>
                        <p className='price_money'>CAD $149/month</p>
                        <p className='price_subtitle'>A smart choice for professionals and compact teams focused on simplifying their financial workflows.</p>
                        <div className='button_container'>
                            <Button variant='contained' className='standart_button'>Upgrade to Standart</Button>
                        </div>
                        <p className='cycle_info'>Monthly billing cycle</p>
                        <p className='start_of_ul'>Plan Features:</p>
                        <ul className='feautures_ul'>
                            <li className='element_of_features'><Check className='check_icon' />Real-time transaction tracking</li>
                            <li className='element_of_features'><Check className='check_icon' />Core financial reporting dashboard</li>
                            <li className='element_of_features'><Check className='check_icon' />Streamlined budget management</li>
                            <li className='element_of_features'><Check className='check_icon' />Foundational expense categorization</li>
                            <li className='element_of_features'><Check className='check_icon' />Smart savings suggestions powered by automation</li>
                            <li className='element_of_features'><Check className='check_icon' />Access for one user account</li>
                        </ul>
                    </div>
                    <div className='pricing_second_card'>
                        <p className='price_title'>Premium</p>
                        <p className='price_money'>CAD $219/month</p>
                        <p className='price_subtitle'>Built for expanding companies that require intelligent marketing automation and data-driven growth.</p>
                        <div className='button_container'>
                            <Button variant='contained' className='premium_button'>Upgrade to Premium</Button>
                        </div>
                        <p className='cycle_info'>Monthly billing cycle</p>
                        <p className='start_of_ul'>Plan Features:</p>
                        <ul className='feautures_ul'>
                            <li className='element_of_features'><Check className='check_icon' />Cash flow forecasting</li>
                            <li className='element_of_features'><Check className='check_icon' />Custom financial goal setting</li>
                            <li className='element_of_features'><Check className='check_icon' />Advanced budgeting and expense management</li>
                            <li className='element_of_features'><Check className='check_icon' />Customizable dashboards and reports</li>
                            <li className='element_of_features'><Check className='check_icon' />Multi-account access</li>
                            <li className='element_of_features'><Check className='check_icon' />24/7 priority customer support</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
