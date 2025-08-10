import { PriceData, ServiceData } from '@/types';
import React from 'react';


interface ServiceCardProps {
  service: ServiceData
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="service-card bg-white rounded-lg shadow-md overflow-hidden">
        <div className="service-images mb-4">
          {service.Images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Service Image ${index}`}
              className="w-full aspect-video object-cover rounded-lg"
            />
          ))}
        </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-700 mb-4">{service.description}</p>
        <div className="service-prices">
          <h4 className="text-lg font-medium mb-2">Prices</h4>
          {service.metadata.prices.map((price, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span className="text-gray-600">{price.type}:</span>
              <span className="font-semibold">{price.price} dz</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
