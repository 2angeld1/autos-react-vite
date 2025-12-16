import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Clock,
  Car,
  Eye,
  Copy,
  Zap
} from 'lucide-react';
import Button from '@/components/common/Button';

// Mock data for promotions
const mockPromotions = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    code: 'SUMMER24',
    type: 'percentage',
    value: 15,
    minPurchase: 25000,
    maxDiscount: 5000,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    usageLimit: 100,
    usedCount: 45,
    status: 'active',
    applicableTo: 'All Cars',
    description: 'Summer special discount on all vehicles'
  },
  {
    id: '2',
    name: 'New Customer Bonus',
    code: 'NEWCAR500',
    type: 'fixed',
    value: 500,
    minPurchase: 15000,
    maxDiscount: 500,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageLimit: 500,
    usedCount: 234,
    status: 'active',
    applicableTo: 'New Customers',
    description: 'Welcome bonus for first-time buyers'
  },
  {
    id: '3',
    name: 'Electric Vehicle Incentive',
    code: 'GOGREEN',
    type: 'percentage',
    value: 10,
    minPurchase: 30000,
    maxDiscount: 4000,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    usageLimit: 200,
    usedCount: 89,
    status: 'active',
    applicableTo: 'Electric Vehicles',
    description: 'Special discount for eco-friendly choices'
  },
  {
    id: '4',
    name: 'Black Friday Special',
    code: 'BLACKFRI',
    type: 'percentage',
    value: 20,
    minPurchase: 20000,
    maxDiscount: 8000,
    startDate: '2024-11-25',
    endDate: '2024-11-30',
    usageLimit: 50,
    usedCount: 50,
    status: 'expired',
    applicableTo: 'All Cars',
    description: 'Limited time Black Friday offer'
  },
  {
    id: '5',
    name: 'Holiday Season Bundle',
    code: 'HOLIDAY23',
    type: 'fixed',
    value: 1000,
    minPurchase: 35000,
    maxDiscount: 1000,
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    usageLimit: 75,
    usedCount: 68,
    status: 'expired',
    applicableTo: 'Premium Cars',
    description: 'Holiday special with accessories bundle'
  },
  {
    id: '6',
    name: 'Trade-In Bonus',
    code: 'TRADEIN',
    type: 'percentage',
    value: 5,
    minPurchase: 0,
    maxDiscount: 2000,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    usageLimit: 0,
    usedCount: 156,
    status: 'scheduled',
    applicableTo: 'Trade-In Customers',
    description: 'Extra discount when trading in your old car'
  },
];

const statusConfig = {
  active: { color: 'bg-green-100 text-green-700', label: 'Active' },
  expired: { color: 'bg-gray-100 text-gray-600', label: 'Expired' },
  scheduled: { color: 'bg-blue-100 text-blue-700', label: 'Scheduled' },
  paused: { color: 'bg-amber-100 text-amber-700', label: 'Paused' },
};

const Promotions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPromotions = mockPromotions.filter(promo => {
    const matchesSearch = 
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockPromotions.filter(p => p.status === 'active').length;
  const totalUsed = mockPromotions.reduce((sum, p) => sum + p.usedCount, 0);
  const totalSavings = mockPromotions.reduce((sum, p) => {
    const avgDiscount = p.type === 'percentage' ? (p.maxDiscount / 2) : p.value;
    return sum + (avgDiscount * p.usedCount);
  }, 0);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
                <Percent className="h-7 w-7" />
              </div>
              Promotions
            </h1>
            <p className="text-gray-500 mt-1">Manage discount codes and special offers</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Promotions</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{mockPromotions.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Redemptions</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsed}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customer Savings</p>
              <p className="text-2xl font-bold text-gray-900">${(totalSavings / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search promotions or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'scheduled', 'expired'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPromotions.map(promo => {
          const statusStyle = statusConfig[promo.status as keyof typeof statusConfig];
          const usagePercent = promo.usageLimit > 0 ? (promo.usedCount / promo.usageLimit) * 100 : 0;

          return (
            <div
              key={promo.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      promo.type === 'percentage' 
                        ? 'bg-gradient-to-br from-orange-100 to-orange-200' 
                        : 'bg-gradient-to-br from-green-100 to-green-200'
                    }`}>
                      {promo.type === 'percentage' 
                        ? <Percent className="h-6 w-6 text-orange-600" />
                        : <DollarSign className="h-6 w-6 text-green-600" />
                      }
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{promo.name}</h3>
                      <p className="text-sm text-gray-500">{promo.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.color}`}>
                    {statusStyle.label}
                  </span>
                </div>
              </div>

              {/* Code & Value */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Promo Code</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-900 text-white px-4 py-2 rounded-lg font-mono text-lg">
                        {promo.code}
                      </code>
                      <button 
                        onClick={() => copyCode(promo.code)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy code"
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Discount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{promo.startDate} - {promo.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-4 w-4" />
                    <span>{promo.applicableTo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Min: ${promo.minPurchase.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="h-4 w-4" />
                    <span>Max: ${promo.maxDiscount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Usage Progress */}
                {promo.usageLimit > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Usage</span>
                      <span className="font-medium text-gray-900">
                        {promo.usedCount} / {promo.usageLimit}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          usagePercent >= 90 ? 'bg-red-500' : 
                          usagePercent >= 70 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {promo.usageLimit === 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Unlimited usage • {promo.usedCount} redeemed</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" icon={<Eye className="h-4 w-4" />}>
                  View
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" icon={<Edit2 className="h-4 w-4" />}>
                  Edit
                </Button>
                {promo.status === 'active' ? (
                  <Button variant="ghost" size="sm" icon={<ToggleRight className="h-4 w-4 text-green-600" />}>
                    Pause
                  </Button>
                ) : promo.status !== 'expired' && (
                  <Button variant="ghost" size="sm" icon={<ToggleLeft className="h-4 w-4 text-gray-400" />}>
                    Enable
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" icon={<Trash2 className="h-4 w-4" />}>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <Percent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No promotions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Promotions;
