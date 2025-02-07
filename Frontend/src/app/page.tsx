"use client";
import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "./images";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify"
import { addMember, bookAppointment, leaveRating } from "../services/api"
import { motion } from "framer-motion";
import { X } from "lucide-react";

const Homepage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleBooking = () => {
    setIsOpen(false);
    if (bookname && bookEmail && bookService && bookDate && bookPhone) {
      bookAppointment({ name: bookname, email: bookEmail, service: bookService, date: bookDate, phone: bookPhone })
      toast.success("Your request is sucessful")
    } else {
      toast.error(`Make sure you have filled all fields`);
    }
  }

  const handleMembership = () => {
    if (memberEmail && memberName && memberEmail && memberDate) {
      addMember({ name: memberName, email: memberEmail, startDate: memberDate, phone: memberPhone })
      toast.success("Your request is sucessful")
    } else {
      toast.error(`Make sure you have filled all fields`);
    }
  }

  const handleRating = () => {
    if (ratingName && comment && rating) {
      leaveRating({ user: ratingName, comment, rating })
      toast.success("Your request is sucessful")
    } else {
      toast.error(`Make sure you have filled all fields`);
    }
  }

  type GalleryImage = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };

  const galleryImages: GalleryImage[] = [
    { src: "/shave1.jpg", alt: "Image 1", width: 400, height: 400 },
    { src: "/massage1.jpg", alt: "Image 2", width: 400, height: 400 },
    { src: "/massage2.jpg", alt: "Image 3", width: 400, height: 400 },
    { src: "/massage3.jpg", alt: "Image 4", width: 400, height: 400 },
    { src: "/massage4.jpg", alt: "Image 5", width: 400, height: 400 },
    { src: "/shave2.jpg", alt: "Image 6", width: 400, height: 400 },
    { src: "/shave4.jpg", alt: "Image 6", width: 400, height: 400 },
    { src: "/shave3.jpg", alt: "Image 6", width: 400, height: 400 },
  ];


  const testimonials = [
    {
      name: "Jane",
      review: "Absolutely amazing experience! I felt so relaxed and refreshed.",
      rating: 5,
    },
    {
      name: "John",
      review: "The team is very professional, and the atmosphere is perfect.",
      rating: 4,
    },
    {
      name: "Emily",
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
      <header className="p-4 bg-[#121212]">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          {/* Logo or Title */}
          <div className="text-[#C8A560] text-2xl font-bold"> NiccyDjonSSPA</div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Home</a>
            <a href="#about" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">About</a>
            <a href="#services" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Services</a>
            <a href="#testimonials" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Testimonials</a>
            <a href="#leave ratings" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Ratings</a>
            <a href="#contact" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Contact</a>
          </nav>

          {/* Membership Button (Desktop) */}
          <div className="hidden md:flex">
            <a
              href="#membership"
              className="bg-[#C8A560] text-black px-6 py-2 rounded-lg hover:bg-[#D4AF37] transition duration-300"
            >
              Become a Member
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-[#C8A560]" onClick={toggleMenu}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${isMenuOpen ? "flex" : "hidden"
            } flex-col items-center space-y-4 bg-[#121212] py-4`}
        >
          <a href="#" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Home</a>
          <a href="#about" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">About</a>
          <a href="#services" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Services</a>
          <a href="#testimonials" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Testimonials</a>
          <a href="#leave ratings" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Ratings</a>
          <a href="#contact" className="text-[#C8A560] hover:text-[#D4AF37] font-semibold">Contact</a>

          {/* Mobile Membership Button */}
          <a
            href="#membership"
            className="bg-[#C8A560] text-black px-6 py-2 rounded-lg hover:bg-[#D4AF37] transition duration-300"
          >
            Become a Member
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen bg-cover bg-center bg-no-repeat relative">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/promo-video.mp4" type="video/mp4" />
        </video>
        {/* Logo */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-10 z-30">
          <img src="/logo1.png" alt="Logo" className="h-[100px] sm:h-[100px] md:h-[150px] lg:h-[200px]" />
        </div>

        {/* Call Now Button - Positioned at the bottom on small screens */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[999] sm:bottom-10 sm:left-auto sm:right-10 sm:transform-none">
          <a
            href="tel:254757939067"
            className="bg-[#C8A560] text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:bg-[#D4AF37] transition duration-300 flex items-center space-x-2 text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Call Now: 254 757 939 067</span>
          </a>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-center px-4 sm:px-6 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C8A560] mb-4">
            Relax, Rejuvenate, Revitalize
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#C8A560] text-gray-300 mb-6">
          Where style meets serenity
          </p>

          <button
            className="bg-[#C8A560] text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-lg sm:text-xl hover:bg-[#D4AF37] transition duration-300"
            onClick={() => setIsOpen(true)}
          >
            Book Now
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
            <div className="w-full max-w-md bg-white h-full shadow-lg p-6 transition-transform transform translate-x-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Your Appointment</h2>
              <input type="text" placeholder="Your Name" className="w-full p-2 border rounded mb-2" onChange={(e) => setBookName(e.target.value)} />
              <input type="text" placeholder="Your Phone" className="w-full p-2 border rounded mb-2" onChange={(e) => setBookPhone(e.target.value)} />
              <input type="email" placeholder="Your Email" className="w-full p-2 border rounded mb-2" onChange={(e) => setBookEmail(e.target.value)} />
              <input type="text" placeholder="Select Service" className="w-full p-2 border rounded mb-2" onChange={(e) => setBookService(e.target.value)} />
              <input type="date" className="w-full p-2 border rounded mb-4" onChange={(e) => setBookDate(e.target.value)} />
              <button className="w-full bg-[#121212] text-[#C8A560] font-semibold p-3 rounded-lg hover:text-[#D4AF37]" onClick={handleBooking}>
                Confirm Booking
              </button>
              <button className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition duration-300" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-[#121212]">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-[#C8A560] mb-12">Our Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                category: "Hair Services",
                services: ["Men's Haircut", "Women's Haircut", "Kids' Haircut"],
              },
              {
                category: "Barbershop Services",
                services: ["Beard Trim & Styling", "Full Shave", "Haircut & Beard Trim Combo"],
              },
              {
                category: "Spa Services",
                services: ["Full Body Massage", "Back Massage, Scrubbing, Sauna", "Facial", "Pedicure", "Manicure"],
              },
              {
                category: "Additional Services",
                services: ["Makeup Services", "Waxing (Full Body)", "Waxing (Face)"],
              },
            ].map((group, index) => (
              <div
                key={index}
                className="bg-[#1E1E1E] border border-[#C8A560] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <h3 className="text-2xl font-semibold text-[#C8A560] mb-4">{group.category}</h3>
                <ul className="text-gray-300 space-y-2">
                  {group.services.map((service, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#C8A560]">●</span> {service}
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-[#121212]">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-bold text-[#C8A560] mb-16 relative inline-block">
            Gallery
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#C8A560] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg shadow-2xl group relative ${index % 2 === 0 ? "sm:col-span-2 sm:row-span-2" : "col-span-1 row-span-1"
                  }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 400}
                  height={image.height || 300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#C8A560] mb-8">Watch How We Do It</h2>

          <div className="relative mx-auto max-w-3xl">
            <Image
              src="/massage.jpg"
              alt="Video Thumbnail"
              width={800}
              height={450}
              className="rounded-lg shadow-lg border-2 border-[#C8A560] cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setIsVideoOpen(true)}
            />
            <div className="absolute inset-0 flex justify-center items-center">
              <button
                className="bg-[#C8A560] p-5 rounded-full text-black text-3xl font-bold shadow-md hover:bg-[#D4AF37] hover:scale-110 transition-all"
                onClick={() => setIsVideoOpen(true)}
              >
                ▶
              </button>
            </div>
          </div>

          {isVideoOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
              <div className="bg-[#121212] border border-[#C8A560] rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <button
                  className="text-[#C8A560] hover:text-[#D4AF37] text-2xl mb-4"
                  onClick={() => setIsVideoOpen(false)}
                >
                  ✕ Close
                </button>
                <video
                  className="w-full rounded-lg border border-[#C8A560]"
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
      <section id="booking" className="py-16 bg-[#121212]">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-[#C8A560] mb-8">Join Membership</h2>
          <form className="max-w-xl mx-auto bg-[#1A1A1A] rounded-lg shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-left text-[#C8A560]">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="Your Name"
                onChange={(e) => setMemberName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-[#C8A560]">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="Your Email"
                onChange={(e) => setMemberEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-[#C8A560]">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="Your Phone Number"
                onChange={(e) => setMemberphone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-[#C8A560]">Preferred Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                onChange={(e) => setMemberDate(e.target.value)}
              />
            </div>
            <button
              className="bg-[#C8A560] text-black px-6 py-2 rounded hover:bg-[#D4AF37] w-full transition-all"
              onClick={handleMembership}
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-[#121212]">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-[#C8A560] mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#1A1A1A] rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow flex flex-col items-center text-center"
              >
                {/* Rating */}
                <div className="text-[#C8A560] text-4xl font-bold mb-4">
                  {'★'.repeat(testimonial.rating)}
                </div>

                {/* Review */}
                <p className="italic text-white mb-4">"{testimonial.review}"</p>

                {/* Name */}
                <h3 className="text-lg font-bold text-[#C8A560]">{testimonial.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Customer Rating Section */}
      <section id="leave-rating" className="py-16 bg-[#121212]">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-[#C8A560] mb-8">Leave Us a Review</h2>
          <form className="max-w-lg mx-auto bg-[#1A1A1A] rounded-lg shadow-lg p-8 space-y-4">
            <div>
              <label className="block text-left text-[#C8A560] font-semibold">Your Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                onChange={(e) => setRatingName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-[#C8A560] font-semibold">Your Review</label>
              <textarea
                placeholder="Write your review..."
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              ></textarea>
            </div>
            <div>
              <label className="block text-left text-[#C8A560] font-semibold">Your Rating</label>
              <select
                className="w-full px-4 py-2 border border-[#C8A560] rounded-lg focus:outline-none focus:border-[#D4AF37]"
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★☆ (4 Stars)</option>
                <option value="3">★★★☆☆ (3 Stars)</option>
                <option value="2">★★☆☆☆ (2 Stars)</option>
                <option value="1">★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
            <button
              className="w-full bg-[#C8A560] text-black px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition duration-300"
              onClick={handleRating}
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-[#C8A560] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
            {/* About Section */}
            <div className="mb-8 sm:mb-0">
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">
                At Massage Parlor, we are dedicated to providing the best relaxation and rejuvenation experience. Our skilled therapists and serene environment ensure you leave feeling revitalized.
              </p>
            </div>

            {/* Services Section */}
            <div className="mb-8 sm:mb-0">
              <h3 className="text-xl font-bold mb-4">Our Services</h3>
              <ul className="text-gray-400">
                <li className="mb-2">Hair Services</li>
                <li className="mb-2">Barbershop Services</li>
                <li className="mb-2">Spa Services</li>
                <li className="mb-2">Hot Stone Massage</li>
                <li className="mb-2">Makeup Services</li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="mb-8 sm:mb-0">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="text-gray-400">
                <li className="mb-2">Address: Uhuru St, in the building opposite Family Bank, Second Floor, Thika</li>
                <li className="mb-2">Phone: <a href="tel:254757939067" className="hover:text-[#D4AF37]">254 757 939 067</a></li>
                <li className="mb-2">Email: <a href="mailto:niccydjonsspa@gmail.com" className="hover:text-[#D4AF37]">niccydjonsspa@gmail.com</a></li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.35c0 .732.593 1.325 1.325 1.325h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.732 0 1.325-.593 1.325-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-[#C8A560] mt-8 pt-6 text-center">
            <p className="text-gray-400">&copy; 2025 NiccyDjonSSPA. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Homepage;