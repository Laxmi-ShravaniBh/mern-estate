import {FaSearch} from "react-icons/fa"
import {Link, useNavigate, useLocation} from "react-router-dom"
import {useSelector} from "react-redux"
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

  return (
    <header className= 'bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-8xl mx-auto px-3 sm:px-5 py-3 sm:py-5'>
            <Link to="/">
                <h1 className='font-bold text-xs sm:text-sm flex flex-wrap'> 
                    <span className='text-slate-500'>Harry</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center hidden sm:flex'>
                <input type="text" placeholder="Search..." 
                className='bg-transparent focus:outline-none w-32 sm:w-64'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
                <button>
                    <FaSearch className="text-slate-600" />
                </button>
            </form>
            <ul className="flex gap-2 sm:gap-6 items-center">
                <Link to="/">
                    <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
                </Link>
                <Link to="/about">
                    <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
                </Link>
                <Link to="/profile">
                    {currentUser ? (
                        <li className="relative group list-none h-6 w-6 sm:h-8 sm:w-8">
                            <img
                                className='rounded-full h-6 w-6 sm:h-8 sm:w-8 object-cover cursor-pointer'
                                src={currentUser.avatar}
                                alt="Profile"
                                crossOrigin="anonymous"
                                style={{ verticalAlign: 'middle' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div
                                className="absolute inset-0 rounded-full h-6 w-6 sm:h-8 sm:w-8 bg-slate-700 text-white flex items-center justify-center cursor-pointer hover:bg-slate-600"
                                style={{display: 'none', verticalAlign: 'middle'}}
                            >
                                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="hidden group-hover:block absolute top-full right-0 mt-1 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10">
                                Profile
                            </span>
                        </li>
                    ) : (
                        <li className="text-slate-700 hover:underline text-sm sm:text-base">Sign In</li>
                    )}
                </Link>
            </ul>
        </div>
    </header>
  )
}
