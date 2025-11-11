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
              <SliderBtnGroup className="absolute bottom-0 h-fit text-white bg-black/40 backdrop-blur-md overflow-hidden grid grid-cols-4 rounded-md">
                {listing.imageURLs.map((_, index) => (
                  <SliderBtn
                    key={index}
                    value={index.toString()}
                    className="text-center cursor-pointer p-3 border-r flex justify-center items-center"
                    progressBarClass="bg-white h-full"
                  >
                    <span className="w-3 h-3 bg-white rounded-full opacity-70 hover:opacity-100 transition-opacity"></span>
                  </SliderBtn>
                ))}
              </SliderBtnGroup>
            </ProgressSlider>
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
                  ${listing.regularPrice.toLocaleString()} / month
                </span>
              )}
            </div>
            <p className="text-gray-700 text-lg mb-4 ">{listing.description}</p>
            <div className="flex gap-8 text-black mb-[-10px]">
              <div className="flex items-center gap-2">
                <Bed size={20} className="text-black" />
                <span>{listing.bedrooms} beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} className="text-black" />
                <span>{listing.bathrooms} baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Car size={20} className="text-black" />
                <span>{listing.parking ? 'Parking' : 'No Parking'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sofa size={20} className="text-black" />
                <span>{listing.furnished ? 'Furnished' : 'Not Furnished'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentUser && listing && currentUser._id !== listing.userRef && <Contact listingId={listing._id} />}
    </main>
  );
}
