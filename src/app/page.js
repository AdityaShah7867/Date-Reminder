'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CakeIcon, UserPlusIcon, HeartIcon } from '@heroicons/react/24/solid';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [eventType, setEventType] = useState('birthday');
  const [name, setName] = useState('');
  const [husbandName, setHusbandName] = useState('');
  const [wifeName, setWifeName] = useState('');
  const [date, setDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [showAllData, setShowAllData] = useState(false);
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchAllEvents = async () => {
    try {
      const response = await fetch('/api/all-events');
      if (!response.ok) {
        throw new Error('Failed to fetch all events');
      }
      const data = await response.json();
      setAllEvents(data);
      setShowAllData(true);
    } catch (error) {
      console.error('Error fetching all events:', error);
      toast.error('Failed to fetch all events');
    }
  };
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    try {
      const eventData = eventType === 'birthday'
        ? { type: 'birthday', name, date: date.format('YYYY-MM-DD') }
        : { type: 'anniversary', husbandName, wifeName, date: date.format('YYYY-MM-DD') };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error('Failed to add event');
      }
      toast.success(`${eventType.charAt(0).toUpperCase() + eventType.slice(1)} added successfully!`);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(`Error adding ${eventType}. Please try again.`);
    }
  };

  const resetForm = () => {
    setName('');
    setHusbandName('');
    setWifeName('');
    setDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          <CakeIcon className="inline-block mr-2 h-6 w-6" />
          Event Reminder
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                </select>
              </div>
              {eventType === 'birthday' ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="husbandName">
                      Husband's Name
                    </label>
                    <input
                      type="text"
                      id="husbandName"
                      className="mt-1 block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={husbandName}
                      onChange={(e) => setHusbandName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="wifeName">
                      Wife's Name
                    </label>
                    <input
                      type="text"
                      id="wifeName"
                      className="mt-1 block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={wifeName}
                      onChange={(e) => setWifeName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                  {eventType === 'birthday' ? 'Birthday' : 'Anniversary'} Date
                </label>
                <DatePicker
                  id="date"
                  className="mt-1 block w-full"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <input {...params} className="mt-1 block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />}
                  disableFuture
                />
              </div>
              <button
                type="submit"
                className="inline-block px-6 py-2 text-sm font-medium bg-blue-500 text-white bg-primary rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                Add {eventType === 'birthday' ? 'Birthday' : 'Anniversary'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-4">Events This Month</h2>
            {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                  <li key={index} className="mb-2">
                    {event.type === 'birthday' ? (
                      <CakeIcon className="inline-block mr-2 h-4 w-4 text-blue-500" />
                    ) : (
                      <HeartIcon className="inline-block mr-2 h-4 w-4 text-red-500" />
                    )}
                    <span className="block text-sm font-medium text-gray-700">
                      {event.type === 'birthday' ? event.name : `${event.husbandName} & ${event.wifeName}`}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {dayjs(event.date).format('MMMM D, YYYY')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No events this month.</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={fetchAllEvents}
            className="inline-block px-6 py-2 text-sm font-medium bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            See All Data
          </button>
        </div>
        {showAllData && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4">All Events</h2>
            {allEvents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {allEvents.map((event, index) => (
                  <li key={index} className="py-4">
                    {event.type === 'birthday' ? (
                      <CakeIcon className="inline-block mr-2 h-5 w-5 text-blue-500" />
                    ) : (
                      <HeartIcon className="inline-block mr-2 h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium text-gray-900">
                      {event.type === 'birthday' ? event.name : `${event.husbandName} & ${event.wifeName}`}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {dayjs(event.date).format('MMMM D, YYYY')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No events found.</p>
            )}
          </div>
        )}

        
      </div>
     
    </LocalizationProvider>
  );
}