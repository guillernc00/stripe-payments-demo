import { useNavigate } from 'react-router-dom';

const flows = [
  {
    path: '/tokenize',
    title: 'Tokenize a Card',
    description: 'Create a payment method token from card details',
    icon: '💳',
  },
  {
    path: '/purchase',
    title: 'Create a Purchase',
    description: 'Select products and complete checkout',
    icon: '🛒',
  },
  {
    path: '/view-cards',
    title: 'View Saved Cards',
    description: 'Manage your saved payment methods',
    icon: '👛',
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stripe Payments Demo
        </h1>
        <p className="text-gray-500">
          Choose an integration flow to explore
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {flows.map(flow => (
          <div
            key={flow.path}
            onClick={() => navigate(flow.path)}
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:border-indigo-400 hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              {flow.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                {flow.title}
              </h2>
              <p className="text-sm text-gray-500">{flow.description}</p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;