import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Users, ChefHat, Flame } from 'lucide-react';
import { Recipe } from '../types';

const RecipesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');

  // Mock recipe data
  const recipes: Recipe[] = [
    {
      id: '1',
      name: 'Protein-Packed Overnight Oats',
      description: 'Creamy overnight oats loaded with protein and fresh berries for the perfect breakfast.',
      mealType: 'breakfast',
      ingredients: [
        '1/2 cup rolled oats',
        '1 scoop vanilla protein powder',
        '1/2 cup almond milk',
        '1 tbsp chia seeds',
        '1/2 cup mixed berries',
        '1 tbsp honey',
        '1/4 cup Greek yogurt'
      ],
      instructions: [
        'Mix oats, protein powder, and chia seeds in a jar',
        'Add almond milk and honey, stir well',
        'Layer with Greek yogurt and berries',
        'Refrigerate overnight',
        'Enjoy cold in the morning'
      ],
      prepTime: '10 min',
      calories: 385,
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      name: 'Avocado Toast with Poached Eggs',
      description: 'Classic avocado toast elevated with perfectly poached eggs and everything seasoning.',
      mealType: 'breakfast',
      ingredients: [
        '2 slices whole grain bread',
        '1 ripe avocado',
        '2 large eggs',
        '1 tsp everything seasoning',
        '1 tbsp lemon juice',
        'Salt and pepper to taste',
        'Cherry tomatoes for garnish'
      ],
      instructions: [
        'Toast bread until golden brown',
        'Mash avocado with lemon juice, salt, and pepper',
        'Poach eggs in simmering water for 3-4 minutes',
        'Spread avocado on toast',
        'Top with poached eggs and everything seasoning',
        'Garnish with cherry tomatoes'
      ],
      prepTime: '15 min',
      calories: 420,
      imageUrl: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      name: 'Greek Yogurt Berry Parfait',
      description: 'Layered parfait with Greek yogurt, fresh berries, and crunchy granola.',
      mealType: 'breakfast',
      ingredients: [
        '1 cup Greek yogurt',
        '1/2 cup mixed berries',
        '1/4 cup granola',
        '1 tbsp honey',
        '1 tbsp sliced almonds',
        'Mint leaves for garnish'
      ],
      instructions: [
        'Layer half the yogurt in a glass',
        'Add half the berries and granola',
        'Repeat layers',
        'Drizzle with honey',
        'Top with almonds and mint'
      ],
      prepTime: '5 min',
      calories: 285,
      imageUrl: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '4',
      name: 'Quinoa Power Bowl',
      description: 'Nutrient-dense bowl with quinoa, roasted vegetables, and tahini dressing.',
      mealType: 'lunch',
      ingredients: [
        '1 cup cooked quinoa',
        '1/2 cup roasted sweet potato',
        '1/2 cup roasted broccoli',
        '1/4 cup chickpeas',
        '2 tbsp tahini',
        '1 tbsp lemon juice',
        '1 tbsp olive oil',
        'Baby spinach leaves'
      ],
      instructions: [
        'Roast sweet potato and broccoli at 400°F for 25 minutes',
        'Cook quinoa according to package directions',
        'Make tahini dressing with tahini, lemon juice, and olive oil',
        'Arrange quinoa in a bowl with spinach',
        'Top with roasted vegetables and chickpeas',
        'Drizzle with tahini dressing'
      ],
      prepTime: '30 min',
      calories: 465,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '5',
      name: 'Mediterranean Chicken Wrap',
      description: 'Fresh wrap filled with grilled chicken, hummus, and Mediterranean vegetables.',
      mealType: 'lunch',
      ingredients: [
        '1 large whole wheat tortilla',
        '4 oz grilled chicken breast',
        '2 tbsp hummus',
        '1/4 cup cucumber, diced',
        '1/4 cup tomatoes, diced',
        '2 tbsp red onion, sliced',
        '2 tbsp feta cheese',
        'Baby spinach leaves'
      ],
      instructions: [
        'Warm tortilla slightly',
        'Spread hummus on tortilla',
        'Add spinach leaves',
        'Layer with chicken, cucumber, tomatoes, and onion',
        'Sprinkle with feta cheese',
        'Roll tightly and slice in half'
      ],
      prepTime: '10 min',
      calories: 390,
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '6',
      name: 'Asian Lettuce Wraps',
      description: 'Light and flavorful lettuce wraps with seasoned ground turkey and vegetables.',
      mealType: 'lunch',
      ingredients: [
        '1 lb ground turkey',
        '8 butter lettuce leaves',
        '1/2 cup water chestnuts, diced',
        '2 green onions, sliced',
        '2 tbsp soy sauce',
        '1 tbsp sesame oil',
        '1 tsp fresh ginger, grated',
        '2 cloves garlic, minced'
      ],
      instructions: [
        'Cook ground turkey in a large skillet',
        'Add garlic and ginger, cook for 1 minute',
        'Add water chestnuts, soy sauce, and sesame oil',
        'Cook for 2-3 minutes until heated through',
        'Spoon mixture into lettuce cups',
        'Garnish with green onions'
      ],
      prepTime: '20 min',
      calories: 285,
      imageUrl: 'https://images.pexels.com/photos/4001871/pexels-photo-4001871.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '7',
      name: 'Baked Salmon with Herbs',
      description: 'Perfectly baked salmon with fresh herbs and lemon, served with roasted vegetables.',
      mealType: 'dinner',
      ingredients: [
        '4 salmon fillets (6 oz each)',
        '2 tbsp olive oil',
        '2 tbsp fresh dill',
        '2 tbsp fresh parsley',
        '1 lemon, sliced',
        '2 cups asparagus',
        '1 cup cherry tomatoes',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Preheat oven to 425°F',
        'Place salmon on a baking sheet',
        'Brush with olive oil and season with herbs',
        'Add asparagus and tomatoes around salmon',
        'Top with lemon slices',
        'Bake for 12-15 minutes until fish flakes easily'
      ],
      prepTime: '25 min',
      calories: 485,
      imageUrl: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '8',
      name: 'Lean Beef Stir-Fry',
      description: 'Quick and healthy stir-fry with lean beef and colorful vegetables.',
      mealType: 'dinner',
      ingredients: [
        '1 lb lean beef strips',
        '2 cups mixed bell peppers',
        '1 cup snap peas',
        '1 cup broccoli florets',
        '3 tbsp low-sodium soy sauce',
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        '1 tbsp fresh ginger, grated'
      ],
      instructions: [
        'Heat oil in a large wok or skillet',
        'Add beef and cook until browned',
        'Remove beef and set aside',
        'Add vegetables to the same pan',
        'Stir-fry for 3-4 minutes until crisp-tender',
        'Return beef to pan with soy sauce and aromatics',
        'Cook for 2 more minutes'
      ],
      prepTime: '20 min',
      calories: 425,
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '9',
      name: 'Stuffed Bell Peppers',
      description: 'Colorful bell peppers stuffed with lean ground turkey, quinoa, and vegetables.',
      mealType: 'dinner',
      ingredients: [
        '4 large bell peppers, tops cut off',
        '1 lb lean ground turkey',
        '1 cup cooked quinoa',
        '1/2 cup diced onion',
        '1/2 cup diced tomatoes',
        '1/2 cup corn kernels',
        '1/4 cup shredded cheese',
        '2 tbsp olive oil'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Cook turkey with onion until browned',
        'Mix in quinoa, tomatoes, and corn',
        'Stuff peppers with mixture',
        'Place in baking dish with 1/4 cup water',
        'Cover and bake for 35-40 minutes',
        'Top with cheese in last 5 minutes'
      ],
      prepTime: '45 min',
      calories: 365,
      imageUrl: 'https://images.pexels.com/photos/3298644/pexels-photo-3298644.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const mealTypes = [
    { value: 'all', label: 'All Meals' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' }
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMealType = selectedMealType === 'all' || recipe.mealType === selectedMealType;
      
      return matchesSearch && matchesMealType;
    });
  }, [searchTerm, selectedMealType, recipes]);

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-yellow-500 to-orange-500';
      case 'lunch': return 'from-green-500 to-emerald-500';
      case 'dinner': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
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
            Healthy Meal Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover nutritious and delicious recipes designed to fuel your fitness journey and support your health goals
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
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Meal Type Filter */}
            <div className="relative">
              <ChefHat className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white min-w-[150px]"
              >
                {mealTypes.map(mealType => (
                  <option key={mealType.value} value={mealType.value}>
                    {mealType.label}
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
            Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Recipe Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getMealTypeColor(recipe.mealType)} text-white`}>
                  {getMealTypeIcon(recipe.mealType)} {recipe.mealType.charAt(0).toUpperCase() + recipe.mealType.slice(1)}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium">{recipe.calories} cal</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {recipe.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>2-4 servings</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {ingredient.split(',')[0]}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-gray-500 text-xs px-2 py-1">
                        +{recipe.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* View Recipe Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-shadow duration-200 font-medium">
                  View Full Recipe
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more results.
            </p>
          </motion.div>
        )}

        {/* Nutrition Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nutrition-Focused Recipes
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              All our recipes are designed with your fitness goals in mind. Each meal provides balanced macronutrients, 
              essential vitamins, and minerals to support your active lifestyle and help you achieve optimal health.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecipesPage;