import React from 'react';

interface DiscountCardProps {
  discount: {
    id: number;
    name: string;
    type: 'percentage' | 'amount';
    value: number;
  };
}

const DiscountCard: React.FC<DiscountCardProps> = ({ discount }) => {
  return (
    <div className="discount-card bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-2">{discount.name}</h3>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Type:</span>
        <span className="font-medium capitalize">{discount.type}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Value:</span>
        <span className="font-semibold">
          {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} dz`}
        </span>
      </div>
    </div>
  );
};

export default DiscountCard;
