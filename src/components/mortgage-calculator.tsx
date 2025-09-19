"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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

  // Calculate loan percentage for charts
  const loanPercent = useMemo(() => {
    return propertyPrice > 0
      ? Math.min(100, Math.max(0, (breakdown.loanAmount / propertyPrice) * 100))
      : 0;
  }, [propertyPrice, breakdown.loanAmount]);

  // Debounced values for smooth animations
  const [debouncedBreakdown, setDebouncedBreakdown] = useState(breakdown);
  const [debouncedLoanPercent, setDebouncedLoanPercent] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce chart updates for smooth animations
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedBreakdown(breakdown);
      setDebouncedLoanPercent(loanPercent);
    }, 100);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [breakdown, loanPercent]);

  // Check if we have valid data to show charts
  const hasValidData = propertyPrice > 0 && breakdown.loanAmount > 0;

  // State for breakdown section visibility
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handlePropertyPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

  // Memoized format function for performance
  const formatCurrencyMemo = useCallback((value: number): string => {
    if (!Number.isFinite(value) || value < 0) return "GH₵0";
    return `GH₵${Math.round(value).toLocaleString()}`;
  }, []);
  const circumference = 264; // ~ 2 * Math.PI * r, with r=42
  const downPaymentPercent = useMemo(() => {
    return propertyPrice > 0
      ? Math.min(100, Math.max(0, (downPayment / propertyPrice) * 100))
      : 0;
  }, [downPayment, propertyPrice]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      {/* Left Column - Inputs */}
      <Card className="rounded-lg p-4">
        <CardContent className="px-3 pt-0">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyPrice" className="text-brand-accent">
                  Property Price
                </Label>
                <div className="flex">
                  <span className="text-brand-muted inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3">
                    GH₵
                  </span>
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={propertyPrice || ""}
                    onChange={handlePropertyPriceChange}
                    min={0}
                    className="text-brand-accent rounded-l-none"
                    placeholder="Enter property price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPayment" className="text-brand-accent">
                  Down Payment
                </Label>
                <div className="flex">
                  <span className="text-brand-muted inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3">
                    GH₵
                  </span>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment || ""}
                    onChange={handleDownPaymentChange}
                    min={0}
                    className="text-brand-accent rounded-l-none"
                    placeholder="Enter down payment"
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
                      className="text-brand-accent mr-2 h-8 w-20"
                      min={1}
                      max={30}
                    />
                    <span className="text-brand-muted rounded-md bg-gray-100 px-3 py-1 text-sm">
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
                      className="text-brand-accent mr-2 h-8 w-20"
                      min={0}
                      max={30}
                      step={0.1}
                    />
                    <span className="text-brand-muted rounded-md bg-gray-100 px-3 py-1 text-sm">
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

            <div className="mt-4 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <p className="text-brand-muted text-xs md:text-sm">
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
      <Card className="rounded-lg">
        <CardContent className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-brand-accent text-xl font-semibold">
              Mortgage Breakdown
            </h2>
            <span className="text-brand-muted text-sm">
              at {interestRate.toFixed(1)}% interest rate
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Loan Amount Chart */}
            <div className="flex flex-col items-center">
              <div className="circle-chart relative mb-4 h-40 w-40 sm:h-44 sm:w-44 lg:h-48 lg:w-48 xl:h-52 xl:w-52">
                {hasValidData ? (
                  <>
                    <svg
                      viewBox="0 0 100 100"
                      className="h-full w-full transition-all duration-300"
                    >
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                      />
                      {/* Loan amount arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--brand-blue))"
                        strokeWidth="6"
                        strokeDasharray={`${(debouncedLoanPercent / 100) * circumference} ${circumference}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-500 ease-in-out"
                        style={{
                          filter:
                            "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.1))",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                      <div className="text-brand-accent overflow-hidden text-sm leading-tight font-bold sm:text-base">
                        <div className="max-w-full truncate">
                          {formatCurrencyMemo(debouncedBreakdown.loanAmount)}
                        </div>
                      </div>
                      <div className="text-brand-muted mt-0.5 text-center text-xs">
                        Loan Amount
                      </div>
                      <div className="text-brand-blue text-xs font-medium">
                        {debouncedLoanPercent.toFixed(0)}%
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                    <span className="text-sm text-gray-400">Enter values</span>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Payment Chart */}
            <div className="flex flex-col items-center">
              <div className="circle-chart relative mb-4 h-40 w-40 sm:h-44 sm:w-44 lg:h-48 lg:w-48 xl:h-52 xl:w-52">
                {hasValidData && debouncedBreakdown.monthlyPayment > 0 ? (
                  <>
                    <svg
                      viewBox="0 0 100 100"
                      className="h-full w-full transition-all duration-500"
                    >
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                      />
                      {/* Monthly payment arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--brand-blue))"
                        strokeWidth="6"
                        strokeDasharray={`${((debouncedBreakdown.monthlyPayment > 0 ? 100 : 0) / 100) * circumference} ${circumference}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-500 ease-in-out"
                        style={{
                          filter:
                            "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.1))",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                      <div className="text-brand-accent overflow-hidden text-sm leading-tight font-bold sm:text-base">
                        <div className="max-w-full truncate">
                          {formatCurrencyMemo(
                            debouncedBreakdown.monthlyPayment
                          )}
                        </div>
                      </div>
                      <div className="text-brand-muted mt-0.5 text-center text-xs">
                        Monthly Payment
                      </div>
                      <div className="text-brand-blue text-xs font-medium">
                        /month
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                    <span className="text-sm text-gray-400">Enter values</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-8 space-y-6">
            {/* Down Payment Info */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-brand-accent text-sm font-medium">
                    Down Payment
                  </span>
                  <div className="text-brand-muted text-xs">
                    {downPaymentPercent.toFixed(0)}% of property price
                  </div>
                </div>
                <span className="text-brand-accent text-lg font-bold">
                  {formatCurrencyMemo(downPayment)}
                </span>
              </div>
            </div>

            {/* Toggle Breakdown Button */}
            {hasValidData && debouncedBreakdown.monthlyPayment > 0 && (
              <div className="pt-4">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="from-brand-blue/10 to-brand-blue/5 hover:from-brand-blue/20 hover:to-brand-blue/10 border-brand-blue/20 group w-full cursor-pointer rounded-lg border bg-gradient-to-r p-3 shadow-none transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-blue h-2 w-2 rounded-full"></div>
                      <span className="text-brand-accent font-medium">
                        {showBreakdown ? "Hide" : "View"} Payment Breakdown
                      </span>
                    </div>
                    <div
                      className={`transition-transform duration-200 ${
                        showBreakdown ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="text-brand-blue h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Collapsible Monthly Payment Breakdown */}
            {hasValidData &&
              debouncedBreakdown.monthlyPayment > 0 &&
              showBreakdown && (
                <div className="animate-in fade-in mt-6 duration-300">
                  <div>
                    <h3 className="text-brand-accent mb-4 text-base font-semibold">
                      Monthly Payment Breakdown
                    </h3>
                    <div className="space-y-4">
                      {/* Principal */}
                      <div className="rounded-lg border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 transition-all duration-300 hover:from-emerald-100 hover:to-emerald-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg">
                              <div className="h-2 w-2 rounded-full bg-white opacity-80"></div>
                            </div>
                            <div>
                              <span className="font-semibold text-emerald-700">
                                Principal Payment
                              </span>
                              <div className="mt-0.5 text-xs text-emerald-600/80">
                                {debouncedBreakdown.monthlyPayment > 0
                                  ? (
                                      (debouncedBreakdown.principalPayment /
                                        debouncedBreakdown.monthlyPayment) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                % of your monthly payment
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-emerald-700">
                              {formatCurrencyMemo(
                                debouncedBreakdown.principalPayment
                              )}
                            </span>
                            <div className="mt-0.5 text-xs text-emerald-600/70">
                              goes to equity
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interest */}
                      <div className="rounded-lg border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 transition-all duration-300 hover:from-amber-100 hover:to-amber-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg">
                              <div className="h-2 w-2 rounded-full bg-white opacity-80"></div>
                            </div>
                            <div>
                              <span className="font-semibold text-amber-700">
                                Interest Payment
                              </span>
                              <div className="mt-0.5 text-xs text-amber-600/80">
                                {debouncedBreakdown.monthlyPayment > 0
                                  ? (
                                      (debouncedBreakdown.interestPayment /
                                        debouncedBreakdown.monthlyPayment) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                % of your monthly payment
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-amber-700">
                              {formatCurrencyMemo(
                                debouncedBreakdown.interestPayment
                              )}
                            </span>
                            <div className="mt-0.5 text-xs text-amber-600/70">
                              cost of borrowing
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="mt-6 rounded-lg border border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-100/50 p-5 transition-all duration-300 hover:from-slate-100 hover:to-slate-200/50">
                      <h4 className="mb-3 flex items-center font-semibold text-slate-700">
                        <div className="mr-2 h-2 w-2 rounded-full bg-slate-400"></div>
                        Loan Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">
                            Total paid over {tenure} years
                          </span>
                          <span className="text-lg font-bold text-slate-700">
                            {formatCurrencyMemo(
                              debouncedBreakdown.monthlyPayment * tenure * 12
                            )}
                          </span>
                        </div>
                        <div className="h-px bg-slate-200"></div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Total interest cost
                          </span>
                          <span className="text-base font-semibold text-amber-600">
                            {formatCurrencyMemo(
                              debouncedBreakdown.monthlyPayment * tenure * 12 -
                                debouncedBreakdown.loanAmount
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-slate-500">
                            Interest as % of total
                          </span>
                          <span className="text-xs font-medium text-amber-600">
                            {debouncedBreakdown.monthlyPayment > 0
                              ? (
                                  ((debouncedBreakdown.monthlyPayment *
                                    tenure *
                                    12 -
                                    debouncedBreakdown.loanAmount) /
                                    (debouncedBreakdown.monthlyPayment *
                                      tenure *
                                      12)) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
