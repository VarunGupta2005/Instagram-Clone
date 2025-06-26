import React, { useRef, useState, useEffect } from 'react'; // Added useEffect
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from './avatar.jsx';
import { Button } from './button.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { readFileAsDataURL } from '../../lib/utils.js'; // Assuming you have a utility function to read file as Data URL
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice.js';
export function EditProfile() {
  const { user } = useSelector((store) => store.auth);

  // --- NEW: State for form fields ---
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [privacy, setPrivacy] = useState('Public');
  // --- End New ---

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- NEW: useEffect to populate state from the user object ---
  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setGender(user.gender || '');
      setPrivacy(user.privacy || 'Public');
    }
  }, [user]); // This effect runs when the component mounts and if the user object changes
  // --- End New ---
  const dispatch = useDispatch();
  // --- UNCHANGED FUNCTIONS (as per your request) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would gather all form data here
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    console.log('Form submitted with data:', updatedData);
    // NOTE: To submit the new state, you would ideally use the `bio`, `gender`,
    // and `privacy` variables in your API call.
  };

  const handlePhotoChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      // In a real app, you'd also store the file object to upload it
    }
  };

  const handleSave = async (e) => {
    try {

    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile. Please try again.");
    }
  }

  const ImageHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const dataUrl = await readFileAsDataURL(file);
      setPreviewImage(dataUrl);
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData();
    if (bio !== user.bio)
      formData.append("bio", bio);
    if (gender !== user.gender)
      formData.append("gender", gender);
    if (privacy !== user.privacy)
      formData.append("privacy", privacy);
    if (previewImage) {
      formData.append("profilePicture", image);
    }
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.patch('http://localhost:3000/user/editProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        ,
        withCredentials: true
      })
      if (res.data.success) {
        const updatedUser = {
          ...user, profilePicture: res.data.profile.profilePicture,
          bio: res.data.profile.bio, gender: res.data.profile.gender,
          privacy: res.data.profile.privacy
        }
        dispatch(setUser(updatedUser));
        setLoading(false);
        toast.success(res.data.message);
      }
      else {
        setLoading(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  // --- END OF UNCHANGED FUNCTIONS ---

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 border-b border-gray-300 dark:border-gray-700">
              Edit Profile
            </h1>
          </div>

          {/* Profile Picture Section (Unchanged) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage src={previewImage || user?.profilePicture || ''} />
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{user?.username || 'Username'}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'email@example.com'}</span>
              </div>
            </div>
            <Button type="button" onClick={handlePhotoChangeClick} className="bg-[#0095F6] text-white flex-shrink-0 hover:bg-blue-600">
              Change Photo
            </Button>
            <input
              type="file"
              name="profilePictureFile"
              ref={fileInputRef}
              onChange={ImageHandler}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>

          {/* Bio Section - Now a controlled component */}
          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-lg font-bold">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              className="w-full p-3 bg-gray-200 rounded-lg resize-none text-sm focus:outline-none dark:bg-[#262626]"
              placeholder="Add a bio to your profile..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Gender Section - Now a controlled component */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-lg font-bold">Gender</label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-12 p-2 dark:border-[#262626] bg-gray-200 rounded-lg focus:outline-none dark:bg-[#262626]"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Prefer not to say</option>
            </select>
          </div>

          {/* Account Privacy Section - Now a controlled component */}
          <div className="flex flex-col gap-2">
            <label htmlFor="privacy" className="text-lg font-bold">Account Privacy</label>
            <select
              id="privacy"
              name="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full h-12 p-2 dark:border-[#262626] bg-gray-200 rounded-lg focus:outline-none dark:bg-[#262626]"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Submission Button (Unchanged) */}
          {
            loading ? <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[#0095F6] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg" onClick={createPostHandler} disabled={loading}>
                Please Wait
              </Button>
            </div> : <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[#0095F6] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg" onClick={createPostHandler} disabled={loading}>
                Save Changes
              </Button>
            </div>
          }

        </form>
      </div>
    </div>
  );
}