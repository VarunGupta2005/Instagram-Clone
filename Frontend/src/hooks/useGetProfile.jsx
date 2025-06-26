import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { setProfile } from '../redux/authSlice.js';
import { useDispatch } from "react-redux";
const useGetProfile = (reload) => {
  const { username } = useParams();
  const [profile, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/user/profile/${username}`, {},
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("Profile data:", response.data.profile);
          setProf(response.data.profile);
          // Update the Redux store with the fetched profile
          dispatch(setProfile(response.data.profile));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, reload]);

  return { profile, loading };
};

export default useGetProfile;
