import { useState } from 'react'

export default function Contact({ listingId }) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        // Indian phone number validation: 10 digits, starting with 6,7,8,9
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, listingId }),
            });
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
            } else {
                alert('Inquiry sent successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setShowForm(false);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 text-slate-600 md:px-8">
                {!showForm ? (
                    <div className="max-w-4xl mx-auto text-center">
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            Contact landlord
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
                            <h3 className="text-slate-500 font-semibold">
                                Contact
                            </h3>
                            <p className="text-slate-700 text-3xl font-semibold sm:text-4xl">
                                Reach out to the landlord
                            </p>
                            <p className="text-slate-500">
                                Enquire about the listing and get more details.
                            </p>
                        </div>
                        <div className="mt-12 max-w-lg mx-auto">
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                                    <div>
                                        <label className="font-medium text-slate-700">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-medium text-slate-700">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-medium text-slate-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="font-medium text-slate-700">
                                        Phone number
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                                            <select className="text-sm bg-transparent outline-none rounded-lg h-full text-slate-500">
                                                <option>IN</option>
                                                <option>US</option>
                                                <option>ES</option>
                                                <option>MR</option>
                                            </select>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 9876543210"
                                            required
                                            className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg text-slate-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-medium text-slate-700">
                                        Message
                                    </label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required 
                                        maxLength="500"
                                        className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-slate-500 shadow-sm rounded-lg text-slate-500"
                                    ></textarea>
                                    <p className="text-sm text-slate-500 mt-1 text-right">{formData.message.length}/500 characters</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-4 py-2 text-white font-medium bg-slate-700 hover:bg-slate-600 active:bg-slate-600 rounded-lg duration-150 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
