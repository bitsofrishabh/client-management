import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Star } from 'lucide-react';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Updated product data with your specific products
  const products: Product[] = [
    // Green Tea
    {
      id: '1',
      name: 'Organic India Green Tea',
      description: 'Premium organic green tea with natural antioxidants for metabolism boost and overall wellness.',
      category: 'green-tea',
      price: '₹299',
      imageUrl: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/3FrpiFa'
    },
    {
      id: '2',
      name: 'Chamomile Tea',
      description: 'Soothing chamomile tea for relaxation and better sleep quality.',
      category: 'green-tea',
      price: '₹249',
      imageUrl: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4mAOz0f'
    },
    {
      id: '3',
      name: 'Blue Tea: SpearMint',
      description: 'Refreshing blue tea with spearmint for a unique and healthy beverage experience.',
      category: 'green-tea',
      price: '₹399',
      imageUrl: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/43ixKzD'
    },
    {
      id: '4',
      name: 'Flurys Tulsi',
      description: 'Traditional tulsi tea for immunity boost and stress relief.',
      category: 'green-tea',
      price: '₹199',
      imageUrl: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4joY1RA'
    },

    // Apple Cider Vinegar
    {
      id: '5',
      name: 'WOW Life Apple Cider Vinegar',
      description: 'Raw, unfiltered apple cider vinegar with mother for weight management and digestion.',
      category: 'apple-cider-vinegar',
      price: '₹449',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/1og3eCX'
    },
    {
      id: '6',
      name: 'Kapiva Himalayan Apple Cider Vinegar',
      description: 'Himalayan apple cider vinegar with natural ingredients for health benefits.',
      category: 'apple-cider-vinegar',
      price: '₹399',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/3BFiGXi'
    },
    {
      id: '7',
      name: 'The Plant Fix Plix ACV Tablet',
      description: 'Convenient apple cider vinegar tablets for easy consumption and portability.',
      category: 'apple-cider-vinegar',
      price: '₹599',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4dW7ejn'
    },
    {
      id: '8',
      name: 'HealthKart ACV Tablet',
      description: 'High-quality apple cider vinegar tablets for weight management support.',
      category: 'apple-cider-vinegar',
      price: '₹549',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4kiLqAJ'
    },
    {
      id: '9',
      name: 'Open Secret ACV Tablet',
      description: 'Natural apple cider vinegar tablets with added benefits for metabolism.',
      category: 'apple-cider-vinegar',
      price: '₹499',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4dyMKN4'
    },
    {
      id: '10',
      name: 'Tata 1mg ACV',
      description: 'Trusted brand apple cider vinegar for daily health and wellness routine.',
      category: 'apple-cider-vinegar',
      price: '₹349',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4kgeZ5V'
    },

    // Seeds/Mix Seeds/Dry Fruits
    {
      id: '11',
      name: 'Farmley Edible Seeds Combo',
      description: 'Premium mix of edible seeds packed with nutrients and healthy fats.',
      category: 'seeds-dry-fruits',
      price: '₹799',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4jp1yzh'
    },
    {
      id: '12',
      name: 'True Elements 7 in 1 Seeds Mix',
      description: 'Nutritious blend of seven different seeds for complete nutrition.',
      category: 'seeds-dry-fruits',
      price: '₹649',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/9sCA51p'
    },
    {
      id: '13',
      name: 'GreenFinity 950 gram Raw Seed Combo',
      description: 'Large pack of raw seeds combo for extended healthy snacking.',
      category: 'seeds-dry-fruits',
      price: '₹1299',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4kr7Xes'
    },
    {
      id: '14',
      name: 'Tata Sampann Protein 7-in-1 Seed',
      description: 'High-protein seed mix from trusted Tata brand for daily nutrition.',
      category: 'seeds-dry-fruits',
      price: '₹549',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/cdsHElg'
    },
    {
      id: '15',
      name: 'Farmley Seeds Mix',
      description: 'Quality seeds mix for healthy snacking and nutrition boost.',
      category: 'seeds-dry-fruits',
      price: '₹699',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/6J1orX8'
    },
    {
      id: '16',
      name: 'True Elements Edible Seeds Combo',
      description: 'Premium edible seeds combination for optimal health benefits.',
      category: 'seeds-dry-fruits',
      price: '₹749',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/45tbuEu'
    },
    {
      id: '17',
      name: 'Sunflower Seeds',
      description: 'Raw sunflower seeds rich in vitamin E and healthy fats.',
      category: 'seeds-dry-fruits',
      price: '₹299',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/2y0KaYw'
    },
    {
      id: '18',
      name: 'Chia Seeds',
      description: 'Superfood chia seeds packed with omega-3 fatty acids and fiber.',
      category: 'seeds-dry-fruits',
      price: '₹399',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/8fMHTGt'
    },
    {
      id: '19',
      name: 'Pumpkin Seeds',
      description: 'Nutritious pumpkin seeds for protein and mineral supplementation.',
      category: 'seeds-dry-fruits',
      price: '₹449',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/by7nB6v'
    },
    {
      id: '20',
      name: 'Flax Seeds',
      description: 'High-fiber flax seeds for digestive health and omega-3 benefits.',
      category: 'seeds-dry-fruits',
      price: '₹249',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/ctIk846'
    },
    {
      id: '21',
      name: 'White Sesame Seeds',
      description: 'Premium white sesame seeds for calcium and healthy fats.',
      category: 'seeds-dry-fruits',
      price: '₹199',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4jufKXP'
    },
    {
      id: '22',
      name: 'Halim Seeds',
      description: 'Nutrient-dense halim seeds for iron and protein supplementation.',
      category: 'seeds-dry-fruits',
      price: '₹349',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/g2DFrie'
    },

    // Dry Fruits - Brazil Nuts
    {
      id: '23',
      name: 'Yoga bar Brazil Nuts',
      description: 'Premium Brazil nuts rich in selenium and healthy fats.',
      category: 'seeds-dry-fruits',
      price: '₹899',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/3FfFEAG'
    },
    {
      id: '24',
      name: 'Happilo Brazil Nuts',
      description: 'High-quality Brazil nuts for selenium and antioxidant benefits.',
      category: 'seeds-dry-fruits',
      price: '₹799',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4dC9yM1'
    },
    {
      id: '25',
      name: 'Jumbo Brazil Nuts',
      description: 'Large-sized Brazil nuts for maximum nutritional benefits.',
      category: 'seeds-dry-fruits',
      price: '₹999',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4mGGfw4'
    },

    // Almonds and Walnuts
    {
      id: '26',
      name: 'Happilo Almonds',
      description: 'Premium California almonds for protein and vitamin E.',
      category: 'seeds-dry-fruits',
      price: '₹649',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/cRRBooR'
    },
    {
      id: '27',
      name: 'Tata Almonds',
      description: 'Quality almonds from trusted Tata brand for daily nutrition.',
      category: 'seeds-dry-fruits',
      price: '₹599',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/6ow16jg'
    },
    {
      id: '28',
      name: 'Farmley Almonds',
      description: 'Fresh and crunchy almonds for healthy snacking.',
      category: 'seeds-dry-fruits',
      price: '₹699',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/eoqq3i2'
    },
    {
      id: '29',
      name: 'True Elements Almonds',
      description: 'Natural almonds without any artificial additives.',
      category: 'seeds-dry-fruits',
      price: '₹749',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/8TxH7Jg'
    },
    {
      id: '30',
      name: 'True Element Walnuts',
      description: 'Brain-healthy walnuts rich in omega-3 fatty acids.',
      category: 'seeds-dry-fruits',
      price: '₹849',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4jl0DQf'
    },
    {
      id: '31',
      name: 'Farmley Walnut',
      description: 'Premium walnuts for heart health and brain function.',
      category: 'seeds-dry-fruits',
      price: '₹799',
      imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/dQYmEnC'
    },

    // Grains
    {
      id: '32',
      name: 'True Elements Rolled Oats',
      description: 'High-fiber rolled oats for healthy breakfast and sustained energy.',
      category: 'grains',
      price: '₹299',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/hxnFVnv'
    },
    {
      id: '33',
      name: 'MB High Protein Oats',
      description: 'Protein-enriched oats for muscle building and recovery.',
      category: 'grains',
      price: '₹449',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/4myu2cy'
    },
    {
      id: '34',
      name: 'True Elements High Protein Oats',
      description: 'Natural high-protein oats for fitness enthusiasts.',
      category: 'grains',
      price: '₹399',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.to/45uApHP'
    },
    {
      id: '35',
      name: 'Quaker Oats',
      description: 'Classic Quaker oats for traditional healthy breakfast.',
      category: 'grains',
      price: '₹199',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/f7ICOu5'
    },
    {
      id: '36',
      name: 'ALPINO High Protein Oats',
      description: 'Premium high-protein oats for enhanced nutrition.',
      category: 'grains',
      price: '₹549',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/cmFCS4C'
    },
    {
      id: '37',
      name: 'PINTOLA 25g High Protein Oats',
      description: 'High-protein oats with 25g protein per serving.',
      category: 'grains',
      price: '₹649',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/7j3aU2o'
    },
    {
      id: '38',
      name: 'DC DOCTORS CHOICE Oats',
      description: 'Doctor-recommended oats for optimal health benefits.',
      category: 'grains',
      price: '₹349',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/7PqBjaK'
    },
    {
      id: '39',
      name: 'Kellogg\'s Oats',
      description: 'Trusted Kellogg\'s oats for nutritious breakfast.',
      category: 'grains',
      price: '₹249',
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: 'https://amzn.in/d/2symdz2'
    },

    // Workout Essentials
    {
      id: '40',
      name: 'Amla Powder',
      description: 'Pure amla powder rich in vitamin C for immunity and health.',
      category: 'workout-essentials',
      price: '₹199',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: '#'
    },
    {
      id: '41',
      name: 'Moringa Powder',
      description: 'Nutrient-dense moringa powder for energy and vitality.',
      category: 'workout-essentials',
      price: '₹299',
      imageUrl: 'https://images.pexels.com/photos/6551071/pexels-photo-6551071.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: '#'
    },

    // Supplements
    {
      id: '42',
      name: 'Whey Protein Isolate',
      description: 'High-quality whey protein for muscle building and recovery.',
      category: 'supplements',
      price: '₹2499',
      imageUrl: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: '#'
    },

    // Weight Machine
    {
      id: '43',
      name: 'Digital Weight Scale',
      description: 'Accurate digital weight scale for tracking fitness progress.',
      category: 'weight-machine',
      price: '₹1299',
      imageUrl: 'https://images.pexels.com/photos/6111619/pexels-photo-6111619.jpeg?auto=compress&cs=tinysrgb&w=800',
      purchaseUrl: '#'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'green-tea', label: 'Green Tea' },
    { value: 'apple-cider-vinegar', label: 'Apple Cider Vinegar' },
    { value: 'seeds-dry-fruits', label: 'Seeds/Mix Seeds/Dry Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'workout-essentials', label: 'Workout Essentials' },
    { value: 'supplements', label: 'Supplements' },
    { value: 'weight-machine', label: 'Weight Machine' }
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
      case 'green-tea': return '🍵';
      case 'apple-cider-vinegar': return '🍎';
      case 'seeds-dry-fruits': return '🥜';
      case 'grains': return '🌾';
      case 'workout-essentials': return '💪';
      case 'supplements': return '💊';
      case 'weight-machine': return '⚖️';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'green-tea': 'from-green-500 to-green-600',
      'apple-cider-vinegar': 'from-red-500 to-red-600',
      'seeds-dry-fruits': 'from-yellow-500 to-yellow-600',
      'grains': 'from-orange-500 to-orange-600',
      'workout-essentials': 'from-purple-500 to-purple-600',
      'supplements': 'from-blue-500 to-blue-600',
      'weight-machine': 'from-gray-500 to-gray-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
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

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
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
                  {getCategoryIcon(product.category)} {categories.find(c => c.value === product.category)?.label}
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