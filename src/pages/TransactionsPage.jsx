const TransactionsPage = () => {
  const transactions = [
    {
      id: 1,
      type: 'Pembayaran Beasiswa',
      amount: 'Rp 2.500.000',
      date: '15 Mei 2024',
      status: 'Berhasil',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      type: 'Pendaftaran Event',
      amount: 'Rp 50.000',
      date: '10 Mei 2024',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Transaksi</h2>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{transaction.type}</h3>
              <p className="text-gray-600 text-sm">{transaction.date}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-1">{transaction.amount}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${transaction.statusColor}`}>
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsPage
