export interface Bank {
  name: string;
  code: string;
}

export const NIGERIAN_BANKS: Bank[] = [
  { name: 'Access Bank', code: '044' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'OPay Digital Services', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'Moniepoint Microfinance Bank', code: '50515' },
  { name: 'Kuda Microfinance Bank', code: '50211' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'FCMB (First City Monument Bank)', code: '214' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Wema Bank (ALAT)', code: '035' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Jaiz Bank', code: '301' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Taj Bank', code: '302' },
  { name: 'Rubies Bank', code: '125' },
  { name: 'VFD Microfinance Bank', code: '566' },
];

export function resolveMockAccountName(accountNumber: string, bankName: string, userFullName: string): string {
  if (accountNumber.length !== 10) return '';
  // Provide deterministic realistic bank resolution matching the user or realistic Nigerian names
  if (accountNumber.endsWith('77') || accountNumber.endsWith('12')) {
    return userFullName.toUpperCase();
  }
  const surnames = ['ADEBAYO', 'OKAFOR', 'BALOGUN', 'CHUKWU', 'DANJUMA', 'IBRAHIM', 'EZE', 'OGUNDIPE'];
  const firstnames = ['EMMANUEL', 'CHINONSO', 'FATIMA', 'OLUWASEUN', 'BLESSING', 'MICHAEL', 'AISHA'];
  const num = parseInt(accountNumber.slice(-2), 10) || 5;
  const sIndex = num % surnames.length;
  const fIndex = (num * 3) % firstnames.length;
  return `${surnames[sIndex]} ${firstnames[fIndex]}`;
}
