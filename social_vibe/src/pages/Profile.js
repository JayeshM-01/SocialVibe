import { React, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../components/Loader';
import axios from 'axios';

export const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [mediaItems, setMediaItems] = useState([]); // State to store fetched media (images/videos)
  const [imageLink, setImageLink] = useState(''); // State for profile image

  const determineMediaType = (url) => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif']; // List of image extensions
    const extension = url.split('.').pop().toLowerCase(); // Extract file extension from URL

    return imageExtensions.includes(extension) ? 'image' : 'video'; // Return 'image' or 'video'
  };

  useEffect(() => {
    const fetchMediaItems = async () => {
      if (user) {
        setImageLink(user?.picture || ''); // Set the image link only if user.picture is available
        try {
          const response = await axios.get(`http://localhost:3001/api/media1/${user.email}`);
          // Map through the media and determine the type based on the URL extension
          const processedMedia = response.data.map((media) => ({
            ...media, // Keep all existing media properties
            type: determineMediaType(media.imageUrl), // Add the media type based on URL extension
          }));

          console.log(response.data);
          setMediaItems(processedMedia); // Set the processed media (with type) to state
        } catch (err) {
          console.error('Error fetching media:', err);
        }
      }
    };

    fetchMediaItems(); // Fetch media when user changes
  }, [user]); // Fetch media when user changes

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='pl-[10rem]'>
      {isAuthenticated && (
        <main>
          <div className="lg:w-8/12 lg:mx-auto mb-8">
            <header className="flex flex-wrap items-center p-4 md:py-8">
              <div className="md:w-3/12 md:ml-16">
                {imageLink ? ( // Render the image only if imageLink is available
                  <img
                    className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-black-800"
                    src={imageLink}
                    referrerPolicy="no-referrer"
                    alt={user.name} // Use the user's name for the alt attribute
                  />
                ) : (
                  <Loader /> // Optionally show a loader while waiting for the image
                )}
              </div>
              <div className="w-8/12 md:w-7/12 ml-4">
                <div className="md:flex md:flex-wrap md:items-center mb-4">
                  <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                    {user.name} {/* Display user's nickname */}
                  </h2>
                </div>

                <ul className="hidden md:flex space-x-8 mb-4">
                  <li>
                    <span className="font-semibold">136</span> posts
                  </li>
                  <li>
                    <span className="font-semibold">40.5k</span> followers
                  </li>
                  <li>
                    <span className="font-semibold">302</span> following
                  </li>
                </ul>

                <div className="hidden md:block">
                  <h1 className="font-semibold">{user.name}</h1> {/* Display user's full name */}
                  <span>Travel, Nature and Music</span>
                  <p>Lorem ipsum dolor sit amet consectetur</p>
                </div>
              </div>
            </header>

            <div className="px-px md:px-3">
              <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-gray-600 leading-snug text-sm">
                <li>
                  <span className="font-semibold text-gray-800 block">136</span>
                  posts
                </li>
                <li>
                  <span className="font-semibold text-gray-800 block">40.5k</span>
                  followers
                </li>
                <li>
                  <span className="font-semibold text-gray-800 block">302</span>
                  following
                </li>
              </ul>

              <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
                <li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
                  <a className="inline-block p-3" href="#">
                    <i className="fas fa-th-large text-xl md:text-xs"></i>
                    <span className="hidden md:inline">post</span>
                  </a>
                </li>
              </ul>

              {/* Scrollable posts section in vertical direction */}
              <div className="grid grid-cols-3 gap-1 md:gap-3 overflow-y-auto hide-scrollbar h-[34rem] px-3 md:px-0">
                {mediaItems.map((media) => (
                  <div key={media._id} className="w-full">
                    <a href="#">
                      <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                        {media.type === 'image' ? (
                          <img
                            className="w-full h-full absolute left-0 top-0 object-cover"
                            src={media.imageUrl}
                            alt="media"
                          />
                        ) : (
                          <video
                            className="w-full h-full absolute left-0 top-0 object-cover"
                            controls
                          >
                            <source src={media.imageUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </article>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Custom CSS embedded in the component */}
      <style jsx>{`
        .pb-full {
          padding-bottom: 100%;
        }
        .search-bar:focus + .fa-search {
          display: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        @media screen and (min-width: 768px) {
          .post:hover .overlay {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};
