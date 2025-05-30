"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactSection({
  name,
  image,
  src,
}: {
  name: string;
  image: string;
  src?: boolean;
}) {
  const [showNumber, setShowNumber] = useState(false);

  return (
    <div className="bg-gray-50 py-16 flex flex-col items-center mt-10">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 mb-4">
        <Image
          src={
            src
              ? `https://meqasa.com/uploads/imgs/${image}`
              : `https://dve7rykno93gs.cloudfront.net${image}`
          }
          alt={name}
          width={80}
          height={80}
          className="object-contain w-full h-full"
        />
      </div>

      <h2 className="text-center text-xl font-bold text-brand-accent mb-2">
        {name}
      </h2>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-brand-blue">
          {showNumber ? "+233 24 325 6789" : "+233 xx xxx xxxx"}
        </span>
        {!showNumber && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-sm text-brand-blue border-brand-blue hover:text-brand-blue hover:bg-blue-50"
            onClick={() => setShowNumber(true)}
          >
            Show Number
          </Button>
        )}
      </div>

      <div className="flex gap-4 w-full max-w-md px-4">
        <Button className="flex-1 bg-brand-badge-completed hover:bg-green-700 text-white h-12 gap-2">
          <MessageSquare className="w-5 h-5" />
          WhatsApp
        </Button>

        <Button className="flex-1 bg-brand-blue hover:bg-blue-700 text-white h-12 gap-2">
          <Mail className="w-5 h-5" />
          Enquire now
        </Button>
      </div>

      <p className="text-sm text-brand-muted mt-4 max-w-md px-4">
        NB: First submit your contact info once. If you are unable to reach the
        developer, then they can reach you.
      </p>
    </div>
  );
}
