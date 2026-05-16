import { useState } from 'preact/hooks';

interface Result {
  monthly: number;
  totalPayment: number;
  totalInterest: number;
  schedule: Array<{ month: number; payment: number; principal: number; interest: number; balance: number }>;
}

export default function MortgageCalculator() {
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
          <label class="block text-sm text-gray-500 mb-1">贷款金额 (元)</label>
          <input type="number" value={amount} onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value))}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">年利率 (%)</label>
          <input type="number" value={rate} onInput={(e) => setRate(Number((e.target as HTMLInputElement).value))} step="0.01"
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">贷款年限</label>
          <select value={years} onChange={(e) => setYears(Number((e.target as HTMLSelectElement).value))}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm">
            <option value={10}>10 年</option>
            <option value={20}>20 年</option>
            <option value={30}>30 年</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">还款方式</label>
          <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value as any)}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm">
            <option value="equal-payment">等额本息</option>
            <option value="equal-principal">等额本金</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} class="px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">计算</button>

      {result && (
        <div class="space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">月供</div>
              <div class="text-xl font-bold text-zen-600">{formatMoney(result.monthly)}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">还款总额</div>
              <div class="text-xl font-bold text-zen-600">{formatMoney(result.totalPayment)}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">利息总额</div>
              <div class="text-xl font-bold text-zen-600">{formatMoney(result.totalInterest)}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">还款月数</div>
              <div class="text-xl font-bold text-zen-600">{years * 12}</div>
            </div>
          </div>

          <details class="border border-gray-200 rounded-lg">
            <summary class="p-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">查看还款明细表</summary>
            <div class="max-h-80 overflow-y-auto">
              <table class="w-full text-xs">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="p-2 text-left">期数</th>
                    <th class="p-2 text-right">月供</th>
                    <th class="p-2 text-right">本金</th>
                    <th class="p-2 text-right">利息</th>
                    <th class="p-2 text-right">剩余本金</th>
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
