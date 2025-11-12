import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from '../components/ui/progressive-carousel'
import { Bed, Bath, Car, Sofa } from 'lucide-react'
import Contact from '../components/ui/contact-sections'

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams()
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`)
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <main className="bg-white">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Error loading listing</p>}
      {listing && !loading && !error && (
        <div>
          {listing.imageURLs && listing.imageURLs.length > 0 && (
            listing.imageURLs.length === 1 ? (
              <img
                src={listing.imageURLs[0]}
                alt={`${listing.name} - 1`}
                className="rounded-xl h-[450px] w-full object-cover"
              />
            ) : (
              <ProgressSlider vertical={false} activeSlider="0">
                <SliderContent>
                  {listing.imageURLs.map((image, index) => (
                    <SliderWrapper key={index} value={index.toString()}>
                      <img
                        src={image}
                        alt={`${listing.name} - ${index + 1}`}
                        className="rounded-xl h-[450px] w-full object-cover"
                      />
                    </SliderWrapper>
                  ))}
                </SliderContent>
                <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-1/2 transform sm:-translate-x-1/2 max-w-[calc(100%-2rem)] overflow-x-auto">
                  <SliderBtnGroup className="flex gap-1 sm:gap-1">
                    {listing.imageURLs.map((_, index) => (
                      <SliderBtn
                        key={index}
                        value={index.toString()}
                        className="cursor-pointer flex-shrink-0"
                        progressBarClass="bg-white h-full"
                      >
                        <span className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-70 hover:opacity-100 transition-opacity"></span>
                      </SliderBtn>
                    ))}
                  </SliderBtnGroup>
                </div>
              </ProgressSlider>
            )
          )}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-2 mt-6">{listing.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{listing.address}</p>
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {listing.offer && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ₹{listing.regularPrice.toLocaleString('en-IN')} / month
                </span>
              )}
            </div>
            <p className="text-gray-700 text-lg mb-4 ">{listing.description}</p>
            <div className="flex gap-4 sm:gap-8 text-black mb-[-10px]">
              <div className="flex items-center gap-2">
                <Bed size={20} className="text-black" />
                <span className="text-sm sm:text-base">{listing.bedrooms} beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} className="text-black" />
                <span className="text-sm sm:text-base">{listing.bathrooms} baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Car size={20} className="text-black" />
                <span className="text-sm sm:text-base">{listing.parking ? 'Parking' : 'No Parking'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sofa size={20} className="text-black" />
                <span className="text-sm sm:text-base">{listing.furnished ? 'Furnished' : 'Not Furnished'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentUser && listing && currentUser._id !== listing.userRef && <Contact listingId={listing._id} />}
    </main>
  );
}
