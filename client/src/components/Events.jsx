import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(null);

    useEffect(() => {
        // Fetch events data from the backend
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://madhav-sewa-society-d2t9.vercel.app/events'); // Adjust the URL as necessary
                setEvents(response.data.events);
            } catch (error) {
                console.error('Error fetching events data:', error);
            }
        };

        fetchEvents();
    }, []);

    const openDialog = (eventId) => {
        setDialogOpen(eventId);
    };

    const closeDialog = () => {
        setDialogOpen(null);
    };

    return (
        <main className="bg-lightOrange min-h-screen w-screen">
            {/* Events Section */}
            <section className="py-16 bg-gray-50">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-gray-800">Events</h1>
                    <p className="mt-2 text-lg text-gray-600">Explore and get inspired by our events</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                    {events.slice().reverse().map((event) => (
                        <div
                            key={event._id}
                            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={event.img_url}
                                    alt="Event"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-lg font-semibold text-gray-800">
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <button
                                    className="mt-4 text-sm text-darkOrange hover:underline font-bold"
                                    onClick={() => openDialog(event._id)}
                                >
                                    View Details →
                                </button>
                            </div>

                            {/* Dialog */}
                            {dialogOpen === event._id && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                                        <button
                                            className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
                                            onClick={closeDialog}
                                        >
                                            &times;
                                        </button>
                                        <img
                                            src={event.img_url}
                                            alt="Event"
                                            className="w-full h-48 object-cover mb-4"
                                        />
                                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                                            Event on {new Date(event.date).toLocaleDateString()}
                                        </h2>
                                        <p className="text-gray-700">{event.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Events;
