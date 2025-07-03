import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, BarChart3 } from 'lucide-react';
import { Workout } from '../types';

const WorkoutsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Updated workout data with your specific videos
  const workouts: Workout[] = [
    {
      id: '1',
      title: '30 Min FULL BODY DUMBBELL WORKOUT at Home + HIIT Finisher',
      description: 'Complete full-body strength training using dumbbells with an intense HIIT finisher to maximize results.',
      category: 'dumbbell',
      videoUrl: 'https://www.youtube.com/embed/Jpxc0TUr9BI',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: '15 Minute Full Body Dumbbell Workout [Strength and Conditioning]',
      description: 'Quick and effective full-body dumbbell workout focusing on strength and conditioning in just 15 minutes.',
      category: 'dumbbell',
      videoUrl: 'https://www.youtube.com/embed/xqVBoyKXbsA',
      duration: '15 min',
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: '30 Min FULL BODY WORKOUT with WARM UP | No Equipment & No Repeat',
      description: 'Complete bodyweight workout with warm-up, no equipment needed and no repeated exercises.',
      category: 'bodyweight',
      videoUrl: 'https://www.youtube.com/embed/UIPvIYsjfpo',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '4',
      title: '30 Min Intense HIIT Workout For Fat Burn & Cardio No Equipment, No Repeats',
      description: 'High-intensity interval training designed for maximum fat burn and cardiovascular improvement.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/4nPKyvKmFi0',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '5',
      title: '20 Min Fat Burning HIIT Workout - Full body Cardio, No Equipment, No Repeat',
      description: 'Efficient 20-minute HIIT session targeting full-body fat burning with no equipment required.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/-hSma-BRzoo',
      duration: '20 min',
      difficulty: 'intermediate'
    },
    {
      id: '6',
      title: 'Get Abs In 60 Days (Using Science)',
      description: 'Science-based approach to building strong abs and core strength in 60 days.',
      category: 'core',
      videoUrl: 'https://www.youtube.com/embed/Tn-XvYG9x7w',
      duration: '25 min',
      difficulty: 'intermediate'
    },
    {
      id: '7',
      title: '25 Minute Dance Workout At Home | Exercise To Lose Weight FAST | Zumba Class',
      description: 'Fun and energetic 25-minute Zumba dance workout to help you lose weight while having fun.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/HlFwWrcqIYg',
      duration: '25 min',
      difficulty: 'beginner'
    },
    {
      id: '8',
      title: '50-min Exercises To Make Belly Cry HARD | Zumba Class',
      description: 'Intense 50-minute Zumba workout specifically designed to target belly fat with high-energy moves.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/OCy7wPWcTBA',
      duration: '50 min',
      difficulty: 'advanced'
    },
    {
      id: '9',
      title: 'Belly Fat Workout + Full Body Exercise Video | Workout Video | Zumba Fitness',
      description: 'Complete Zumba fitness routine combining belly fat targeting moves with full-body exercises.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/TzbaUd5j_jA',
      duration: '40 min',
      difficulty: 'intermediate'
    },
    {
      id: '10',
      title: 'वज़न घटाने के लिए योग | Yoga for WEIGHT LOSS | 30-minute yoga',
      description: 'Traditional yoga practice specifically designed for weight loss in a 30-minute session.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/s6XgAhHNO2k',
      duration: '30 min',
      difficulty: 'beginner'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'dumbbell', label: 'DB Workout' },
    { value: 'bodyweight', label: 'Body Weight Workout' },
    { value: 'hiit', label: 'HIIT Workout' },
    { value: 'core', label: 'ABS Workout' },
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

  const getCategoryDisplayName = (category: string) => {
    const displayNames = {
      dumbbell: 'DB Workout',
      bodyweight: 'Body Weight Workout',
      hiit: 'HIIT Workout',
      core: 'ABS Workout',
      zumba: 'Zumba',
      yoga: 'Yoga'
    };
    return displayNames[category as keyof typeof displayNames] || category;
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
              placeholder="Search workouts..."
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
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
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

        {/* Difficulty Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Difficulty Level</h3>
          <div className="flex flex-wrap gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setSelectedDifficulty(difficulty.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500 hover:text-purple-600'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-1" />
                {difficulty.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
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
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(workout.category)} text-white`}>
                  {getCategoryDisplayName(workout.category)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {workout.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
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

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-emerald-50 p-8 rounded-2xl"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Professional Workout Collection
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our carefully curated workout library features professional trainers and proven exercise routines. 
              Each video is selected to provide maximum effectiveness for different fitness levels and goals.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutsPage;