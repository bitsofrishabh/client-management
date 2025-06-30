import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Play, Clock, BarChart3 } from 'lucide-react';
import { Workout } from '../types';

const WorkoutsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Mock workout data
  const workouts: Workout[] = [
    {
      id: '1',
      title: 'Full Body Dumbbell Workout',
      description: 'Complete full-body strength training using dumbbells for all major muscle groups.',
      category: 'dumbbell',
      videoUrl: 'https://www.youtube.com/embed/vc1E5CfRfos',
      duration: '45 min',
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: 'HIIT Cardio Blast',
      description: 'High-intensity interval training to boost your metabolism and burn calories.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '3',
      title: 'Bodyweight Beginner Routine',
      description: 'Perfect starting point for fitness beginners using only body weight.',
      category: 'bodyweight',
      videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
      duration: '25 min',
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: 'Core Strength Builder',
      description: 'Targeted core workout to build strength and stability in your midsection.',
      category: 'core',
      videoUrl: 'https://www.youtube.com/embed/Ff5ikLm5BRI',
      duration: '20 min',
      difficulty: 'intermediate'
    },
    {
      id: '5',
      title: 'Zumba Dance Fitness',
      description: 'Fun and energetic dance workout that combines fitness with Latin rhythms.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/6S8TzUYzOac',
      duration: '40 min',
      difficulty: 'beginner'
    },
    {
      id: '6',
      title: 'Morning Yoga Flow',
      description: 'Gentle yoga sequence perfect for starting your day with mindfulness.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/VaoV1PrYft4',
      duration: '35 min',
      difficulty: 'beginner'
    },
    {
      id: '7',
      title: 'Advanced Dumbbell Training',
      description: 'Challenging dumbbell exercises for experienced fitness enthusiasts.',
      category: 'dumbbell',
      videoUrl: 'https://www.youtube.com/embed/2HdnaDuMAb0',
      duration: '50 min',
      difficulty: 'advanced'
    },
    {
      id: '8',
      title: 'Power Yoga Challenge',
      description: 'Dynamic yoga practice that builds strength, flexibility, and endurance.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/bVKRFBJOcs4',
      duration: '60 min',
      difficulty: 'advanced'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'dumbbell', label: 'Dumbbell' },
    { value: 'bodyweight', label: 'Bodyweight' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'core', label: 'Core' },
    { value: 'zumba', label: 'Zumba' },
    { value: 'yoga', label: 'Yoga' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workout.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, workouts]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      dumbbell: 'from-blue-500 to-blue-600',
      bodyweight: 'from-green-500 to-green-600',
      hiit: 'from-red-500 to-red-600',
      core: 'from-purple-500 to-purple-600',
      zumba: 'from-pink-500 to-pink-600',
      yoga: 'from-indigo-500 to-indigo-600'
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
            Workout Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover a comprehensive collection of workout videos designed to help you achieve your fitness goals
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
                placeholder="Search workouts..."
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
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
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
            Showing {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Workout Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                <iframe
                  src={workout.videoUrl}
                  title={workout.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(workout.category)} text-white`}>
                  {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {workout.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {workout.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more results.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;