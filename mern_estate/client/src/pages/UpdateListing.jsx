import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { uploadFile, getPublicUrl } from "../supabase";
import { Eye, Trash2, X } from "lucide-react";
import { useEffect } from "react";


export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const initialFormData = {
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: "",
    discountPrice: 0,
    furnished: false,
    parking: false,
    offer: false,
  };

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const params = useParams();
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.id;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setImageUrls(data.imageURLs || []);
    };
    fetchListing();
  }, []);
    

  const handleEnlarge = (index) => {
    setSelectedIndex(index);
    setSelectedImage(imageUrls[index]);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [id]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [id]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + imageUrls.length < 7) {
      // Check file sizes
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 2 * 1024 * 1024) {
          setError("Each image must be less than 2MB.");
          return;
        }
      }
      setUploading(true);
      setError(false);
      const urls = [];
      try {
        for (let i = 0; i < files.length; i++) {
          const { path } = await uploadFile(
            files[i],
            "mern_estate",
            "listing-images"
          );
          const url = getPublicUrl("mern_estate", path);
          urls.push(url);
        }
        setImageUrls([...imageUrls, ...urls]);
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      setError("Select 1 to 6 images.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setError("You must upload at least one image.");
      return;
    }
    if (formData.regularPrice < formData.discountPrice) {
      setError("Discount price must be less than regular price.");
      return;
    }
    setError(false);
    console.log("Submitting form with data:", formData);
    console.log("Image URLs:", imageUrls);
    try {
      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageURLs: imageUrls,
          userRef: currentUser._id,
        }),
        credentials: "include",
      });
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg text-black"
            id="name"
            maxLength="100"
            required
            minLength="10"
            onChange={handleChange}
            value={formData.name || ""}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg text-black"
            id="description"
            required
            onChange={handleChange}
            value={formData.description || ""}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg text-black"
            id="address"
            required
            onChange={handleChange}
            value={formData.address || ""}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>For Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-2 border border-gray-300 rounded-lg text-black w-32"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-2 border border-gray-300 rounded-lg text-black w-32"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-2 border border-gray-300 rounded-lg text-black w-32"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs"> ($ / Month) </span>
              </div>
            </div>
            {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="1000000"
                required
                className="p-2 border border-gray-300 rounded-lg text-black w-32"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs"> ($ / Month) </span>
              </div>
            </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-500 ml-2">
              The first image will be the cover (max 6){" "}
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 !border-2 !border-green-700 
            rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded cursor-pointer"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-1 bg-black/40 opacity-0 sm:group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity rounded">
                    <button
                      type="button"
                      onClick={() => handleEnlarge(index)}
                      className="text-white hover:text-black hover:bg-white rounded p-1 transition-colors"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="text-white hover:text-black hover:bg-white rounded p-1 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80"
          >
            Update Listing
          </button>
        </div>
      </form>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-full object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="text-white text-center" style={{display: 'none'}}>
              Image failed to load. The URL may be invalid.
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
