import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-slate-700 mb-8 text-center">About Us</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            Welcome to our real estate platform, where we connect buyers, renters, and property owners in a seamless and trustworthy marketplace.
          </p>
          
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Our Mission</h2>
            <p>
              Our mission is to simplify the process of finding and listing properties. Whether you're looking for your dream home, a rental property, or selling your current residence, we provide the tools and platform to make it happen efficiently and securely.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Comprehensive property listings for sale and rent</li>
              <li>Advanced search and filtering options</li>
              <li>Direct communication between buyers/renters and property owners</li>
              <li>Secure and user-friendly platform</li>
              <li>Mobile-responsive design for on-the-go browsing</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Why Choose Us?</h2>
            <p>
              With a focus on user experience and transparency, we ensure that every listing is accurate and every interaction is meaningful. Our platform is built with modern technology to provide fast, reliable service to all users.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Contact Us</h2>
            <p>
              Have questions or need assistance? Reach out to us through our contact form or email. We're here to help you navigate your real estate journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
