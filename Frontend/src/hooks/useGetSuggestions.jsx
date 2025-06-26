
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggestions } from "../redux/authSlice.js";

// 1. RENAME the function to start with "use". This makes it a valid custom hook.
const useGetSuggestions = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/getSuggestions", { withCredentials: true });

        // Assuming your backend API on success directly returns the array of posts.
        if (response.data.success) {
          dispatch(setSuggestions(response.data.suggestions));
        }
      } catch (error) {
        console.error("Error fetching Suggestions:", error);
      }
    };

    fetchSuggestions();
  }); // 3. It's best practice to include `dispatch` in the dependency array.
};

export default useGetSuggestions;