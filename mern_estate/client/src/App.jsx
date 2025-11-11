import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import { supabase } from './supabase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from './redux/user/userSlice'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Fetch user from backend
        try {
          const res = await fetch('/api/users/me', {
            method: 'GET',
            credentials: 'include'
          })
          if (res.ok) {
            const data = await res.json()
            dispatch(signInSuccess(data))
          }
        } catch (error) {
          console.log('Error fetching user:', error)
        }
      }
    }
    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              photo: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
            })
          })
          if (res.ok) {
            const data = await res.json()
            dispatch(signInSuccess(data))
          }
        } catch (error) {
          console.log('Could not complete authentication:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        // Optionally handle sign out
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/sign-in" element={<SignIn/>} />
      <Route path="/sign-up" element={<SignUp/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/listing/:id" element={<Listing/>} />
      <Route path="/search" element={<Search/>} />
      <Route element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/create-listing" element={<CreateListing/>} />
        <Route path="/update-listing/:id" element={<UpdateListing/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

                       