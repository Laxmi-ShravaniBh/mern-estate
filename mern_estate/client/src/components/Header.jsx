import {FaSearch} from "react-icons/fa"
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    console.log('Header - currentUser:', currentUser); // Debug log
    console.log('Header - avatar URL:', currentUser?.avatar); // Debug log
  return (
    <header className= 'bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-8xl mx-auto p-5'>
            <Link to="/">
                <h1 className='font-bold text-[4px] sm:text-sm ml-10 flex flex-wrap'> 
                    <span className='text-slate-500'>Harry</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
            </Link>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type="text" placeholder="Search..." 
                className='bg-transparent focus:outline-none w-20 sm:w-64' /> 
                <FaSearch className="text-slate-600" />
            </form>
            <ul className="flex gap-6 items-center mr-10">
                <Link to="/">
                    <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
                </Link>
                <Link to="/about">
                    <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
                </Link>
                <Link to="/profile">
                    {currentUser ? (
                        <li className="relative group list-none h-7 w-7 sm:h-8 sm:w-8">
                            <img
                                className='rounded-full h-7 w-7 sm:h-8 sm:w-8 object-cover cursor-pointer'
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
                                className="absolute inset-0 rounded-full h-7 w-7 sm:h-8 sm:w-8 bg-slate-700 text-white flex items-center justify-center cursor-pointer hover:bg-slate-600"
                                style={{display: 'none', verticalAlign: 'middle'}}
                            >
                                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="hidden group-hover:block absolute top-full right-0 mt-1 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10">
                                Profile
                            </span>
                        </li>
                    ) : (
                        <li className="text-slate-700 hover:underline">Sign In</li>
                    )}
                </Link>
            </ul>
        </div>
    </header>
  )
}
