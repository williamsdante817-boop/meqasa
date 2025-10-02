"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface RealEstateReportModalProps {
  triggerText: string;
  triggerVariant?: "brand-primary" | "outline";
  modalType: "view" | "download";
}

export default function RealEstateReportModal({
  triggerText,
  triggerVariant = "brand-primary",
  modalType,
}: RealEstateReportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For "view" type, render a simple link button that opens in new tab
  if (modalType === "view") {
    return (
      <Button variant={triggerVariant} size="lg" className="w-full" asChild>
        <a
          href="https://blog.meqasa.com/real-estate-report-viewer/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {triggerText}
        </a>
      </Button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call for download tracking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Trigger download
    const link = document.createElement("a");
    link.href = "/real-estate-report-2020.pdf";
    link.download = "Meqasa-Real-Estate-Report-2020.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSubmitting(false);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // For "download" type, render the modal with form
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="lg" className="w-full">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Real Estate Report</DialogTitle>
          <DialogDescription>
            Please enter your details to download the comprehensive PDF report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              variant="brand-primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : (
                "Download Report"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
