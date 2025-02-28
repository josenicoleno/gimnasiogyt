import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import { DashPosts } from '../components/DashPosts';
import { DashUser } from '../components/DashUser';
import { DashComments } from '../components/DashComment';
import DashboardComponent from '../components/DashboardComponent';
import DashCategory from '../components/DashCategory';
import DashAbout from '../components/DashAbout';
import { DashExercise } from '../components/DashExercise';
import DashExerciseCategory from '../components/DashExerciseCategory';
import DashWhatsapp from '../components/DashWhatsapp';
import { DashContact } from '../components/DashContact';
import DashUserUpdate from '../components/DashUserUpdate';
import { DashPersonalRecord } from '../components/DashPersonalRecord';
import DashSettingLogo from '../components/DashSettingLogo';
import DashSettingSocialNetworks from '../components/DashSettingSocialNetworks';
import { DashMachines } from '../components/DashMachines';

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
      {/* Personal records */}
      {tab === 'personalRecords' && <DashPersonalRecord />}
      {/* Users */}
      {tab === 'users' && <DashUser />}
      {/* Users update */}
      {tab === 'userupdate' && <DashUserUpdate />}
      {/* Posts */}
      {tab === 'posts' && <DashPosts />}
      {/* Exersises */}
      {tab === 'exercises' && <DashExercise />}
      {/* Machines */}
      {tab === 'machines' && <DashMachines />}
      {/* Comments */}
      {tab === 'comments' && <DashComments />}
      {/* Contacts*/}
      {tab === 'contacts' && <DashContact />}
      
      {/* SETTINGS */}
      {/* Post Categories */}
      {tab === 'categories' && <DashCategory />}
      {/* Excersise Categories */}
      {tab === 'exerciseCategories' && <DashExerciseCategory />}
      {/* About */}
      {tab === 'about' && <DashAbout />}
      {/* WhatsApp */}
      {tab === 'whatsapp' && <DashWhatsapp />}
      {/* Logo y marca */}
      {tab === 'settingLogo' && <DashSettingLogo />}
      {/* Social networks */}
      {tab === 'socialNetworks' && <DashSettingSocialNetworks />}
    </div>
  )
}




