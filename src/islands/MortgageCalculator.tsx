import { useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

interface Result {
  monthly: number;
  totalPayment: number;
  totalInterest: number;
  schedule: Array<{ month: number; payment: number; principal: number; interest: number; balance: number }>;
}

export default function MortgageCalculator() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(4.2);
  const [years, setYears] = useState(30);
  const [type, setType] = useState<'equal-payment' | 'equal-principal'>('equal-payment');
  const [result, setResult] = useState<Result | null>(null);

  const calculate = () => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let schedule: Result['schedule'] = [];
    let totalPayment = 0;
    let totalInterest = 0;
    let monthly = 0;

    if (type === 'equal-payment') {
      monthly = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      let balance = amount;
      for (let i = 1; i <= months; i++) {
        const interest = balance * monthlyRate;
        const principal = monthly - interest;
        balance -= principal;
        schedule.push({ month: i, payment: monthly, principal, interest, balance: Math.max(0, balance) });
      }
      totalPayment = monthly * months;
    } else {
      const monthlyPrincipal = amount / months;
      let balance = amount;
      for (let i = 1; i <= months; i++) {
        const interest = balance * monthlyRate;
        const payment = monthlyPrincipal + interest;
        balance -= monthlyPrincipal;
        schedule.push({ month: i, payment, principal: monthlyPrincipal, interest, balance: Math.max(0, balance) });
        totalPayment += payment;
      }
      monthly = schedule[0]?.payment || 0;
    }
    totalInterest = totalPayment - amount;
    setResult({ monthly, totalPayment, totalInterest, schedule });
  };

  const formatMoney = (n: number) => '￥' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-500 mb-1">{t.ui.loanAmount}</label>
          <input type="number" value={amount} onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value))}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">{t.ui.annualRate}</label>
          <input type="number" value={rate} onInput={(e) => setRate(Number((e.target as HTMLInputElement).value))} step="0.01"
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">{t.ui.loanYears}</label>
          <input type="number" value={years} onInput={(e) => setYears(Number((e.target as HTMLInputElement).value) || 30)}
            min="1" max="50"
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">{t.ui.repaymentMethod}</label>
          <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value as any)}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm">
            <option value="equal-payment">{t.ui.equalPayment}</option>
            <option value="equal-principal">{t.ui.equalPrincipal}</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} class="px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">{t.ui.calculate}</button>

      {result && (
        <div class="space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">{t.ui.monthlyPayment}</div>
              <div class="text-xl font-bold text-zen-600">{formatMoney(result.monthly)}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">{t.ui.totalPayment}</div>
              <div class="text-xl font-bold text-zen-600">{formatMoney(result.totalPayment)}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">{t.ui.totalInterest}</div>
              <div class="text-xl font-bold text-zen-600">{formatMoney(result.totalInterest)}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">{t.ui.totalMonths}</div>
              <div class="text-xl font-bold text-zen-600">{years * 12}</div>
            </div>
          </div>

          <details class="border border-gray-200 rounded-lg">
            <summary class="p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">{t.ui.viewSchedule}</summary>
            <div class="max-h-80 overflow-y-auto">
              <table class="w-full text-xs">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="p-2 text-left">{t.ui.period}</th>
                    <th class="p-2 text-right">{t.ui.monthlyPayment}</th>
                    <th class="p-2 text-right">{t.ui.principal}</th>
                    <th class="p-2 text-right">{t.ui.interest}</th>
                    <th class="p-2 text-right">{t.ui.balance}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, 360).map(row => (
                    <tr class="border-t border-gray-100 hover:bg-gray-50">
                      <td class="p-2">{row.month}</td>
                      <td class="p-2 text-right">{formatMoney(row.payment)}</td>
                      <td class="p-2 text-right">{formatMoney(row.principal)}</td>
                      <td class="p-2 text-right">{formatMoney(row.interest)}</td>
                      <td class="p-2 text-right">{formatMoney(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
