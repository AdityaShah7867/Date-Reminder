'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CakeIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const response = await fetch('/api/birthday');
      if (!response.ok) {
        throw new Error('Failed to fetch birthdays');
      }
      const data = await response.json();
      setBirthdays(data);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthday) {
      alert('Please select a birthday');
      return;
    }
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, birthday: birthday.format('YYYY-MM-DD') }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      toast.success('Birthday added successfully!');
      setName('');
      setBirthday(null);
      fetchBirthdays();
    } catch (error) {
      console.error('Error adding Birthday:', error);
      toast.error('Error adding Birthday. Please try again.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          <CakeIcon className="inline-block mr-2 h-6 w-6" />
          Birthday Reminder
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="birthday">
                  Birthday
                </label>
                <DatePicker
                  id="birthday"
                  className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={birthday}
                  onChange={(newValue) => setBirthday(newValue)}
                  renderInput={(params) => <input {...params} className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />}
                  disableFuture
                />
              </div>
              <button
                type="submit"
                className="inline-block px-6 py-2 text-sm font-medium bg-blue-500 text-white bg-primary rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                Add Birthday
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-4">Birthdays This Month</h2>
            {birthdays.length > 0 ? (
              <ul>
                {birthdays.map((user, index) => (
                  <li key={index}>
                    <span className="block text-sm font-medium text-gray-700">{user.name}</span>
                    <span className="block text-sm text-gray-500">{dayjs(user.birthday).format('MMMM D, YYYY')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No birthdays this month.</p>
            )}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}