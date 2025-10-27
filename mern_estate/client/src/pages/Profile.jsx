import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { uploadFile, getPublicUrl } from "../supabase"

export default function Profile() {
  const fileRef = useRef(null)
  const currentUser = useSelector((state) => state.user.currentUser);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0); // Progress percentage
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      {!currentUser ? (
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      ) : (
        <form className='flex flex-col gap-4'>
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-2">
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser?.avatar || 'https://via.placeholder.com/96x96?text=No+Image'}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 hover:opacity-80'
            />
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
            placeholder='username'
            id='username'
            value={formData.username || ''}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className='border p-3 rounded-lg'
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className='border p-3 rounded-lg'
          />
          <input
            type='password'
            placeholder='password'
            id='password'
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className='border p-3 rounded-lg'
          />
          <button
            type="button"
            disabled={uploading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {uploading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer"> Delete account </span>
        <span className="text-red-700 cursor-pointer"> Sign out </span>
      </div>
    </div>
  )
}
