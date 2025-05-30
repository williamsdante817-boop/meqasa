"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MessageSquare, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ContactCard({
  name,
  image,
  src,
}: {
  name: string;
  image: string;
  src?: boolean;
}) {
  const [showNumber, setShowNumber] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailFormSubmitted, setEmailFormSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [emailNameError, setEmailNameError] = useState("");
  const [emailPhoneError, setEmailPhoneError] = useState("");
  const [alertsChecked, setAlertsChecked] = useState(true);
  const phoneNumber = "+233 24 325 6789";
  const maskedNumber = "+233 xx xxx xxxx";
  const [imageError, setImageError] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setPhoneError("");
    setNameError("");
    if (!userPhone || userPhone.length < 6) {
      setPhoneError("Valid phone number is required");
      valid = false;
    }
    if (!userName) {
      setNameError("Name is required");
      valid = false;
    }
    if (valid) {
      setFormSubmitted(true);
      setShowNumber(true);
    }
  };

  const handleEmailFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setEmailNameError("");
    setEmailPhoneError("");
    setMessageError("");
    if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
      setEmailError("Valid email is required");
      valid = false;
    }
    if (!userPhone || userPhone.length < 6) {
      setEmailPhoneError("Valid phone number is required");
      valid = false;
    }
    if (!userName) {
      setEmailNameError("Name is required");
      valid = false;
    }
    if (!userMessage) {
      setMessageError("Message is required");
      valid = false;
    }
    if (valid) {
      setEmailFormSubmitted(true);
    }
  };

  console.log("logging logo", image);

  return (
    <>
      <Card className="max-w-md mx-auto sticky top-36">
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 mb-4">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              ) : (
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
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            <h2 className="text-xl font-bold text-brand-accent mb-2 text-center">
              {name}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-brand-blue">
                {showNumber ? phoneNumber : maskedNumber}
              </span>
              {!showNumber && (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-sm text-brand-blue border-brand-blue hover:text-brand-blue hover:bg-blue-50"
                      onClick={() => setModalOpen(true)}
                    >
                      Show Number
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Get Number</DialogTitle>
                      <DialogDescription>
                        To view number, first enter your contact info (Do this
                        once only). If you are unable to reach the owner/broker,
                        then they can reach you.
                      </DialogDescription>
                    </DialogHeader>
                    {!formSubmitted ? (
                      <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4 mt-2"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Your Phone Number
                          </label>
                          <PhoneInput
                            country={"gh"}
                            value={userPhone}
                            onChange={(phone) => setUserPhone(phone)}
                            inputClass="w-full"
                            inputStyle={{ width: "100%" }}
                            containerStyle={{ width: "100%" }}
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: true,
                            }}
                          />
                          {phoneError && (
                            <div className="text-red-500 text-xs mt-1">
                              {phoneError}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            className={`w-full px-2 py-2 border rounded outline-none ${nameError ? "border-red-400 bg-red-50" : ""}`}
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          {nameError && (
                            <div className="text-red-500 text-xs mt-1">
                              {nameError}
                            </div>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
                        >
                          Get Number
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-lg font-semibold mb-2">
                          {phoneNumber}
                        </div>
                        <div className="text-green-600">
                          You can now contact the owner/broker.
                        </div>
                        <DialogClose asChild>
                          <Button className="mt-4 w-full">Close</Button>
                        </DialogClose>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="flex gap-4 w-full max-w-md px-4">
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex-1 bg-brand-badge-completed hover:bg-green-700 text-white h-12 gap-2"
                    onClick={() => setModalOpen(true)}
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Get Number</DialogTitle>
                    <DialogDescription>
                      To view number, first enter your contact info (Do this
                      once only). If you are unable to reach the owner/broker,
                      then they can reach you.
                    </DialogDescription>
                  </DialogHeader>
                  {!formSubmitted ? (
                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-4 mt-2"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Phone Number
                        </label>
                        <PhoneInput
                          country={"gh"}
                          value={userPhone}
                          onChange={(phone) => setUserPhone(phone)}
                          inputClass="w-full"
                          inputStyle={{ width: "100%" }}
                          containerStyle={{ width: "100%" }}
                          inputProps={{
                            name: "phone",
                            required: true,
                            autoFocus: true,
                          }}
                        />
                        {phoneError && (
                          <div className="text-red-500 text-xs mt-1">
                            {phoneError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className={`w-full px-2 py-2 border rounded outline-none ${nameError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        {nameError && (
                          <div className="text-red-500 text-xs mt-1">
                            {nameError}
                          </div>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
                      >
                        Get Number
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-lg font-semibold mb-2">
                        {phoneNumber}
                      </div>
                      <div className="text-green-600">
                        You can now contact the owner/broker.
                      </div>
                      <DialogClose asChild>
                        <Button className="mt-4 w-full">Close</Button>
                      </DialogClose>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex-1 bg-brand-blue hover:bg-blue-700 text-white h-12 gap-2"
                    onClick={() => setEmailModalOpen(true)}
                  >
                    <Mail className="w-5 h-5" />
                    Enquire now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Agent</DialogTitle>
                  </DialogHeader>
                  {!emailFormSubmitted ? (
                    <form
                      onSubmit={handleEmailFormSubmit}
                      className="space-y-4 mt-2"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Email Address*
                        </label>
                        <input
                          type="email"
                          className={`w-full px-2 py-2 border rounded outline-none ${emailError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your email address"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                        {emailError && (
                          <div className="text-red-500 text-xs mt-1">
                            {emailError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Phone Number
                        </label>
                        <PhoneInput
                          country={"gh"}
                          value={userPhone}
                          onChange={(phone) => setUserPhone(phone)}
                          inputClass="w-full"
                          inputStyle={{ width: "100%" }}
                          containerStyle={{ width: "100%" }}
                          inputProps={{
                            name: "phone",
                            required: true,
                          }}
                        />
                        {emailPhoneError && (
                          <div className="text-red-500 text-xs mt-1">
                            {emailPhoneError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className={`w-full px-2 py-2 border rounded outline-none ${emailNameError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        {emailNameError && (
                          <div className="text-red-500 text-xs mt-1">
                            {emailNameError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Message
                        </label>
                        <textarea
                          className={`w-full px-2 py-2 border rounded outline-none ${messageError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your Message"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          rows={3}
                        />
                        {messageError && (
                          <div className="text-red-500 text-xs mt-1">
                            {messageError}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={alertsChecked}
                          onChange={(e) => setAlertsChecked(e.target.checked)}
                          className="mr-2 accent-blue-600"
                          id="alertsCheckbox"
                        />
                        <label
                          htmlFor="alertsCheckbox"
                          className="text-sm select-none"
                        >
                          Send me alerts for offices for rent in East legon up
                          to $1,800/month
                        </label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
                      >
                        Send
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-lg font-semibold mb-2 text-green-700">
                        Your enquiry has been sent!
                      </div>
                      <div className="text-brand-muted">
                        The agent will contact you soon.
                      </div>
                      <DialogClose asChild>
                        <Button className="mt-4 w-full">Close</Button>
                      </DialogClose>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-sm text-brand-muted mt-4 max-w-md px-4">
              NB: First submit your contact info once. If you are unable to
              reach the developer, then they can reach you.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
