import React from 'react';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  activeCategory: 'hollywood' | 'bollywood' | 'webseries';
  onCategoryChange: (category: 'hollywood' | 'bollywood' | 'webseries') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onCategoryChange('hollywood')}
        className={`relative px-4 py-2 text-sm font-medium transition-colors ${
          activeCategory === 'hollywood' ? 'text-white' : 'text-gray-400'
        }`}
      >
        {activeCategory === 'hollywood' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-red-600 rounded-lg -z-10"
          />
        )}
        Hollywood
      </button>
      <button
        onClick={() => onCategoryChange('bollywood')}
        className={`relative px-4 py-2 text-sm font-medium transition-colors ${
          activeCategory === 'bollywood' ? 'text-white' : 'text-gray-400'
        }`}
      >
        {activeCategory === 'bollywood' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-red-600 rounded-lg -z-10"
          />
        )}
        Bollywood
      </button>
      <button
        onClick={() => onCategoryChange('webseries')}
        className={`relative px-4 py-2 text-sm font-medium transition-colors ${
          activeCategory === 'webseries' ? 'text-white' : 'text-gray-400'
        }`}
      >
        {activeCategory === 'webseries' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-red-600 rounded-lg -z-10"
          />
        )}
        Web Series
      </button>
    </div>
  );
};