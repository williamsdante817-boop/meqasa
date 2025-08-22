"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { InfoIcon } from "lucide-react";
//

interface MortgageBreakdown {
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
}

export default function MortgageCalculator({ price }: { price: string }) {
  const DEFAULT_DOWN_PAYMENT_RATIO = 0.2;
  const [propertyPrice, setPropertyPrice] = useState<number>(+price);
  const [downPayment, setDownPayment] = useState<number>(() => {
    const p = Number(price) || 0;
    return Math.round(p * DEFAULT_DOWN_PAYMENT_RATIO);
  });
  const hasUserChangedDownPaymentRef = useRef(false);
  const [tenure, setTenure] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(18);
  const [breakdown, setBreakdown] = useState<MortgageBreakdown>({
    loanAmount: 0,
    downPayment: 0,
    monthlyPayment: 0,
    principalPayment: 0,
    interestPayment: 0,
  });

  const calculateMortgage = useCallback(() => {
    const loan = Math.max(0, propertyPrice - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = tenure * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (loan * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loan / numberOfPayments;
    }

    // Calculate principal and interest components correctly
    const interestPayment = loan * monthlyRate;
    const principalPayment = Math.max(0, monthlyPayment - interestPayment);

    setBreakdown({
      loanAmount: loan,
      downPayment,
      monthlyPayment,
      principalPayment,
      interestPayment,
    });
  }, [propertyPrice, downPayment, tenure, interestRate]);

  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);

  // Keep local price in sync with prop to reflect actual property data
  // Always reset default down payment to 20% when property changes
  useEffect(() => {
    const numericPrice = Number(price) || 0;
    if (numericPrice !== propertyPrice) {
      setPropertyPrice(numericPrice);
      const suggested = Math.round(numericPrice * DEFAULT_DOWN_PAYMENT_RATIO);
      setDownPayment(Math.min(numericPrice, suggested));
      hasUserChangedDownPaymentRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  // Ensure down payment never exceeds property price when price decreases
  useEffect(() => {
    if (downPayment > propertyPrice) {
      setDownPayment(propertyPrice);
    }
  }, [propertyPrice, downPayment]);

  const handlePropertyPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value) || 0;
    // Prevent negative values
    setPropertyPrice(Math.max(0, value));
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    // Ensure down payment doesn't exceed property price
    const sanitizedValue = Math.max(0, value);
    const maxDownPayment = Math.min(sanitizedValue, propertyPrice);
    setDownPayment(maxDownPayment);
    hasUserChangedDownPaymentRef.current = true;
  };

  const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 1;
    // Clamp value between 1 and 30
    const clampedValue = Math.min(Math.max(value, 1), 30);
    setTenure(clampedValue);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    // Clamp value between 0 and 30
    const clampedValue = Math.min(Math.max(value, 0), 30);
    setInterestRate(clampedValue);
  };

  const formatCurrency = (value: number): string => {
    return `GH₵${Math.round(value).toLocaleString()}`;
  };

  // Safe derived values to prevent NaN/Infinity in UI rendering
  const monthlyTotal = Number.isFinite(breakdown.monthlyPayment)
    ? breakdown.monthlyPayment
    : 0;
  const safeMonthly = monthlyTotal > 0 ? monthlyTotal : 0;
  const interestPortion = safeMonthly
    ? Math.min(1, Math.max(0, breakdown.interestPayment / safeMonthly))
    : 0;
  const principalPortion = safeMonthly
    ? Math.min(1, Math.max(0, breakdown.principalPayment / safeMonthly))
    : 0;
  const circumference = 264; // ~ 2 * Math.PI * r, with r=42
  const downPaymentPercent =
    propertyPrice > 0
      ? Math.min(100, Math.max(0, (downPayment / propertyPrice) * 100))
      : 0;
  const loanPortion =
    propertyPrice > 0 ? breakdown.loanAmount / propertyPrice : 0;
  const loanPercent = Math.min(100, Math.max(0, loanPortion * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Inputs */}
      <Card className="p-4">
        <CardContent className="pt-0 px-3 h-full">
          <div className="flex flex-col justify-between h-full ">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyPrice" className="text-brand-accent">
                  Property Price
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-brand-muted">
                    GH₵
                  </span>
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={propertyPrice}
                    onChange={handlePropertyPriceChange}
                    min={0}
                    className="rounded-l-none text-brand-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPayment" className="text-brand-accent">
                  Down Payment
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-brand-muted">
                    GH₵
                  </span>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                    min={0}
                    className="rounded-l-none text-brand-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="tenure" className="text-brand-accent">
                    Tenure (yrs)
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="tenureInput"
                      type="number"
                      value={tenure}
                      onChange={handleTenureChange}
                      className="w-20 h-8 mr-2 text-brand-accent"
                      min={1}
                      max={30}
                    />
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-brand-muted">
                      yrs
                    </span>
                  </div>
                </div>
                <Slider
                  id="tenure"
                  min={1}
                  max={30}
                  step={1}
                  value={[tenure]}
                  onValueChange={(value) => setTenure(value[0] ?? tenure)}
                  className="my-4"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interest" className="text-brand-accent">
                    Interest (%)
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="interestInput"
                      type="number"
                      value={interestRate}
                      onChange={handleInterestRateChange}
                      className="w-20 h-8 mr-2 text-brand-accent"
                      min={0}
                      max={30}
                      step={0.1}
                    />
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-brand-muted">
                      %
                    </span>
                  </div>
                </div>
                <Slider
                  id="interest"
                  min={0}
                  max={30}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={(value) =>
                    setInterestRate(value[0] ?? interestRate)
                  }
                  className="my-4"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4 flex gap-3">
              <InfoIcon className="text-blue-500 h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-brand-muted">
                Adjust the sliders to see how different loan terms and interest
                rates affect your monthly payments. The calculator helps you
                plan your mortgage by showing both principal and interest
                components.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Results */}
      <Card className="">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-brand-accent">
              Mortgage Breakdown
            </h2>
            <span className="text-sm text-brand-muted">
              at {interestRate.toFixed(1)}% interest rate
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="circle-chart relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  className="accent-circle"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#d8e5ff"
                  strokeWidth="8"
                />
                <circle
                  className="accent-circle"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#216AFF"
                  strokeWidth="8"
                  strokeDasharray={`${(loanPercent / 100) * circumference} ${circumference}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="circle-chart-value absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-bold text-xl text-brand-accent">
                  {formatCurrency(breakdown.loanAmount)}
                </div>
                <div className="text-xs text-brand-muted">
                  Loan Amount ({loanPercent.toFixed(0)}%)
                </div>
              </div>
            </div>

            <div className="circle-chart relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  className="accent-circle interest-segment"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#216AFF"
                  strokeWidth="8"
                  strokeDasharray={`${interestPortion * circumference} ${circumference}`}
                  transform="rotate(-90 50 50)"
                />
                <circle
                  className="accent-circle principal-segment"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#ff609c"
                  strokeWidth="8"
                  strokeDasharray={`${principalPortion * circumference} ${circumference}`}
                  transform={`rotate(${interestPortion * 360 - 90} 50 50)`}
                />
              </svg>
              <div className="circle-chart-value absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-bold text-xl text-brand-accent">
                  {formatCurrency(breakdown.monthlyPayment)}
                </div>
                <div className="text-xs text-brand-muted">/month</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-brand-muted">
                Down Payment ({downPaymentPercent.toFixed(0)}%)
              </span>
              <span className="font-medium text-brand-accent">
                {formatCurrency(downPayment)}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-base mb-3 text-brand-accent">
                Monthly Payment
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex justify-between items-center space-x-2">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#ff99b6] mr-2"></span>
                    <span className="text-brand-muted">Principal</span>
                  </div>
                  <span className="font-medium text-brand-accent">
                    {formatCurrency(breakdown.principalPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 space-x-2">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#4361ee] mr-2"></span>
                    <span className="text-brand-muted">Interest</span>
                  </div>
                  <span className="font-medium text-brand-accent">
                    {formatCurrency(breakdown.interestPayment)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// import type { ReactNode } from "react";
// import React from "react";

// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { SliderInterest } from "@/components/ui/slider-interest";
// import { SliderTenure } from "@/components/ui/slider-tenure";
// import { formatNumberToCedis } from "@/lib/utils";

// export default function MortgageCalculator({ price }: { price: string }) {
//   const [tenure, setTenure] = React.useState([10]);
//   const [interest, setInterest] = React.useState([18]);
//   const [propertyPrice, setPropertyPrice] = React.useState(price);
//   const [loanAmount, setLoanAmount] = React.useState(0);
//   const [downPayment, setDownPayment] = React.useState("0");
//   const [monthlyPayment, setMonthlyPayment] = React.useState(0);
//   const [downPaymentPercent, setDownPaymentPercent] = React.useState(0);
//   const [loanPercent, setLoanPercent] = React.useState(0);
//   const [principalAmount, setPrincipalAmount] = React.useState(0);
//   const [interestAmount, setInterestAmount] = React.useState(0);
//   const [principalPercent, setPrincipalPercent] = React.useState(0);
//   const [interestPercent, setInterestPercent] = React.useState(0);

//   // Parse currency string to number
//   const parseCurrencyValue = (value: string): number => {
//     if (!value) return 0;
//     // Remove all non-numeric characters except decimal point
//     const cleanValue = value.replace(/[^0-9.]/g, "");
//     const numberValue = Number(cleanValue);
//     return isNaN(numberValue) ? 0 : numberValue;
//   };

//   // Format number with commas while typing
//   const formatWithCommas = (value: string): string => {
//     // Remove any non-digit characters except decimal
//     const cleanValue = value.replace(/[^0-9.]/g, "");

//     // Split number into integer and decimal parts
//     const [integer, decimal] = cleanValue.split(".");

//     // Add commas to integer part (default to "0" if undefined)
//     const formattedInteger = (integer ?? "0").replace(
//       /\B(?=(\d{3})+(?!\d))/g,
//       ",",
//     );

//     // Return formatted number
//     return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
//   };

//   // Format final value for display
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const formatFinalValue = (value: string | number): string => {
//     const numericValue = parseCurrencyValue(String(value));
//     return formatNumberToCedis(String(numericValue), "en-GH");
//   };

//   // Calculate loan amount
//   const calculateLoanAmount = React.useCallback(() => {
//     const parsedPropertyPrice = parseCurrencyValue(propertyPrice);
//     const parsedDownPayment = parseCurrencyValue(downPayment);

//     // Ensure down payment doesn't exceed property price
//     const validDownPayment = Math.min(parsedDownPayment, parsedPropertyPrice);
//     const validLoanAmount = parsedPropertyPrice - validDownPayment;

//     setLoanAmount(validLoanAmount);
//     return validLoanAmount;
//   }, [downPayment, propertyPrice]);

//   // Calculate monthly payment
//   const calculateMonthlyPayment = React.useCallback(() => {
//     const monthlyInterestRate = (interest[0] ?? 0) / 12 / 100;
//     const numberOfPayments = (tenure[0] ?? 0) * 12;
//     const principal = loanAmount;

//     if (monthlyInterestRate && numberOfPayments && principal) {
//       const monthlyPayment =
//         (principal *
//           monthlyInterestRate *
//           Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
//         (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

//       const monthlyInterestAmount = principal * monthlyInterestRate;
//       const monthlyPrincipalAmount = monthlyPayment - monthlyInterestAmount;

//       setMonthlyPayment(monthlyPayment);
//       setInterestAmount(monthlyInterestAmount);
//       setPrincipalAmount(monthlyPrincipalAmount);

//       // Calculate percentages for principal and interest
//       const totalPayment = monthlyPrincipalAmount + monthlyInterestAmount;
//       if (totalPayment > 0) {
//         setPrincipalPercent(
//           Math.round((monthlyPrincipalAmount / totalPayment) * 100),
//         );
//         setInterestPercent(
//           Math.round((monthlyInterestAmount / totalPayment) * 100),
//         );
//       }
//     } else {
//       setMonthlyPayment(0);
//       setInterestAmount(0);
//       setPrincipalAmount(0);
//       setPrincipalPercent(0);
//       setInterestPercent(0);
//     }
//   }, [loanAmount, interest, tenure]);

//   React.useEffect(() => {
//     calculateLoanAmount();
//     calculateMonthlyPayment();

//     const parsedPropertyPrice = parseCurrencyValue(propertyPrice);
//     const parsedDownPayment = parseCurrencyValue(downPayment);

//     // Calculate percentages
//     if (parsedPropertyPrice > 0) {
//       setDownPaymentPercent(
//         Math.round((parsedDownPayment / parsedPropertyPrice) * 100),
//       );
//       setLoanPercent(Math.round((loanAmount / parsedPropertyPrice) * 100));
//     }
//   }, [
//     propertyPrice,
//     downPayment,
//     loanAmount,
//     calculateLoanAmount,
//     calculateMonthlyPayment,
//   ]);

//   const handlePropertyPriceChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const rawValue = e.target.value;
//     const formattedValue = formatWithCommas(rawValue);
//     setPropertyPrice(formattedValue);
//   };

//   const handlePropertyPriceBlur = () => {
//     const numericValue = parseCurrencyValue(propertyPrice);
//     const formatted = formatNumberToCedis(String(numericValue), "en-GH");
//     setPropertyPrice(formatted);
//   };

//   const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const rawValue = e.target.value;
//     const formattedValue = formatWithCommas(rawValue);
//     setDownPayment(formattedValue);
//   };

//   const handleDownPaymentBlur = () => {
//     const numericValue = parseCurrencyValue(downPayment);
//     const formatted = formatNumberToCedis(String(numericValue), "en-GH");
//     setDownPayment(formatted);
//   };

//   return (
//     <div
//       className="flex h-full flex-col gap-8 md:flex-row"
//       role="main"
//       aria-label="Mortgage Calculator"
//     >
//       <Card className="h-full w-full rounded-xl border-[#50a3ff] p-[13px] text-b-accent md:max-w-[448px]">
//         <div role="form">
//           <div>
//             <div className="mb-6">
//               <Label
//                 htmlFor="propertyPrice"
//                 className="mb-2 block text-base font-semibold"
//               >
//                 Property Price
//               </Label>
//               <Label htmlFor="propertyPrice" className="flex">
//                 <span className="flex items-center rounded-l-md border border-r-0 bg-[#f8f8f8] px-2 text-xs text-b-accent">
//                   GH₵
//                 </span>
//                 <Input
//                   id="propertyPrice"
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   className="h-[42px] w-full rounded-md rounded-l-none shadow-none"
//                   placeholder="Enter property price"
//                   value={propertyPrice}
//                   onChange={handlePropertyPriceChange}
//                   onBlur={handlePropertyPriceBlur}
//                   aria-label="Property price input"
//                 />
//               </Label>
//             </div>
//             <div className="mb-6">
//               <Label
//                 htmlFor="downPayment"
//                 className="mb-2 block text-base font-semibold"
//               >
//                 Down Payment
//               </Label>
//               <Label htmlFor="downPayment" className="flex">
//                 <span className="flex items-center rounded-l-md border border-r-0 bg-[#f8f8f8] px-2 text-xs text-b-accent">
//                   GH₵
//                 </span>
//                 <Input
//                   id="downPayment"
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   className="h-[42px] w-full rounded-md rounded-l-none shadow-none"
//                   placeholder="Enter down payment"
//                   value={downPayment}
//                   onChange={handleDownPaymentChange}
//                   onBlur={handleDownPaymentBlur}
//                   aria-label="Down payment input"
//                 />
//               </Label>
//             </div>

//             <div className="mb-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <Label
//                   htmlFor="tenure"
//                   className="w-fit whitespace-nowrap text-base font-semibold"
//                 >
//                   Tenure <span className="text-sm font-normal">(yrs)</span>
//                 </Label>
//                 <SliderTenure
//                   id="tenure"
//                   defaultValue={[10]}
//                   max={35}
//                   min={5}
//                   step={1}
//                   value={tenure}
//                   className="border-none"
//                   onValueChange={setTenure}
//                   aria-label="Loan tenure in years"
//                 />
//                 <Input
//                   id="tenureValue"
//                   className="h-[42px] w-[65px] rounded-md shadow-none"
//                   type="number"
//                   value={tenure[0]}
//                   onChange={(e) => setTenure([Number(e.target.value)])}
//                   min={5}
//                   max={35}
//                   aria-label="Loan tenure value"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <Label
//                   htmlFor="interest"
//                   className="w-fit whitespace-nowrap text-base font-semibold"
//                 >
//                   Interest <span className="text-sm font-normal">(%)</span>
//                 </Label>
//                 <SliderInterest
//                   id="interest"
//                   defaultValue={[18]}
//                   max={30}
//                   min={1}
//                   step={0.1}
//                   value={interest}
//                   onValueChange={setInterest}
//                   className="border-none"
//                   aria-label="Interest rate percentage"
//                 />
//                 <Input
//                   id="interestValue"
//                   className="h-[42px] w-[65px] rounded-md shadow-none"
//                   type="number"
//                   value={interest[0]}
//                   onChange={(e) => setInterest([Number(e.target.value)])}
//                   min={1}
//                   max={30}
//                   step={0.1}
//                   aria-label="Interest rate value"
//                 />
//               </div>
//             </div>
//             <div className="mt-3 flex h-full w-fit items-start justify-between gap-3 rounded-lg border border-[#50a3ff] bg-[#d7e9ff] p-3 text-xs font-light shadow-sm md:text-sm">
//               <p>
//                 Adjust the sliders to see how different loan terms and interest
//                 rates affect your monthly payments. The calculator helps you
//                 plan your mortgage by showing both principal and interest
//                 components.
//               </p>
//             </div>
//           </div>
//         </div>
//       </Card>
//       <Card className="w-full rounded-xl p-[13px] text-b-accent">
//         <div className="h-full w-full rounded-xl bg-[#F8F8FA] px-3 py-4 md:px-6">
//           <div>
//             <div className="flex items-center justify-between">
//               <h2 className="font-semibold text-inherit">Mortgage Breakdown</h2>
//               <p className="text-sm text-inherit md:text-base md:font-semibold">
//                 at {interest[0]?.toFixed(1)}% interest rate
//               </p>
//             </div>
//             <Separator className="my-4" />
//             <div className="grid grid-cols-2">
//               <div className="">
//                 <div className="mx-auto h-[220px] max-w-[220px]">
//                   <SvgDoughnut percentage={loanPercent}>
//                     <text
//                       textAnchor="middle"
//                       x="0"
//                       y="0"
//                       style={{ pointerEvents: "none" }}
//                       aria-label={`Loan amount: ${formatNumberToCedis(loanAmount, "en-GH")}, ${loanPercent}% of property price`}
//                     >
//                       <tspan
//                         x="0"
//                         dy="0"
//                         className="fill-b-accent text-2xl font-extrabold"
//                         style={{ fontSize: "1.2%" }}
//                       >
//                         {formatNumberToCedis(loanAmount, "en-GH")}
//                       </tspan>
//                       <tspan
//                         x="0"
//                         dy="0.4"
//                         className="fill-b-accent text-lg font-light"
//                         style={{ fontSize: "0.8%" }}
//                       >
//                         Loan Amount ({loanPercent}%)
//                       </tspan>
//                     </text>
//                   </SvgDoughnut>
//                 </div>
//                 <div className="md:mt-5">
//                   <p className="text-center text-sm font-light text-inherit">
//                     Down Payment ({downPaymentPercent}%)
//                   </p>
//                   <p className="mt-2 text-center font-bold leading-[31px] text-inherit md:text-[23px]">
//                     {formatNumberToCedis(downPayment, "en-GH")}
//                   </p>
//                 </div>
//               </div>

//               <div className="relative">
//                 <div className="mx-auto h-[220px] max-w-[220px]">
//                   <DualDoughnut
//                     firstPercentage={principalPercent}
//                     secondPercentage={interestPercent}
//                   >
//                     <text
//                       textAnchor="middle"
//                       x="0"
//                       y="0"
//                       style={{ pointerEvents: "none" }}
//                       aria-label={`Monthly payment: ${formatNumberToCedis(monthlyPayment, "en-GH")}`}
//                     >
//                       <tspan
//                         x="0"
//                         dy="0"
//                         className="fill-b-accent text-2xl font-extrabold"
//                         style={{ fontSize: "1.4%" }}
//                       >
//                         {formatNumberToCedis(monthlyPayment, "en-GH")}
//                       </tspan>
//                       <tspan
//                         x="0"
//                         dy="0.4"
//                         className="fill-b-accent text-lg font-light"
//                         style={{ fontSize: "0.8%" }}
//                       >
//                         /month
//                       </tspan>
//                     </text>
//                   </DualDoughnut>
//                 </div>
//                 <div className="block md:mt-6">
//                   <p className="text-center text-sm font-light text-inherit">
//                     Monthly Payment
//                   </p>
//                 </div>
//                 <div className="-ml-9 flex md:m-0 md:justify-end">
//                   <div className="mt-2 flex h-full items-start justify-between gap-2 rounded-lg border bg-white p-1 shadow-sm md:mt-3 md:w-fit md:p-3">
//                     <div className="flex gap-2">
//                       <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ff609c] md:mt-2 md:h-2 md:w-2" />
//                       <div>
//                         <p className="text-xs font-normal text-inherit md:text-base">
//                           Principal
//                         </p>
//                         <h4 className="text-[13px] font-semibold leading-8 text-inherit md:mt-2 md:text-base">
//                           {formatNumberToCedis(principalAmount, "en-GH")}
//                         </h4>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#216AFF] md:mt-2 md:h-2 md:w-2" />
//                       <div>
//                         <p className="text-xs font-normal text-inherit md:text-base">
//                           Interest
//                         </p>
//                         <h4 className="text-[13px] font-semibold leading-8 text-inherit md:mt-2 md:text-base">
//                           {formatNumberToCedis(interestAmount, "en-GH")}
//                         </h4>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// function SvgDoughnut({
//   children,
//   percentage = 100,
//   color = "#216bff",
//   secondaryColor = "#d8e5ff",
// }: {
//   children: ReactNode;
//   percentage?: number;
//   color?: string;
//   secondaryColor?: string;
// }) {
//   // Convert percentage to stroke-dasharray value (circumference is 5.65487 = 2 * PI * 0.9)
//   const circumference = 5.65487;
//   const strokeDasharray = (percentage / 100) * circumference;
//   const remainingStroke = circumference - strokeDasharray;

//   return (
//     <svg viewBox="-1 -1 2 2" className="w-full" role="img">
//       <defs>
//         <linearGradient
//           id="grad1"
//           x1="0"
//           y1="0"
//           x2="100%"
//           y2="0"
//           gradientTransform="rotate(90)"
//         >
//           <stop offset="0%" stopColor="rgb(253, 53, 114)"></stop>
//           <stop offset="100%" stopColor="rgb(20, 146, 243)"></stop>
//         </linearGradient>
//       </defs>
//       <circle cx="0" cy="0" r="1" fill="transparent"></circle>
//       <circle
//         cx="0"
//         cy="0"
//         r="0.9"
//         fill="transparent"
//         stroke={secondaryColor}
//         strokeWidth="0.08"
//       ></circle>
//       <circle
//         cx="0"
//         cy="0"
//         r="0.9"
//         fill="transparent"
//         stroke={color}
//         strokeWidth="0.08"
//         strokeDasharray={`${strokeDasharray} ${remainingStroke}`}
//         transform="rotate(-90)"
//       ></circle>
//       {children}
//     </svg>
//   );
// }

// function DualDoughnut({
//   children,
//   firstPercentage = 50,
//   secondPercentage = 50,
//   firstColor = "#ff609c",
//   secondColor = "#216AFF",
// }: {
//   children: ReactNode;
//   firstPercentage?: number;
//   secondPercentage?: number;
//   firstColor?: string;
//   secondColor?: string;
// }) {
//   // Convert percentage to stroke-dasharray value (circumference is 5.65487 = 2 * PI * 0.9)
//   const circumference = 5.65487;
//   const firstStroke = (firstPercentage / 100) * circumference;
//   const secondStroke = (secondPercentage / 100) * circumference;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const remainingStroke = circumference - firstStroke - secondStroke;

//   return (
//     <svg viewBox="-1 -1 2 2" className="w-full" role="img">
//       <circle cx="0" cy="0" r="1" fill="transparent"></circle>
//       <circle
//         cx="0"
//         cy="0"
//         r="0.9"
//         fill="transparent"
//         stroke="#d8e5ff"
//         strokeWidth="0.08"
//       ></circle>
//       <circle
//         cx="0"
//         cy="0"
//         r="0.9"
//         fill="transparent"
//         stroke={firstColor}
//         strokeWidth="0.08"
//         strokeDasharray={`${firstStroke} ${circumference - firstStroke}`}
//         transform="rotate(-90)"
//       ></circle>
//       <circle
//         cx="0"
//         cy="0"
//         r="0.9"
//         fill="transparent"
//         stroke={secondColor}
//         strokeWidth="0.08"
//         strokeDasharray={`${secondStroke} ${circumference - secondStroke}`}
//         transform={`rotate(${(firstPercentage * 360) / 100 - 90})`}
//       ></circle>
//       {children}
//     </svg>
//   );
// }
