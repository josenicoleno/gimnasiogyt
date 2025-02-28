import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
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
import UpdateExercise from './pages/UpdateExercise'
import CreateExercise from './pages/CreateExercise'
import Exercise from './pages/Exercise'
import SearchExercise from './pages/SearchExercise'
import Registration from './pages/Registration'
import WhatsappButton from './components/WhatsappButton'
import './utils/fetchInterceptor';
import { setupAxiosInterceptors } from './utils/axiosInterceptor';
import { useEffect } from 'react';
import CreatePersonalRecord from './pages/CreatePersonalRecord'
import CreateMachine from './pages/CreateMachine'

export default function App() {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

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
        <Route path='/search' element={<Search />} />
        <Route path='/searchExercise' element={<SearchExercise />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/contact-me' element={<ContactMe />} />
        <Route path='/post/:postSlug' element={<Post />} />
        <Route path='/exercise/:exerciseSlug' element={<Exercise />} />
        <Route path='/registration' element={<Registration />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/create-personal-record' element={<CreatePersonalRecord />} />
          <Route path='/update-personal-record/:recordId' element={<CreatePersonalRecord />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoutes />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
          <Route path='/create-exercise' element={<CreateExercise />} />
          <Route path='/update-exercise/:exerciseId' element={<UpdateExercise />} />
          <Route path='/create-machine' element={<CreateMachine />} />
          </Route>
        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <WhatsappButton />
      <Footer />
    </BrowserRouter>
  )
}