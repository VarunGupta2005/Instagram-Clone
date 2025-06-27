import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react'; // Import a loading icon

// Renamed component to PascalCase, which is the React standard
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- FIX 1: ADDED STATE TO PREVENT THE BUG ---
  // This state tracks if a search has been completed for the current query.
  // This prevents the "No results" message from showing prematurely.
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  // Debouncing logic remains the same, but with one addition
  useEffect(() => {
    // Every time the user types, we reset the "hasSearched" status
    setHasSearched(false);

    if (query.trim() === '') {
      setResults([]);
      setLoading(false); // Ensure loading is off if query is cleared
      return;
    }

    const debounceTimer = setTimeout(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://chat-app-m37n.onrender.com/user/search?q=${query}`,
            { withCredentials: true }
          );
          if (response.data.success) {
            setResults(response.data.users);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
          setResults([]);
        } finally {
          setLoading(false);
          // Mark that a search has been completed for this query
          setHasSearched(true);
        }
      };
      fetchUsers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (username) => {
    // Your navigation logic was slightly off, corrected to match a common pattern
    navigate(`/profile/${username}`);
  };

  return (
    // --- FIX 2: RESTRUCTURED THE UI TO BE A FULL PAGE ---
    <div className="p-4 sm:p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Search</h1>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      <hr className="my-6 border-gray-700" />

      {/* Results Section */}
      <div className="mt-4 space-y-4">
        {/* State 1: Loading */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* State 2: Results found */}
        {!loading && results.length > 0 && (
          results.map((user) => (
            <div
              key={user.username}
              onClick={() => handleResultClick(user.username)}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{user.username}</span>
                <span className="text-sm text-gray-400 truncate">{user?.bio}</span>
              </div>
            </div>
          ))
        )}

        {/* State 3: No results found (only shows after a search is complete) */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center p-8 text-gray-400">
            <p>No results found for "{query}".</p>
          </div>
        )}

        {/* State 4: Initial state before any search is performed */}
        {!loading && !hasSearched && query === '' && (
          <div className="text-center p-8 text-gray-400">
            <p>Search for users by their username.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; // Export with standard PascalCase name