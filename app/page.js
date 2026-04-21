"use client";
import { useState } from "react";

export default function Home() {
  const [howItWorksTab, setHowItWorksTab] = useState("teen");
  const [openFaq, setOpenFaq] = useState(null);

  const teenSteps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: "Create your profile",
      desc: "Add your skills, availability, and a short bio. Takes less than 2 minutes.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
      ),
      title: "Browse local jobs",
      desc: "See gigs posted by families and businesses in your town. Filter by type, pay, and distance.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      title: "Get paid",
      desc: "Apply in one tap, show up, and earn. Build your reputation with reviews after every job.",
    },
  ];

  const employerSteps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
      title: "Post a job",
      desc: "Describe what you need, set your pay, and go live in under 2 minutes. Free to start.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      title: "Receive applications",
      desc: "Browse profiles of vetted local teens with skills, reviews, and availability.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Hire with confidence",
      desc: "Message, hire, and pay securely through the platform. Leave a review when done.",
    },
  ];

  const steps = howItWorksTab === "teen" ? teenSteps : employerSteps;

  const marqueeItems = [
    "Babysitting · $20/hr",
    "Lawn Care · $35/job",
    "Tutoring · $25/hr",
    "Pet Sitting · $18/hr",
    "Snow Removal · $40/job",
    "House Cleaning · $20/hr",
    "Grocery Help · $15/hr",
    "Moving Help · $18/hr",
    "Car Washing · $25/job",
    "Dog Walking · $15/hr",
  ];

  const gigTypes = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      label: "Babysitting",
      rate: "$15-25/hr",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
      label: "Lawn Care",
      rate: "$20-40/job",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      label: "Tutoring",
      rate: "$20-35/hr",
    },
    {
      // Paw print — correct icon for Pet Sitting
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4.5 9.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-3.314 0-6-1.8-6-4.5 0-1.06.47-2.02 1.25-2.78.3-.29.5-.68.5-1.1V12a4.25 4.25 0 0 1 8.5 0v.62c0 .42.2.81.5 1.1.78.76 1.25 1.72 1.25 2.78C18 19.2 15.314 21 12 21z" />
        </svg>
      ),
      label: "Pet Sitting",
      rate: "$15-25/hr",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      ),
      label: "Grocery Help",
      rate: "$12-18/hr",
    },
    {
      // Spray bottle / cleaning — correct icon for House Cleaning
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 3H7a1 1 0 0 0-1 1v3.5M9.5 3h1a1 1 0 0 1 1 1v1.5m-1-2.5V2m0 1.5V7m0 0h1.75a1 1 0 0 1 .96.714l2.54 8.572A2 2 0 0 1 13.833 18H8.167a2 2 0 0 1-1.917-1.714L5.5 10.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h5m7 3h.008v.008H18V10zm0 3h.008v.008H18V13zm0 3h.008v.008H18V16zm-3-6h.008v.008H15V10zm0 3h.008v.008H15V13z" />
        </svg>
      ),
      label: "House Cleaning",
      rate: "$15-25/hr",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
      label: "Snow Removal",
      rate: "$25-50/job",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      label: "Moving Help",
      rate: "$15-20/hr",
    },
  ];

  const testimonialIcons = [
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>,
  ];

  const businessRoles = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
      title: "Retail & Stock",
      desc: "Weekend shelf restocking, inventory counts, and customer-facing floor help.",
      badge: "Weekends",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3.75h.008v.008H21V15.75zm-18 0h.008v.008H3V15.75z" />
        </svg>
      ),
      title: "Food Service",
      desc: "Bussing, dishwashing, prep work, and front-of-house support during peak hours.",
      badge: "Evenings",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      title: "Seasonal Help",
      desc: "Holiday rushes, summer events, and one-off busy periods that need extra hands fast.",
      badge: "Seasonal",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: "Delivery & Errands",
      desc: "Local pickups, drop-offs, and errand runs for businesses that need a reliable extra set of hands.",
      badge: "Flexible",
    },
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* MARQUEE TICKER */}
      <div className="w-full bg-[#C8FF00] py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-black text-xs font-semibold mx-6 shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </span>
        <a
          href="/auth/signup"
          className="text-sm font-semibold bg-[#C8FF00] text-black px-4 py-2 rounded-full hover:bg-lime-300 transition"
        >
          Try Catalyst Now
        </a>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-5 py-20 md:py-32">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
          Launching in Plymouth, IN — March 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight max-w-2xl">
          The local job board{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-black text-[#C8FF00] px-2 rounded-lg">
              built for teens
            </span>
          </span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-gray-500 max-w-md">
          Skip the fast food grind. Find babysitting, lawn care, tutoring gigs
          — on your schedule, in your town.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-medium px-4 py-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Plymouth, Indiana · Marshall County
        </div>
        <div className="mt-8 flex gap-8 text-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">530+</span>
            <span className="text-xs text-gray-400">Plymouth teens ready to work</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">350+</span>
            <span className="text-xs text-gray-400">local households need help</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">$0</span>
            <span className="text-xs text-gray-400">to get started</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">Based on Plymouth market research, Feb 2026</p>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full px-5 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Up and running in minutes</h2>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium">
              <button
                onClick={() => setHowItWorksTab("teen")}
                className={`px-6 py-2.5 transition ${howItWorksTab === "teen" ? "bg-black text-[#C8FF00]" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                For Teens
              </button>
              <button
                onClick={() => setHowItWorksTab("employer")}
                className={`px-6 py-2.5 transition ${howItWorksTab === "employer" ? "bg-black text-[#C8FF00]" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                For Employers
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="w-full h-40 bg-[#C8FF00]/20 flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-[#C8FF00] text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN FIND */}
      <section className="w-full px-5 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Gig types</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Work that fits your life</h2>
            <p className="mt-3 text-gray-500 text-base max-w-md mx-auto">
              Every gig is flexible, local, and pays way better than minimum wage.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gigTypes.map((gig, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
                <span className="text-gray-700">{gig.icon}</span>
                <span className="font-semibold text-sm text-gray-900">{gig.label}</span>
                <span className="text-xs text-gray-400">{gig.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS PART-TIME SECTION */}
      <section className="w-full px-5 py-20 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C8FF00]/70 mb-2">For local businesses</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Your next part-time hire<br />is already in town
            </h2>
            <p className="mt-4 text-gray-400 text-base max-w-lg mx-auto">
              Catalyst isn't just for one-off gigs. Post recurring part-time roles and find motivated local teens who show up, stay consistent, and grow with your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {businessRoles.map((role, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#C8FF00]/40 transition">
                <div className="w-11 h-11 rounded-xl bg-[#C8FF00]/15 flex items-center justify-center shrink-0 text-[#C8FF00]">
                  {role.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{role.title}</h3>
                    <span className="text-xs font-medium bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{role.badge}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Ready to build your local roster?</h3>
              <p className="text-gray-400 text-sm">Free to post. Pay only when you hire. No recruiters, no agencies.</p>
            </div>
            <a
              href="/auth/signup/employer"
              className="shrink-0 bg-[#C8FF00] text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-lime-300 transition whitespace-nowrap"
            >
              Post a role for free
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="w-full px-5 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Early feedback</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your neighbors are already in</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I needed a reliable sitter for Friday nights. Found someone within a day — she has been with us every week since.", name: "Sarah M.", role: "Parent in Plymouth", iconIdx: 0 },
              { quote: "Made $340 last month just doing lawn care on weekends. Way better than working a register.", name: "Jake R.", role: "Junior, Plymouth High", iconIdx: 1 },
              { quote: "We needed weekend help at our shop. Posted a job and had 5 applicants by the next morning.", name: "Tom B.", role: "Local business owner", iconIdx: 2 },
            ].map((t, i) => (
              <div key={i} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-700 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-[#C8FF00] flex items-center justify-center text-black">
                    {testimonialIcons[t.iconIdx]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-5 py-20 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Common questions</h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
            {[
              { q: "Is it really free for teens?", a: "Yes, 100%. Teens never pay anything to create a profile, browse jobs, or apply. Always." },
              { q: "What age do you have to be?", a: "Catalyst is built for teens ages 14-21. We follow all applicable child labor laws and require age verification on signup." },
              { q: "Where is Catalyst available?", a: "We are launching in Plymouth, IN in March 2026 and expanding across Marshall County shortly after. More towns coming fast." },
              { q: "Can businesses post recurring part-time roles?", a: "Absolutely. Businesses can post both one-off gigs and ongoing part-time positions. You set the hours, schedule, and pay — Catalyst handles the applicant pipeline." },
            ].map((item, i) => (
              <div key={i} className="bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    className={`shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full px-5 py-24 bg-black">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Your town. Your schedule.<br />Your money.
          </h2>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-5 py-10 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-white font-bold text-lg tracking-tight">
            catalyst<span className="text-[#C8FF00]">.</span>
          </span>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C8FF00] hover:text-black transition flex items-center justify-center group">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white group-hover:fill-black transition">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C8FF00] transition flex items-center justify-center group">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white group-hover:fill-black transition">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C8FF00] transition flex items-center justify-center group">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white group-hover:fill-black transition">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms</a>
            <span>© 2026 Catalyst</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  );
}