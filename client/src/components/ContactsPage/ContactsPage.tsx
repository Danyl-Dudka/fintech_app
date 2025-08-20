import { Button } from '@mui/material'
import './contactsPage.css'
export default function ContactsPage() {
    return (
        <div className='contacts_page_wrapper'>
            <div className="contacts_block">
                <div className="contacts_information">
                    <div className="title_info_contacts">Have Help or Have <span style={{ fontStyle: 'italic' }}>Questions</span>?</div>
                    <div className="subtitle_info_contacts">
                        <p>We're here for you!</p>
                        <span className='description_subtitle_contacts'>Whether you have a question, need assistance, or want to reach out — our team is ready to support you and ensure everything runs smoothly.</span>
                    </div>
                    <Button variant='contained' className='contact_us_btn' onClick={() => window.open('https://t.me/spendora_feedback_bot', '_blank')}>Contact us</Button>
                </div>
            </div>
        </div>
    )
}
''