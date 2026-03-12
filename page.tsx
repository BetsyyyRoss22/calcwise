import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Home, PiggyBank, Landmark, Building2, Receipt, TrendingUp } from "lucide-react";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );

const percent = (n: number) => `${n.toFixed(2)}%`;

function Field({ label, value, onChange, type = "number" }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const P = Number(principal);
    const PMT = Number(monthly);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    const fvPrincipal = P * Math.pow(1 + r, n);
    const fvContrib = r === 0 ? PMT * n : PMT * ((Math.pow(1 + r, n) - 1) / r);
    const total = fvPrincipal + fvContrib;
    const contributed = P + PMT * n;
    return { total, contributed, growth: total - contributed };
  }, [principal, monthly, rate, years]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Compound Interest Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Starting amount" value={principal} onChange={setPrincipal} />
          <Field label="Monthly contribution" value={monthly} onChange={setMonthly} />
          <Field label="Annual return (%)" value={rate} onChange={setRate} />
          <Field label="Years" value={years} onChange={setYears} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Projected value" value={currency(result.total)} />
        <Result label="Total contributed" value={currency(result.contributed)} />
        <Result label="Investment growth" value={currency(result.growth)} />
      </div>
    </div>
  );
}

function MortgageCalc() {
  const [homePrice, setHomePrice] = useState("500000");
  const [down, setDown] = useState("100000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [taxIns, setTaxIns] = useState("500");

  const result = useMemo(() => {
    const loan = Number(homePrice) - Number(down);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    const pAndI = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    return { loan, payment: pAndI + Number(taxIns), pi: pAndI };
  }, [homePrice, down, rate, years, taxIns]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Mortgage Payment Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Home price" value={homePrice} onChange={setHomePrice} />
          <Field label="Down payment" value={down} onChange={setDown} />
          <Field label="Interest rate (%)" value={rate} onChange={setRate} />
          <Field label="Loan term (years)" value={years} onChange={setYears} />
          <Field label="Monthly taxes + insurance" value={taxIns} onChange={setTaxIns} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Loan amount" value={currency(result.loan)} />
        <Result label="Principal + interest" value={currency(result.pi)} />
        <Result label="Estimated total monthly payment" value={currency(result.payment)} />
      </div>
    </div>
  );
}

function RothVsTraditionalCalc() {
  const [contribution, setContribution] = useState("7000");
  const [years, setYears] = useState("25");
  const [returnRate, setReturnRate] = useState("8");
  const [currentTax, setCurrentTax] = useState("24");
  const [retirementTax, setRetirementTax] = useState("18");

  const result = useMemo(() => {
    const c = Number(contribution);
    const y = Number(years);
    const r = Number(returnRate) / 100;
    const fv = c * ((Math.pow(1 + r, y) - 1) / r);
    const roth = fv;
    const tradAfterTax = fv * (1 - Number(retirementTax) / 100);
    const currentDeduction = c * (Number(currentTax) / 100);
    return { roth, tradAfterTax, currentDeduction };
  }, [contribution, years, returnRate, currentTax, retirementTax]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Roth vs Traditional IRA Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Annual contribution" value={contribution} onChange={setContribution} />
          <Field label="Years invested" value={years} onChange={setYears} />
          <Field label="Annual return (%)" value={returnRate} onChange={setReturnRate} />
          <Field label="Current tax rate (%)" value={currentTax} onChange={setCurrentTax} />
          <Field label="Retirement tax rate (%)" value={retirementTax} onChange={setRetirementTax} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Roth estimated after-tax value" value={currency(result.roth)} />
        <Result label="Traditional estimated after-tax value" value={currency(result.tradAfterTax)} />
        <Result label="Current-year tax deduction" value={currency(result.currentDeduction)} />
      </div>
    </div>
  );
}

function RetirementCalc() {
  const [currentAge, setCurrentAge] = useState("31");
  const [retireAge, setRetireAge] = useState("62");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [annualSave, setAnnualSave] = useState("18000");
  const [returnRate, setReturnRate] = useState("8");

  const result = useMemo(() => {
    const years = Number(retireAge) - Number(currentAge);
    const r = Number(returnRate) / 100;
    const fvCurrent = Number(currentSavings) * Math.pow(1 + r, years);
    const fvContrib = Number(annualSave) * ((Math.pow(1 + r, years) - 1) / r);
    const total = fvCurrent + fvContrib;
    return { years, total, monthlyIncome4: total * 0.04 / 12 };
  }, [currentAge, retireAge, currentSavings, annualSave, returnRate]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Retirement Savings Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Current age" value={currentAge} onChange={setCurrentAge} />
          <Field label="Retirement age" value={retireAge} onChange={setRetireAge} />
          <Field label="Current savings" value={currentSavings} onChange={setCurrentSavings} />
          <Field label="Annual savings" value={annualSave} onChange={setAnnualSave} />
          <Field label="Annual return (%)" value={returnRate} onChange={setReturnRate} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Years to invest" value={String(result.years)} />
        <Result label="Projected retirement balance" value={currency(result.total)} />
        <Result label="4% rule monthly income" value={currency(result.monthlyIncome4)} />
      </div>
    </div>
  );
}

function FeeImpactCalc() {
  const [balance, setBalance] = useState("100000");
  const [annualContrib, setAnnualContrib] = useState("12000");
  const [grossReturn, setGrossReturn] = useState("8");
  const [feeA, setFeeA] = useState("0.35");
  const [feeB, setFeeB] = useState("1.35");
  const [years, setYears] = useState("25");

  const result = useMemo(() => {
    const project = (fee: number) => {
      let val = Number(balance);
      for (let i = 0; i < Number(years); i++) {
        val = val * (1 + (Number(grossReturn) - fee) / 100) + Number(annualContrib);
      }
      return val;
    };
    const low = project(Number(feeA));
    const high = project(Number(feeB));
    return { low, high, lost: low - high };
  }, [balance, annualContrib, grossReturn, feeA, feeB, years]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>401(k) Fee Impact Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Current balance" value={balance} onChange={setBalance} />
          <Field label="Annual contribution" value={annualContrib} onChange={setAnnualContrib} />
          <Field label="Gross annual return (%)" value={grossReturn} onChange={setGrossReturn} />
          <Field label="Lower fee (%)" value={feeA} onChange={setFeeA} />
          <Field label="Higher fee (%)" value={feeB} onChange={setFeeB} />
          <Field label="Years" value={years} onChange={setYears} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Value at lower fee" value={currency(result.low)} />
        <Result label="Value at higher fee" value={currency(result.high)} />
        <Result label="Potential dollars lost to higher fees" value={currency(result.lost)} />
      </div>
    </div>
  );
}

function LoanPayoffCalc() {
  const [balance, setBalance] = useState("25000");
  const [rate, setRate] = useState("7");
  const [payment, setPayment] = useState("500");
  const [extra, setExtra] = useState("100");

  const result = useMemo(() => {
    const simulate = (pmt: number) => {
      let b = Number(balance);
      const r = Number(rate) / 100 / 12;
      let months = 0;
      let interest = 0;
      while (b > 0 && months < 1200) {
        const i = b * r;
        interest += i;
        b = b + i - pmt;
        months++;
        if (pmt <= i) break;
      }
      return { months, interest };
    };
    const base = simulate(Number(payment));
    const faster = simulate(Number(payment) + Number(extra));
    return { base, faster, savedMonths: base.months - faster.months, savedInterest: base.interest - faster.interest };
  }, [balance, rate, payment, extra]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Loan Payoff Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Loan balance" value={balance} onChange={setBalance} />
          <Field label="Interest rate (%)" value={rate} onChange={setRate} />
          <Field label="Monthly payment" value={payment} onChange={setPayment} />
          <Field label="Extra monthly payment" value={extra} onChange={setExtra} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Months to payoff" value={`${result.faster.months} months`} />
        <Result label="Months saved" value={`${result.savedMonths} months`} />
        <Result label="Estimated interest saved" value={currency(result.savedInterest)} />
      </div>
    </div>
  );
}

function RMDCalc() {
  const [balance, setBalance] = useState("240000");
  const [factor, setFactor] = useState("26.5");

  const rmd = useMemo(() => Number(balance) / Number(factor || 1), [balance, factor]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>RMD Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Prior year-end IRA balance" value={balance} onChange={setBalance} />
          <Field label="Distribution factor" value={factor} onChange={setFactor} />
          <p className="text-sm text-slate-500">Use the correct IRS Uniform Lifetime Table factor for the account owner’s age.</p>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Estimated RMD" value={currency(rmd)} />
      </div>
    </div>
  );
}

function CapitalGainsCalc() {
  const [salePrice, setSalePrice] = useState("250000");
  const [costBasis, setCostBasis] = useState("150000");
  const [taxRate, setTaxRate] = useState("15");

  const gain = Math.max(0, Number(salePrice) - Number(costBasis));
  const tax = gain * Number(taxRate) / 100;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Capital Gains Tax Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Sale price" value={salePrice} onChange={setSalePrice} />
          <Field label="Cost basis" value={costBasis} onChange={setCostBasis} />
          <Field label="Estimated capital gains tax rate (%)" value={taxRate} onChange={setTaxRate} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Taxable gain" value={currency(gain)} />
        <Result label="Estimated tax owed" value={currency(tax)} />
      </div>
    </div>
  );
}

function RentalROICalc() {
  const [price, setPrice] = useState("350000");
  const [down, setDown] = useState("70000");
  const [rent, setRent] = useState("2600");
  const [expenses, setExpenses] = useState("800");

  const result = useMemo(() => {
    const annualNet = (Number(rent) - Number(expenses)) * 12;
    const capRate = annualNet / Number(price) * 100;
    const coc = annualNet / Number(down) * 100;
    return { annualNet, capRate, coc };
  }, [price, down, rent, expenses]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Rental Property ROI Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Purchase price" value={price} onChange={setPrice} />
          <Field label="Cash invested / down payment" value={down} onChange={setDown} />
          <Field label="Monthly rent" value={rent} onChange={setRent} />
          <Field label="Monthly expenses" value={expenses} onChange={setExpenses} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Annual net cash flow" value={currency(result.annualNet)} />
        <Result label="Cap rate" value={percent(result.capRate)} />
        <Result label="Cash-on-cash return" value={percent(result.coc)} />
      </div>
    </div>
  );
}

function SafeWithdrawalCalc() {
  const [portfolio, setPortfolio] = useState("1000000");
  const [rate, setRate] = useState("4");

  const annual = Number(portfolio) * Number(rate) / 100;
  const monthly = annual / 12;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Safe Withdrawal Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Portfolio size" value={portfolio} onChange={setPortfolio} />
          <Field label="Withdrawal rate (%)" value={rate} onChange={setRate} />
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Result label="Annual withdrawal" value={currency(annual)} />
        <Result label="Monthly withdrawal" value={currency(monthly)} />
      </div>
    </div>
  );
}

const tools = [
  { key: "compound", label: "Compound Interest", icon: TrendingUp, component: <CompoundInterestCalc /> },
  { key: "mortgage", label: "Mortgage", icon: Home, component: <MortgageCalc /> },
  { key: "roth", label: "Roth vs Traditional IRA", icon: PiggyBank, component: <RothVsTraditionalCalc /> },
  { key: "retirement", label: "Retirement Savings", icon: Landmark, component: <RetirementCalc /> },
  { key: "fees", label: "401(k) Fee Impact", icon: Receipt, component: <FeeImpactCalc /> },
  { key: "loan", label: "Loan Payoff", icon: Calculator, component: <LoanPayoffCalc /> },
  { key: "rmd", label: "RMD", icon: Landmark, component: <RMDCalc /> },
  { key: "gains", label: "Capital Gains Tax", icon: Receipt, component: <CapitalGainsCalc /> },
  { key: "rental", label: "Rental ROI", icon: Building2, component: <RentalROICalc /> },
  { key: "withdrawal", label: "Safe Withdrawal", icon: PiggyBank, component: <SafeWithdrawalCalc /> },
];

export default function CalcWiseStarterSite() {
  const [active, setActive] = useState("compound");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border flex items-center justify-center">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">CalcWise</h1>
            <p className="text-slate-600 mt-1">Simple calculators for smarter money decisions.</p>
          </div>
        </div>

        <Card className="rounded-3xl shadow-sm border-0 bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="grid lg:grid-cols-[300px_1fr] gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Top calculators</h2>
                <div className="grid gap-3">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = active === tool.key;
                    return (
                      <button
                        key={tool.key}
                        onClick={() => setActive(tool.key)}
                        className={`text-left rounded-2xl border p-4 transition ${isActive ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tool.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-2xl border p-4 bg-slate-50">
                  <div className="font-semibold">Starter plan</div>
                  <p className="text-sm text-slate-600 mt-2">This gives you a working first version of CalcWise with 10 finance-focused calculators and a clean homepage-style interface.</p>
                </div>
              </div>

              <div>
                {tools.find((t) => t.key === active)?.component}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="text-sm text-slate-500">Fast launch</div>
                      <div className="text-lg font-semibold mt-1">10 calculators live</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="text-sm text-slate-500">Best category fit</div>
                      <div className="text-lg font-semibold mt-1">Finance + retirement</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="text-sm text-slate-500">Next step</div>
                      <div className="text-lg font-semibold mt-1">SEO pages + domain</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
