import { Brain, ChartColumnBig, ChartNoAxesCombined, ChevronsUp, Database } from 'lucide-react'
import './featuresPage.css'

export default function FeaturesPage() {
    return (
        <div>
            <div className='features_wrapper'>
                <div className='title_features'>
                    <p>The Choice of <span className='special_word_title'>Professionals</span> and <span className='special_word_title'>Smart Investors</span></p>
                </div>
                <div className='info_features'>
                    <p className='features_info_title'>Simplified Financial Control</p>
                    <p className='features_info_subtitle'>Stay on top of your finances with smart insights and intuitive tools.</p>
                </div>
            </div>
            <div className='cards_features_wrapper'>
                <div className='first_row_cards'>
                    <div className='first_card_first_row'>
                        <p className='first_row_card_title'><Brain className='card_icon' />Smarter User Experience</p>
                        <p className='first_row_card_subtitle'>Simplify how you manage users with tools designed for clarity and control.</p>
                        <img className='first_row_picture' src="/first_card_first_row_picture.png" alt="first_card_first_row_picture" />
                    </div>

                    <div className='second_card_first_row'>
                        <p className='first_row_card_title'><ChartNoAxesCombined className='card_icon' />Performance Breakdown</p>
                        <p className='first_row_card_subtitle'>Get a clear understanding of your audience and campaign outcomes.</p>
                        <img className='first_row_picture' src="/second_card_first_row_picture.png" alt="second_card_first_row_picture" />
                    </div>

                    <div className='third_card_first_row'>
                        <p className='first_row_card_title'><Database className='card_icon' />Data Insights</p>
                        <p className='first_row_card_subtitle'>Organize, explore, and act on your data with confidence.</p>
                        <img className='first_row_picture' src="/third_card_first_row_picture.png" alt="third_card_first_row_picture" />
                    </div>
                </div>
                <div className='second_row_cards'>
                    <div className='first_card_second_row'>
                        <p className='second_row_card_title'><ChartColumnBig className='card_icon' />Instant Analytics</p>
                        <p className='second_row_card_subtitle'>Stay updated with real-time insights into your campaigns.</p>
                        <img className='second_row_picture' src="/first_card_second_row_picture.png" alt="first_card_second_row_picture" />
                    </div>
                    <div className='second_card_second_row'>
                        <p className='second_row_card_title'><ChevronsUp className='card_icon' />Intelligent Optimization</p>
                        <p className='second_row_card_subtitle'>Deliver better results through continuous performance tuning.</p>
                        <img className='second_row_picture' src="/second_card_second_row_picture.png" alt="first_card_second_row_picture" />
                    </div>
                </div>
            </div>
        </div>
    )
}
