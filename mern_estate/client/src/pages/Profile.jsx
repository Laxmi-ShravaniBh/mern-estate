import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { uploadFile, getPublicUrl } from "../supabase"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserSuccess, signOutUserStart, signOutUserFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from 'lucide-react';

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
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState(false);
  const [showListings, setShowListings] = useState(false);
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
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
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
      dispatch(signOutUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleGetListings = async () => {
    if (listings.length === 0) {
      try {
        setListingsLoading(true);
        setListingsError(false);
        const res = await fetch(`/api/users/listings/${currentUser._id}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success === false) {
          setListingsError(true);
          setListingsLoading(false);
          return;
        }
        setListings(data);
        setListingsLoading(false);
      } catch (error) {
        setListingsError(true);
        setListingsLoading(false);
      }
    }
    setShowListings(!showListings);
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.message === "Listing deleted successfully") {
        setListings(listings.filter(listing => listing._id !== listingId));
      } else {
        alert("Failed to delete listing");
      }
    } catch (error) {
      alert("Error deleting listing");
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className="max-w-lg mx-auto p-6">
        <h1 className='text-3xl font-semibold text-slate-700 text-center mb-8'>Profile</h1>

        {!currentUser ? (
          <div className="text-center">
            <p className="text-gray-600">Please sign in to view your profile.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4">
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
                <div className="w-full">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-slate-700 h-2 rounded-full transition-all duration-300"
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

            <div>
              <label className="font-medium text-slate-700">Username</label>
              <input
                type='text'
                placeholder='Username'
                id='username'
                value={formData.username || ''}
                onChange={handleChange}
                className='w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg'
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">Email</label>
              <input
                type='email'
                placeholder='Email'
                id='email'
                value={formData.email || ''}
                onChange={handleChange}
                className='w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg'
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">Password</label>
              <input
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
                className='w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg'
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white font-medium bg-slate-700 hover:bg-slate-600 active:bg-slate-600 rounded-lg duration-150 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <Link className='block w-full text-center px-4 py-2 bg-green-700 !text-white rounded-lg hover:opacity-95' to={"/create-listing"}>
              Create Listing
            </Link>
            <div className="text-center mt-3">
              <span onClick={handleGetListings} className="text-green-700 cursor-pointer hover:underline">Show My Listings</span>
            </div>
            {listingsLoading && <p className="text-gray-600 mt-5">Loading listings...</p>}
            {listingsError && <p className="text-red-700 mt-5">Error fetching listings.</p>}
          </form>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer hover:underline">Delete account</span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:underline">Sign out</span>
        </div>
        {error && <p className="text-red-700 mt-5">{error}</p>}
        {updateSuccess && <p className="text-green-700 mt-5">Profile updated successfully!</p>}
        {showListings && (
          <div className="mt-8">
            {listingsLoading && <p className="text-gray-600">Loading listings...</p>}
            {listingsError && <p className="text-red-700">Error fetching listings.</p>}
            {listings.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">Your Listings</h2>
                {listings.map((listing) => (
                  <div key={listing._id} className="border rounded-lg p-4 mb-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                      {listing.imageURLs && listing.imageURLs.length > 0 && (
                        <img src={listing.imageURLs[0]} alt="listing" className="w-16 h-16 object-cover rounded" />
                      )}
                      <Link to={`/listing/${listing._id}`}>
                        <p className="font-medium break-words cursor-pointer hover:underline text-slate-700">{listing.name}</p>
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="text-green-700 hover:text-green-800"><Edit size={20} /></button>
                      </Link>
                      <button onClick={() => handleDeleteListing(listing._id)} className="text-red-700 hover:text-red-800"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

