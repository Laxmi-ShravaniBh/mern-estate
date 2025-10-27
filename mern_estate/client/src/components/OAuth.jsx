import { supabase } from '../supabase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleAuthSuccess(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, navigate]);

  const handleAuthSuccess = async (user) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          photo: user.user_metadata?.avatar_url || user.user_metadata?.picture
        })
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not complete authentication:', error);
    }
  };

  const handleGoogleClick = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.log('Error signing in with Google:', error);
      }
    } catch (error) {
      console.log('Could not sign in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
