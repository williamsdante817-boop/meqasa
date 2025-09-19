"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ImprovedAppPromotion() {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Add a subtle floating animation effect when component mounts
    const interval = setInterval(() => {
      setIsHovering((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden rounded-xl bg-[#f0f5ff] px-4 py-16 md:px-8 lg:px-16"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
        <div className="max-w-lg">
          <h2 className="mb-4 text-3xl font-bold text-[#1e2b5c] md:text-4xl">
            Do more on the app.
          </h2>
          <p className="mb-2 text-lg text-[#1e2b5c] md:text-xl">
            Save your searches, track enquiries and more.
          </p>
          <p className="mb-8 text-lg text-[#1e2b5c] md:text-xl">
            Available on iOS and Android
          </p>

          <div className="flex flex-wrap gap-4">
            {/* App Store Button */}
            <Link href="#" className="inline-block">
              <div className="flex h-[60px] w-[200px] items-center justify-center rounded-lg bg-black px-4 py-2 text-white">
                <div className="mr-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </div>
            </Link>

            {/* Google Play Button */}
            <Link href="#" className="inline-block">
              <div className="flex h-[60px] w-[200px] items-center justify-center rounded-lg bg-black px-4 py-2 text-white">
                <div className="mr-3">
                  <svg viewBox="0 0 512 512" width="30" height="30">
                    <path
                      d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
                      fill="#EA4335"
                    />
                    <path
                      d="M104.6 13A227 227 0 0 0 13 104.6l182.7 182.7 60.1-60.1L104.6 13z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M13 104.6A227 227 0 0 0 13 407.4l182.7-182.7L13 104.6z"
                      fill="#34A853"
                    />
                    <path
                      d="M13 407.4A227 227 0 0 0 104.6 499l280.8-280.8-60.1-60.1L13 407.4z"
                      fill="#4285F4"
                    />
                    <path
                      d="M104.6 499A227 227 0 0 0 385.4 499L325.3 277.6l-60.1 60.1L104.6 499z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="relative h-[400px] overflow-visible md:h-[500px]">
          {/* Featured Properties Phone */}
          <div
            className={`absolute top-[-30px] right-[-20px] z-10 -rotate-6 transform transition-all duration-700 ${isHovering ? "translate-y-[-10px]" : "translate-y-[0px]"}`}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div
              className="relative h-[450px] w-[220px] overflow-hidden rounded-3xl border-8 border-white bg-white shadow-2xl"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="absolute top-0 left-0 flex h-full w-full flex-col">
                <div className="bg-white p-3">
                  <div className="origin-top-left rotate-[6deg] transform text-sm font-semibold text-gray-800">
                    Featured Projects
                    <span className="text-blue-500">See all</span>
                  </div>
                </div>
                <div className="flex-1 bg-gray-100 p-2">
                  <div className="mb-3 overflow-hidden rounded-lg bg-white">
                    <div className="h-24 bg-gray-200"></div>
                    <div className="p-2">
                      <div className="mb-1 h-2 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white">
                    <div className="h-24 bg-gray-200"></div>
                    <div className="p-2">
                      <div className="mb-1 h-2 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Phone reflection/shadow effect */}
            <div className="absolute right-[10px] bottom-[-15px] left-[10px] h-[20px] -rotate-6 transform rounded-full bg-black opacity-20 blur-md"></div>
          </div>

          {/* Search Interface Phone */}
          <div
            className={`absolute top-[20px] right-[100px] z-0 rotate-6 transform transition-all duration-700 ${isHovering ? "translate-y-[-10px] delay-300" : "translate-y-[0px]"}`}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div
              className="relative h-[450px] w-[220px] overflow-hidden rounded-3xl border-8 border-white bg-white shadow-2xl"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="absolute top-0 left-0 flex h-full w-full flex-col">
                <div className="bg-white p-3">
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
                <div className="flex-1 bg-gray-100 p-2">
                  <div className="mb-3 rounded-lg bg-white p-3">
                    <div className="mb-2 h-3 w-1/3 rounded bg-gray-200"></div>
                    <div className="mb-3 h-6 rounded bg-gray-200"></div>
                    <div className="mb-2 h-3 w-1/3 rounded bg-gray-200"></div>
                    <div className="mb-3 h-6 rounded bg-gray-200"></div>
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <div>
                        <div className="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
                        <div className="h-6 rounded bg-gray-200"></div>
                      </div>
                      <div>
                        <div className="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
                        <div className="h-6 rounded bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="flex h-10 items-center justify-center rounded bg-red-500">
                      <div className="h-3 w-1/3 rounded bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Phone reflection/shadow effect */}
            <div className="absolute right-[10px] bottom-[-15px] left-[10px] h-[20px] rotate-6 transform rounded-full bg-black opacity-20 blur-md"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
