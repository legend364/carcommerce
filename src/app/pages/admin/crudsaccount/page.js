"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State to hold users
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Replace with your actual token
  const token = process.env.NEXT_PUBLIC_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyOTY3NjU5OSwianRpIjoiOTRiNTYxNGYtMDYxNi00MTZkLWE5NzEtYzhmMWE0MDdjODBiIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJfcHJvZmlsZSI6ImFkbWluIn0sIm5iZiI6MTcyOTY3NjU5OSwiY3NyZiI6ImY0MmRlY2NhLTQ2NGMtNDdiOC1hNTExLTViMDA0NmRlZGMwMCIsImV4cCI6MTcyOTY3NzQ5OX0.Lnv8Ft5hAjf1s8F0OV9uqQfqR6wuSs2puVAXLZdcBFw';

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchUsers();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/users/search_user', {
        params: {
          search: searchTerm // Add search term to query
        }
      });
      setUsers(response.data.account_list);
    } catch (error) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleSuspend = async () => {
    if (selectedUsers.size === 0) {
      alert('Please select users to suspend');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      for (const userId of selectedUsers) {
        await axios.post(`http://localhost:5000/api/users/suspend/${userId}`);
      }
      setSelectedUsers(new Set());
      fetchUsers();
      alert('Selected users have been suspended successfully');
    } catch (error) {
      setError('Failed to suspend users. Please try again.');
      console.error('Error suspending users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    const updatedSelectedUsers = new Set(selectedUsers);
    if (updatedSelectedUsers.has(userId)) {
      updatedSelectedUsers.delete(userId);
    } else {
      updatedSelectedUsers.add(userId);
    }
    setSelectedUsers(updatedSelectedUsers);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAddUser = async () => {
    // Form validation
    if (!firstname || !lastname || !dob || !email || !password || !accountType) {
      alert('Please fill in all the fields.');
      return;
    }

    if (!validateDob(dob)) {
      alert('Invalid date format. Please use YYYY/MM/DD and ensure the date is valid.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    const newUser = {
      name: `${firstname} ${lastname}`,
      dob,
      email,
      password,
      user_profile: accountType,
    };

    setIsLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users/create_user', newUser);
      fetchUsers();
      // Clear form
      setFirstName('');
      setLastName('');
      setDob('');
      setEmail('');
      setPassword('');
      setAccountType('');
      alert('User added successfully!');
    } catch (error) {
      setError('Failed to add user. Please try again.');
      console.error('Error adding user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 p-6">
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Add new account section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-4xl text-center font-bold mb-6 text-white">Add new account</h2>
        <div className="flex flex-col space-y-4 items-center">
          <input
            type="text"
            placeholder="First name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          
          <input
            type="text"
            placeholder="yyyy/mm/dd"
      
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />

          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-gray-700"
            disabled={isLoading}
          >
            <option value="" disabled>Select Account Type</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="usedCarAgent">Used Car Agent</option>
          </select>

          <button
            onClick={handleAddUser}
            className={`bg-green-500 text-white p-2 rounded hover:bg-green-700 w-full md:w-1/3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Search and Suspend section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
        <div className="flex justify-center items-center space-x-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <button 
            onClick={handleSearch}
            className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <button
          onClick={handleSuspend}
          className={`bg-red-500 text-white p-2 rounded hover:bg-red-700 mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Suspending...' : 'Suspend'}
        </button>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Select</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Password</th>
              <th className="py-2 px-4 border-b">Firstname</th>
              <th className="py-2 px-4 border-b">Lastname</th>
              <th className="py-2 px-4 border-b">DOB</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-4 text-center">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center">No users found</td>
              </tr>
            ) : (
              users.map((user) => {
               
                return (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                        disabled={isLoading}
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">********</td>
                    <td className="py-2 px-4 border-b">{user.first_name}</td>
                    <td className="py-2 px-4 border-b">{user.last_name}</td>
                    <td className="py-2 px-4 border-b">{user.dob}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}