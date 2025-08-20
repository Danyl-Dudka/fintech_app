import { HandCoins } from 'lucide-react'
import './infoFooter.css';
import { useNavigate } from 'react-router-dom';
export default function InfoFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{ color: 'white' }}>
      <div>
        <div className="info_blocks">
          <div className="first_block">
            <ul>
              <li className="logo_element"><HandCoins className='logo_icon' />Spendora</li>
              <li className="logo_description" style={{ width: 200 }}>Optimize your financial routine—quick, simple, effective.</li>
            </ul>
          </div>
          <div className="second_block">
            <ul>
              <li className='main_li' onClick={() => navigate('/')}>Product</li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/features')}>Features</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/pricing')}>Pricing</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/contacts')}>Testimonials</span></li>
            </ul>
          </div>
          <div className="third_block">
            <ul>
              <li className='main_li'>Solutions</li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Content Creators</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Businesses</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Education</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Enterprise</span></li>
            </ul>
          </div>
          <div className="fourth_block">
            <ul>
              <li className='main_li'>Resources</li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Blog</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Translation Guides</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/contacts')}>Support</span></li>
            </ul>
          </div>
          <div className="fifth_block">
            <ul>
              <li className='main_li'>Company</li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/features')}>About us</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Privacy Policy</span></li>
              <li className='regular_li'> <span className='regular_element' onClick={() => navigate('/')}>Terms & Conditions</span></li>
            </ul>
          </div>
        </div>
        <div className='footer_label'>
          <p>© 2025 Spendora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
