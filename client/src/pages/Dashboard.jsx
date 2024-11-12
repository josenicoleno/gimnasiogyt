import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import { DashPosts } from '../components/DashPosts';
import { DashUser } from '../components/DashUser';
import { DashComments } from '../components/DashComment';
import DashboardComponent from '../components/DashboardComponent';
import DashCategory from '../components/DashCategory';
import DashUserEdit from '../components/DashUserEdit';
import DashAbout from '../components/DashAbout';
import { DashExcercise } from '../components/DashExcercise';
import DashExcerciseCategory from '../components/DashExcerciseCategory';
import DashWhatsapp from '../components/DashWhatsapp';
import { DashContact } from '../components/DashContact';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) { setTab(tabFromUrl) }
  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="md:w-56 ">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Dashboard */}
      {tab === 'dashboard' && <DashboardComponent />}
      {/* Profile */}
      {tab === 'profile' && <DashProfile />}
      {/* Users */}
      {tab === 'users' && <DashUser />}
      {tab === 'userupdate' && <DashUserEdit />}  
      {/* Posts */}
      {tab === 'posts' && <DashPosts />}
      {/* Excersises */}
      {tab === 'excercises' && <DashExcercise />}
      {/* Excersise Categories */}
      {tab === 'excerciseCategories' && <DashExcerciseCategory />}
      {/* Comments */}
      {tab === 'comments' && <DashComments />}
      {/* Categories */}
      {tab === 'categories' && <DashCategory />}
      {/* About */}
      {tab === 'about' && <DashAbout />}
      {/* WhatsApp */}
      {tab === 'whatsapp' && <DashWhatsapp />}
      {/* Contacts*/}
      {tab === 'contacts' && <DashContact />}
    </div>
  )
}




