import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { uploadFile, getPublicUrl } from "../supabase"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0); // Progress percentage
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateSuccess, setUpdateSuccess] = useState(false);
///console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    console.log('Starting upload for user:', currentUser?.email || 'Not logged in');
    console.log('Bucket: mern_estate, File:', file.name);

    setUploading(true);
    setFileUploadError(false);
    setFilePerc(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFilePerc((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file using admin client (bypasses RLS)
      const { path } = await uploadFile(file, 'mern_estate', 'profile-pictures');

      // Clear progress interval
      clearInterval(progressInterval);
      setFilePerc(100);

      // Get public URL
      const publicUrl = getPublicUrl('mern_estate', path);

      // Update form data with new avatar
      setFormData({ ...formData, avatar: publicUrl });

      console.log('Avatar uploaded successfully:', publicUrl);

      // Small delay to show 100% completion
      setTimeout(() => {
        setFilePerc(0);
        setUploading(false);
      }, 500);

    } catch (error) {
      console.error('Upload error details:', error);
      setFileUploadError(true);
      setFilePerc(0);
      setUploading(false);
      alert('Upload failed: ' + error.message + '\n\nUsing service role key - should work without RLS errors.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Send cookies with JWT token
      });
      const data = await res.json();
      if (data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      dispatch(signOutSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    navigate('/sign-in');
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      {!currentUser ? (
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative mt-2 h-24 w-24 overflow-hidden">
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser?.avatar || 'https://picsum.photos/96/96?blur'}
                alt='profile'
                className='rounded-full h-24 w-24 object-cover cursor-pointer hover:opacity-80'
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="absolute inset-0 rounded-full h-24 w-24 bg-slate-700 text-white flex items-center justify-center cursor-pointer hover:bg-slate-600"
                style={{display: 'none'}}
                onClick={() => fileRef.current.click()}
              >
                {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file' 
              ref={fileRef}
              hidden
              accept='image/*'
            />

            {/* Upload Progress & Status */}
            {uploading && (
              <div className="w-full max-w-xs">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${filePerc}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{filePerc}% uploaded</p>
              </div>
            )}

            {fileUploadError && (
              <p className="text-red-500 text-sm">Upload failed. Please try again.</p>
            )}
          </div>

          <input
            type='text'
            placeholder='Username'
            id='username'
            value={formData.username || ''}
            onChange={handleChange}
            className='border p-3 rounded-lg'
          />
          <input
            type='email'
            placeholder='Email'
            id='email'
            value={formData.email || ''}
            onChange={handleChange}
            className='border p-3 rounded-lg'
          />
          <input
            type='password'
            placeholder='Password'
            id='password'
            onChange={handleChange}
            className='border p-3 rounded-lg'
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer"> Delete account </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer"> Sign out </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-5">Profile updated successfully!</p>}
    </div>
  )
}
