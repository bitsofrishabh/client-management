import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Star } from 'lucide-react';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Whey Protein Powder',
      description: 'High-quality whey protein isolate with 25g protein per serving. Perfect for muscle building and recovery.',
      category: 'supplements',
      price: '$49.99',
      imageUrl: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/whey-protein'
    },
    {
      id: '2',
      name: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbells with quick-change weight system. 5-50 lbs per dumbbell.',
      category: 'equipment',
      price: '$299.99',
      imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/dumbbells'
    },
    {
      id: '3',
      name: 'Yoga Mat Premium',
      description: 'Non-slip yoga mat with superior grip and cushioning. Eco-friendly materials, 6mm thickness.',
      category: 'equipment',
      price: '$39.99',
      imageUrl: 'https://images.pexels.com/photos/4327049/pexels-photo-4327049.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/yoga-mat'
    },
    {
      id: '4',
      name: 'Moisture-Wicking Athletic Wear',
      description: 'High-performance athletic clothing designed for maximum comfort during intense workouts.',
      category: 'apparel',
      price: '$79.99',
      imageUrl: 'https://images.pexels.com/photos/8032766/pexels-photo-8032766.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/athletic-wear'
    },
    {
      id: '5',
      name: 'Creatine Monohydrate',
      description: 'Pure creatine monohydrate for increased strength, power, and muscle mass. Unflavored powder.',
      category: 'supplements',
      price: '$24.99',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/creatine'
    },
    {
      id: '6',
      name: 'Resistance Bands Set',
      description: 'Complete resistance training kit with 5 bands of varying resistance levels and door anchor.',
      category: 'equipment',
      price: '$34.99',
      imageUrl: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/resistance-bands'
    },
    {
      id: '7',
      name: 'Fitness Tracker Watch',
      description: 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking capabilities.',
      category: 'accessories',
      price: '$199.99',
      imageUrl: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/fitness-tracker'
    },
    {
      id: '8',
      name: 'Pre-Workout Energy Blend',
      description: 'Natural pre-workout supplement with caffeine, beta-alanine, and BCAAs for enhanced performance.',
      category: 'supplements',
      price: '$34.99',
      imageUrl: 'https://images.pexels.com/photos/7772681/pexels-photo-7772681.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/pre-workout'
    },
    {
      id: '9',
      name: 'Compression Leggings',
      description: 'High-waisted compression leggings with moisture-wicking fabric and phone pocket.',
      category: 'apparel',
      price: '$59.99',
      imageUrl: 'https://images.pexels.com/photos/8032849/pexels-photo-8032849.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/leggings'
    },
    {
      id: '10',
      name: 'Foam Roller',
      description: 'High-density foam roller for muscle recovery and myofascial release. Perfect for post-workout recovery.',
      category: 'accessories',
      price: '$29.99',
      imageUrl: 'https://images.pexels.com/photos/6111619/pexels-photo-6111619.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/foam-roller'
    },
    {
      id: '11',
      name: 'Kettlebell Set',
      description: 'Cast iron kettlebells in multiple weights (15lb, 25lb, 35lb) with wide handles for comfort.',
      category: 'equipment',
      price: '$189.99',
      imageUrl: 'https://images.pexels.com/photos/6456037/pexels-photo-6456037.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/kettlebells'
    },
    {
      id: '12',
      name: 'Wireless Bluetooth Headphones',
      description: 'Sweat-resistant wireless headphones with superior sound quality and 8-hour battery life.',
      category: 'accessories',
      price: '$79.99',
      imageUrl: 'https://images.pexels.com/photos/3945681/pexels-photo-3945681.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://example.com/headphones'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'supplements', label: 'Supplements' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'apparel', label: 'Apparel' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supplements': return '💊';
      case 'equipment': return '🏋️';
      case 'apparel': return '👕';
      case 'accessories': return '⌚';
      default: return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Product Recommendations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of high-quality fitness products to support your health and wellness journey
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white min-w-[200px]"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {getCategoryIcon(product.category)} {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium">4.8</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  <a
                    href={product.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow duration-200 text-sm font-medium"
                  >
                    <span>Buy Now</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more results.
            </p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-emerald-50 p-8 rounded-2xl"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why We Recommend These Products
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our fitness experts have carefully curated this selection based on quality, value, and effectiveness. 
              Each product has been tested and vetted to ensure it meets our high standards for helping you achieve your fitness goals.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsPage;