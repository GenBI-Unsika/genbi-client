import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../services/api.js';
import EmptyState from '../components/EmptyState';
import { formatDateID } from '../utils/formatters';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);

        // NOTE: Endpoint transaksi belum tersedia di backend saat ini.
        const json = await apiFetch('/me/transactions', { method: 'GET' });
        const items = json?.data?.items || json?.data || [];
        if (alive) setTransactions(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status === 404) {
          setTransactions([]);
          return;
        }
        const msg = e?.message || 'Gagal memuat transaksi';
        toast.error(msg);
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
      <h2 className="text-h2 font-bold text-gray-900 mb-6 sm:mb-8">Transaksi</h2>

      <div className="space-y-4">
        {loading ? <div className="text-gray-500">Memuat...</div> : null}
        {!loading && !error && transactions.length === 0 ? <EmptyState icon="files" title="Belum ada transaksi" description="Transaksi Anda akan muncul di sini" variant="primary" /> : null}
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">{transaction.type}</h3>
              <p className="text-gray-600 text-sm">{formatDateID(transaction.date)}</p>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold text-gray-900 mb-1">{transaction.amount}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${transaction.statusColor || 'bg-gray-100 text-gray-800'}`}>{transaction.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
