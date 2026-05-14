import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Banner = () => {
    return (
        <section className="bg-white dark:bg-gray-900 overflow-hidden sm:p-30 p-2   ">

            <div className="flex w-full">

                {/* Text Content */}
                <div className="mr-auto place-self-center lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-7xl dark:text-white">
                        Everything you love, delivered to your door.
                    </h1>
                    <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl xl:text-2xl dark:text-gray-400">
                        Discover our curated collection of trending essentials and timeless classics. From the latest tech to everyday home comforts, we bring the world’s best brands together in one place with lightning-fast shipping and easy returns
                    </p>
                </div>

                {/* Image Content */}
                <div className="lg:mt-0 lg:col-span-5 justify-center items-center order-1 lg:order-2 mb-8 lg:mb-0 sm:flex hidden">
                    <Image
                        src="/images/hero.png"
                        alt="mockup"
                        width={500}
                        height={500}
                        className="w-full max-w-[320px] sm:max-w-md lg:max-w-full h-auto object-contain"
                        priority
                        unoptimized
                    />
                </div>
            </div>
        </section>
    )
}

export default Banner
