"use client";
import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "./images";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify"
import {addMember, bookAppointment, leaveRating} from "../services/api"

const Homepage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Booking
  const [bookname, setBookName] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookService, setBookService] = useState("")
  const [bookDate, setBookDate] = useState("")
  const [bookPhone, setBookPhone] = useState("")

  // Membership
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPhone, setMemberphone] = useState("");
  const [memberDate, setMemberDate] = useState("");

  // Rating
  const [ratingName, setRatingName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleBooking = () =>{
    if(bookname && bookEmail && bookService && bookDate && bookPhone){
      bookAppointment({name: bookname, email: bookEmail, service: bookService, date: bookDate, phone: bookPhone})
      toast.success("Your request is sucessful")
    }else{
      toast.error(`Make sure you have filled all fields`);
    }
  }

  const handleMembership = () =>{
    if(memberEmail && memberName && memberEmail && memberDate){
      addMember({name: memberName, email: memberEmail, startDate: memberDate, phone: memberPhone})
      toast.success("Your request is sucessful")
    }else{
      toast.error(`Make sure you have filled all fields`);
    }
  }

  const handleRating = () =>{
    if(ratingName && comment && rating ){
      leaveRating({user: ratingName, comment, rating})
      toast.success("Your request is sucessful")
    }else{
      toast.error(`Make sure you have filled all fields`);
    }
  }

  const testimonials = [
    {
      name: "Jane Doe",
      review: "Absolutely amazing experience! I felt so relaxed and refreshed.",
      rating: 5,
    },
    {
      name: "John Smith",
      review: "The team is very professional, and the atmosphere is perfect.",
      rating: 4,
    },
    {
      name: "Emily Johnson",
      review: "Highly recommend! Best massage I've had in years.",
      rating: 5,
    },
  ];
  return (
    <div className="font-sans">
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <header className="p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          {/* Logo or Title */}
          <div className="text-teal-600 text-2xl font-bold">Djohnmash</div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden text-teal-600 md:flex space-x-6">
            <a href="#" className="text-teal-600 hover:text-teal-400 font-semibold">Home</a>
            <a href="#about" className="text-teal-600 hover:text-teal-400 font-semibold">About</a>
            <a href="#services" className="text-teal-600 hover:text-teal-400 font-semibold">Services</a>
            <a href="#testimonials" className="text-teal-600 hover:text-teal-400 font-semibold">Testimonials</a>
            <a href="#leave ratings" className="text-teal-600 hover:text-teal-400 font-semibold">Ratings</a>
            <a href="#contact" className="text-teal-600 hover:text-teal-400 font-semibold">Contact</a>
          </nav>

          {/* Membership Button (Desktop) */}
          <div className="hidden md:flex">
            <a
              href="#membership"
              className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800"
            >
              Become a Member
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-teal-600" onClick={toggleMenu}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${isMenuOpen ? "flex" : "hidden"
            } flex-col items-center space-y-4 text-white py-4`}
        >
           
           <a href="#" className="text-teal-600 hover:text-teal-400 font-semibold">Home</a>
            <a href="#about" className="text-teal-600 hover:text-teal-400 font-semibold">About</a>
            <a href="#services" className="text-teal-600 hover:text-teal-400 font-semibold">Services</a>
            <a href="#testimonials" className="text-teal-600 hover:text-teal-400 font-semibold">Testimonials</a>
            <a href="#leave ratings" className="text-teal-600 hover:text-teal-400 font-semibold">Ratings</a>
            <a href="#contact" className="text-teal-600 hover:text-teal-400 font-semibold">Contact</a>
      

          {/* Mobile Membership Button */}
          <a
            href="#membership"
            className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800"
          >
            Become a Member
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen bg-cover bg-center bg-no-repeat relative">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/promo-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Relax, Rejuvenate, Revitalize</h1>
          <p className="text-base md:text-lg text-gray-200 mb-6">Experience the best massage in town</p>

          {/* Horizontal Booking Card */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 flex flex-wrap justify-between items-center space-y-4 md:space-y-0">
            <div className="w-full md:flex-1 md:mr-4">
              <label className="block text-left text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                required
                onChange={(e) => setBookName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="w-full md:flex-1 md:mr-4">
              <label className="block text-left text-gray-700 font-semibold mb-2">Phone</label>
              <input
                type="text"
                placeholder="Your Phone"
                required
                onChange={(e) => setBookPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="w-full md:flex-1 md:mr-4">
              <label className="block text-left text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                onChange={(e) => setBookEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="w-full md:flex-1 md:mr-4">
              <label className="block text-left text-gray-700 font-semibold mb-2">Service</label>
              <input
                type="email"
                onChange={(e) => setBookService(e.target.value)}
                placeholder="Service"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="w-full md:flex-1 md:mr-4">
              <label className="block text-left text-gray-700 font-semibold mb-2">Preferred Date</label>
              <input
                type="date"
                required
                onChange={(e) => setBookDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <button className="w-full md:w-auto bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-600"
            onClick={handleBooking}
            >
              Book Now
            </button>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage", "Aromatherapy", "Sports Massage"].map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4">{service}</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut orci at.
                </p>
                <button className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">Our Packages & Special Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Basic Package", "Premium Package", "Luxury Package"].map((packageName, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4">{packageName}</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy a relaxing and rejuvenating experience with our exclusive {packageName.toLowerCase()}.
                </p>
                <div className="text-lg font-bold text-teal-600 mb-4">$99.99</div>
                <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Video Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">Watch How We Do It</h2>
          <div className="relative mx-auto max-w-3xl">
            <Image
              src="/massage.jpg"
              alt="Video Thumbnail"
              width={800}
              height={450}
              className="rounded-lg shadow-md cursor-pointer"
              onClick={() => setIsVideoOpen(true)}
            />
            <div className="absolute inset-0 flex justify-center items-center">
              <button
                className="bg-teal-500 p-4 rounded-full text-white hover:bg-teal-600"
                onClick={() => setIsVideoOpen(true)}
              >
                ▶
              </button>
            </div>
          </div>
          {isVideoOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <button className="text-gray-500 hover:text-gray-700 mb-4" onClick={() => setIsVideoOpen(false)}>
                  ✕ Close
                </button>
                <video
                  className="w-full rounded-lg"
                  controls
                  src="/promo-video.mp4"
                  autoPlay
                  muted
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">Join Membership</h2>
          <form className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-4">
            <div>
              <label className="block text-left text-gray-700">Name</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500" placeholder="Your Name"
              onChange={(e) => setMemberName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-gray-700">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500" placeholder="Your Email" 
              
              onChange={(e) => setMemberEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-gray-700">Phone Number</label>
              <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500" placeholder="Your Phone Number"
              onChange={(e) => setMemberphone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-gray-700">Preferred Date</label>
              <input type="date" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
              onChange={(e) => setMemberDate(e.target.value)}
              />
            </div>
            <button className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 w-full"
            onClick={handleMembership}
            >
              Submit
            </button>
          </form>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
              >
                <div className="text-teal-500 text-4xl font-bold mb-4">{'★'.repeat(testimonial.rating)}</div>
                <p className="italic text-gray-600 mb-4">"{testimonial.review}"</p>
                <h3 className="text-lg font-bold">{testimonial.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Rating Section */}
      <section id="leave-rating" className="py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-teal-600 mb-8">Leave Us a Review</h2>
          <form className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 space-y-4">
            <div>
              <label className="block text-left text-gray-700 font-semibold">Your Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                onChange={(e) => setRatingName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-semibold">Your Review</label>
              <textarea
                placeholder="Write your review..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              ></textarea>
            </div>
            <div>
              <label className="block text-left text-gray-700 font-semibold">Your Rating</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★☆ (4 Stars)</option>
                <option value="3">★★★☆☆ (3 Stars)</option>
                <option value="2">★★☆☆☆ (2 Stars)</option>
                <option value="1">★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
            <button className="w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
            onClick={handleRating}
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-teal-600 text-white py-6">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 Massage Parlor. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-teal-300">Facebook</a>
            <a href="#" className="hover:text-teal-300">Twitter</a>
            <a href="#" className="hover:text-teal-300">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
