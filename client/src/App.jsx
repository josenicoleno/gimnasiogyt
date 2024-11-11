import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Projects from './pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoutes from './components/PrivateRoutes'
import OnlyAdminPrivateRoutes from './components/OnlyAdminPrivateRoutes'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import Post from './pages/Post'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import ContactMe from './pages/ContactMe'
import Posts from './pages/Posts'
import UpdateExcercise from './pages/UpdateExcercise'
import CreateExcercise from './pages/CreateExcercise'
import Excercise from './pages/Excercise'
import SearchExcercise from './pages/SearchExcercise'
import Registration from './pages/Registration'
import WhatsappButton from './components/WhatsappButton'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/posts/:category' element={<Posts />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/search' element={<Search />} />
        <Route path='/searchExcercise' element={<SearchExcercise />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/contact-me' element={<ContactMe />} />
        <Route path='/post/:postSlug' element={<Post />} />
        <Route path='/excercise/:excerciseSlug' element={<Excercise />} />
        <Route path='/registration' element={<Registration />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoutes />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
          <Route path='/create-excercise' element={<CreateExcercise />} />
          <Route path='/update-excercise/:excerciseId' element={<UpdateExcercise />} />
        </Route>
        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <WhatsappButton />
      <Footer />
    </BrowserRouter>
  )
}