import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RealEstateAd = () => {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-orange-100 via-white to-blue-50 rounded-xl shadow overflow-hidden">
      {/* Header with Logo and Palm Leaves */}
      <div className="relative bg-gradient-to-r from-white to-gray-50 p-6 pb-4">
        <div className="absolute top-0 right-0 w-32 h-24 bg-gradient-to-bl from-green-400 to-green-500 opacity-20 rounded-bl-full"></div>
        <div className="absolute top-2 right-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-30 animate-pulse"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-2">
            <div className="text-2xl font-bold text-gray-800">OKO</div>
            <div className="text-sm text-orange-500 font-medium">Kusheri</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Live Relaxed Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
            Live <span className="font-bold italic">Relaxed</span>
          </h1>

          <div className="space-y-1 text-gray-700">
            <div className="text-lg font-bold">STUDIOS, 1 & 2</div>
            <div className="text-base font-semibold">BEACHVIEW APARTMENTS</div>
            <div className="text-base font-semibold">& PENTHOUSES</div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 via-orange-300 to-blue-200 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"
              alt="Happy couple enjoying beachview apartment"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Building Image Overlay */}
          <div className="absolute bottom-4 right-4 w-20 h-16 bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=150&fit=crop"
              alt="Modern apartment building"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Now Selling Badge */}
          <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full font-bold animate-bounce">
            NOW SELLING OFFPLAN
          </Badge>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 line-through text-lg font-semibold">
                $52,000
              </div>
              <div className="text-2xl font-bold text-gray-800">$48,600</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">
                5% reservation fee
              </div>
              <div className="text-xs text-gray-600">Pay $1,282.50 per</div>
              <div className="text-xs text-gray-600">month over 36 months</div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
          <MapPin className="w-5 h-5 text-red-500" />
          <span className="font-medium">Nungua, Nr Maritime University</span>
        </div>

        {/* Bottom Branding */}
        <div className="flex justify-center">
          <div className="text-xs text-gray-500 font-medium tracking-wider">
            SIGNUM
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateAd;
