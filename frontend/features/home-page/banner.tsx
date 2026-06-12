import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Banner = () => {
    return (
        <section className="relative bg-white dark:bg-black overflow-hidden py-16 sm:py-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10" />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Text Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1">
                        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">New Arrival & Trending</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl xl:text-8xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                            Everything you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">love</span>, delivered.
                        </h1>
                        
                        <p className="max-w-xl text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            Discover our curated collection of trending essentials and timeless classics. Premium quality brands brought together for a seamless shopping experience.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link 
                                href="/products/all-products"
                                className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none"
                            >
                                Shop Collection
                            </Link>
                            <Link 
                                href="/about"
                                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Learn More
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-black bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-400" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900 dark:text-white">10k+ Customers</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Trusted worldwide</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="relative order-1 lg:order-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl -rotate-3 scale-105 blur-2xl" />
                        <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
                             <Image
                                src="/images/hero.png"
                                alt="Modern E-commerce Collection"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                                unoptimized
                            />
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hidden md:block animate-bounce-subtle">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">Quality Checked</p>
                                    <p className="text-[10px] text-gray-500">100% Authentic</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner

