import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios
import LeftArrow from '../assets/left-arrow.png';
import RightArrow from '../assets/right-arrow.png';

const DailyMotivation = () => {
    const [todayVideo, setTodayVideo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [mudras, setMudras] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        // Fetch daily motivation data from the backend
        const fetchDailyMotivation = async () => {
            try {
                const response = await axios.get('http://localhost:5000/dailyMotivation'); // Adjust the URL as necessary
                setTodayVideo(response.data.todayVideo);
                setVideos(response.data.videos);
                setMudras(response.data.mudras);
            } catch (error) {
                console.error('Error fetching daily motivation data:', error);
            }
        };

        fetchDailyMotivation();
    }, []);

    const handleScroll = (scrollOffset) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += scrollOffset;
        }
    };

    const truncateStyle = {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const openDialog = (mudraName) => {
        setDialogOpen(mudraName);
    };

    const closeDialog = () => {
        setDialogOpen(null);
    };

    const videoName = todayVideo ? todayVideo.videoName.replace('.mp4', '') : 'Not uploaded Yet';
    const videoUrl = todayVideo ? todayVideo.videoUrl : '#';

    return (
        <main className="bg-lightOrange min-h-screen w-screen">
            {/* Daily Motivation Section */}
            <section className="flex justify-center items-center py-16">
                <div className="text-center bg-darkOrange p-8 rounded-xl shadow-md text-black">
                    <h1 className="text-4xl font-bold">Daily Motivational Video</h1>
                    <p className="mt-4 text-lg">{videoName}</p>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                        <button className="mt-6 px-6 py-3 bg-lightOrange text-darkOrange font-bold rounded-md hover:bg-darkOrange hover:text-white transition-all">
                            Play Now
                        </button>
                    </a>
                </div>
            </section>

            {/* All Videos Section */}
            <section className="relative w-full overflow-hidden">
                {/* Scrollable content container */}
                <div
                    ref={scrollContainerRef} // Attach the ref here
                    className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 0 py-4"
                    style={{ scrollBehavior: 'smooth' }} // Additional smooth scrolling
                >
                    {/* Render video cards dynamically */}
                    {videos.map((video, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 h-64 bg-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center"
                        >
                            {/* Video Element */}
                            <video controls className="w-full h-48 rounded-lg">
                                <source src={video.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            {/* Video name */}
                            <p className="mt-2 text-center text-gray-700 text-sm sm:text-base">{video.videoName}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mudras Section */}
            <section className="py-16 bg-gray-50">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-gray-800">Explore Mudras</h1>
                    <p className="mt-2 text-lg text-gray-600">Discover the benefits of ancient hand gestures</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                    {mudras.map((mudra, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={mudra.img_url}
                                    alt={mudra.name}
                                    className="w-full h-48 object-contain"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-800">{mudra.name}</h3>
                                <p className="text-gray-600 mt-2 text-sm" style={truncateStyle}>
                                    {mudra.description}
                                </p>
                                <button
                                    className="mt-4 text-sm text-darkOrange hover:underline font-bold"
                                    onClick={() => openDialog(mudra.name)}
                                >
                                    Learn More →
                                </button>
                            </div>

                            {dialogOpen === mudra.name && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                                        <button
                                            className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
                                            onClick={closeDialog}
                                        >
                                            &times;
                                        </button>
                                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">{mudra.name}</h2>

                                        {/* Mudra Image */}
                                        <img
                                            src={mudra.img_url}
                                            alt={mudra.name}
                                            className="w-full h-48 object-contain mb-4 rounded-lg"
                                        />

                                        {/* Mudra Description */}
                                        <p className="text-gray-700 mb-4">{mudra.description}</p>

                                        {/* How to Perform */}
                                        <h4 className="text-lg font-bold text-gray-800 mt-4">How to Perform:</h4>
                                        <ul className="list-disc list-inside text-gray-700 whitespace-pre-line">
                                            {mudra.perform.split('\\n->').map((step, i) => (
                                                <li key={i}>{step.trim()}</li>
                                            ))}
                                        </ul>

                                        {/* Benefits */}
                                        <h4 className="text-lg font-bold text-gray-800 mt-4">Benefits:</h4>
                                        <p className="text-gray-700">{mudra.benefits}</p>

                                        {/* Release */}
                                        <h4 className="text-lg font-bold text-gray-800 mt-4">Release:</h4>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {mudra.release.split('\\n->').map((step, i) => (
                                                <li key={i}>{step.trim()}</li>
                                            ))}
                                        </ul>

                                        {/* Duration */}
                                        <h4 className="text-lg font-bold text-gray-800 mt-4">Duration:</h4>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {mudra.duration.split('\\n->').map((time, i) => (
                                                <li key={i}>{time.trim()}</li>
                                            ))}
                                        </ul>
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

export default DailyMotivation;
