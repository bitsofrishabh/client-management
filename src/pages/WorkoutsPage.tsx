import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, BarChart3 } from 'lucide-react';
import { Workout } from '../types';

const WorkoutsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 videos per page for better mobile performance

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
    },
    {
      id: '11',
      title: 'Burn Calories Exercise Video | Hard Workout Video | Zumba Fitness With Unique Beats',
      description: 'High-energy Zumba workout with unique beats designed to burn maximum calories.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/cXq7dap9Z_c',
      duration: '45 min',
      difficulty: 'intermediate'
    },
    {
      id: '12',
      title: 'COMPLETE 20 MIN ABS WORKOUT (From Home)',
      description: 'Complete 20-minute abs workout that can be done from home with no equipment needed.',
      category: 'core',
      videoUrl: 'https://www.youtube.com/embed/8PwoytUU06g',
      duration: '20 min',
      difficulty: 'intermediate'
    },
    {
      id: '13',
      title: '30 Min FAT BURN | No Equipment | Rowan Row',
      description: 'Intense 30-minute fat burning workout with no equipment required.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/OV8mGUgH4QA',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '14',
      title: '30 Minute FULL BODY WORKOUT | No Equipment | Rowan Row',
      description: 'Complete full-body workout routine that requires no equipment and targets all muscle groups.',
      category: 'bodyweight',
      videoUrl: 'https://www.youtube.com/embed/UUXG2oV9yts',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '15',
      title: '20 Minute Complete ABS WORKOUT | Rowan Row',
      description: 'Comprehensive 20-minute abs workout targeting all core muscles.',
      category: 'core',
      videoUrl: 'https://www.youtube.com/embed/5Ici1mxdX_4',
      duration: '20 min',
      difficulty: 'intermediate'
    },
    {
      id: '16',
      title: '20 MIN FULL BODY WORKOUT AT HOME HIIT (Fat Burn & No Equipment)',
      description: 'High-intensity 20-minute full body HIIT workout for maximum fat burn.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/0Grvq1Kz6L8',
      duration: '20 min',
      difficulty: 'advanced'
    },
    {
      id: '17',
      title: '20 Min Fat Burning HIIT Workout - Full body Cardio, No Equipment',
      description: 'Efficient 20-minute HIIT workout focusing on full-body cardio and fat burning.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/ixwz1uv3UhI',
      duration: '20 min',
      difficulty: 'intermediate'
    },
    {
      id: '18',
      title: 'Nonstop Dance Workout 2025 | Bollywood Dance Workout',
      description: 'Fun Bollywood dance workout to lose weight fast at home with continuous movement.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/IR0ejm2KRbc',
      duration: '40 min',
      difficulty: 'beginner'
    },
    {
      id: '19',
      title: '30-Minute HIIT Cardio Workout with Warm Up - No Equipment at Home',
      description: 'Complete 30-minute HIIT cardio session with warm-up, no equipment needed.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '20',
      title: '30 MIN MORNING PILATES || Energising Full Body Workout (Moderate)',
      description: 'Energizing morning Pilates routine for full-body strength and flexibility.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/LbG1ovCGp-E',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '21',
      title: '20 MINUTE | TABATA WORKOUT | Full Body | One Dumbbell',
      description: 'High-intensity Tabata workout using just one dumbbell for full-body conditioning.',
      category: 'dumbbell',
      videoUrl: 'https://www.youtube.com/embed/YcUQNI9xKWk',
      duration: '20 min',
      difficulty: 'advanced'
    },
    {
      id: '22',
      title: '30-Minute STRONG by Zumba® Cardio and Full-Body Toning Workout',
      description: 'STRONG by Zumba workout combining cardio and full-body toning exercises.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/QRZcZgSgSHI',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '23',
      title: '[Favourite] Level 4 - Killer Home Cardio!',
      description: 'Advanced level 4 killer cardio workout designed for maximum intensity.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/A5CWlen5N2I',
      duration: '35 min',
      difficulty: 'advanced'
    },
    {
      id: '24',
      title: 'Strength & Conditioning Full Body Workout | 50 Min No Equipment',
      description: 'Comprehensive 50-minute strength and conditioning workout requiring no equipment.',
      category: 'bodyweight',
      videoUrl: 'https://www.youtube.com/embed/zCtlydVR3DQ',
      duration: '50 min',
      difficulty: 'advanced'
    },
    {
      id: '25',
      title: '30 Mins HIIT Cardio Workout | High Intensity Workout',
      description: 'High-intensity 30-minute HIIT cardio workout for maximum calorie burn.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/4aSJvLMTZAY',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '26',
      title: '30-Min HEAT Cardio Workout for Fat Burn & Strength',
      description: 'Intense HEAT cardio workout combining fat burn and strength training.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/Rp1v0WJGNiI',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '27',
      title: 'Full Body Cardio Workout at Home | Burn Calories Fast',
      description: 'Fast-paced full body cardio workout to burn calories quickly at home.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/kMKrbt4OS_E',
      duration: '25 min',
      difficulty: 'intermediate'
    },
    {
      id: '28',
      title: 'Full Body HIIT Workout for Core Strength & Fat Loss',
      description: 'HIIT workout targeting core strength and fat loss with no equipment needed.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/JpD2obRNKxk',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '29',
      title: '30 Minute Full Body HIIT Workout | No Equipment Needed',
      description: 'Complete 30-minute full body HIIT workout to burn fat fast.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/zUcen7B4DvA',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '30',
      title: '50 Min Upper Body Dumbbell Workout at Home',
      description: 'Comprehensive 50-minute upper body strength training with dumbbells.',
      category: 'dumbbell',
      videoUrl: 'https://www.youtube.com/embed/zUK56JWjbPw',
      duration: '50 min',
      difficulty: 'advanced'
    },
    {
      id: '31',
      title: 'Beginner Vinyasa Yoga | 50-Min Home Yoga for Strength & Flexibility',
      description: 'Beginner-friendly Vinyasa yoga session for building strength and flexibility.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/1V9CXW9llZY',
      duration: '50 min',
      difficulty: 'beginner'
    },
    {
      id: '32',
      title: '30-Min HEAT Cardio Workout | Strength & Cardio Burn Exercises',
      description: 'HEAT cardio workout combining strength and cardio burn exercises.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/1G4x48WZV7c',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '33',
      title: 'LOSE BELLY FAT IN 7 DAYS Challenge',
      description: '7-day belly fat challenge workout to lose belly fat in one week at home.',
      category: 'core',
      videoUrl: 'https://www.youtube.com/embed/digpucxFbMo',
      duration: '25 min',
      difficulty: 'intermediate'
    },
    {
      id: '34',
      title: '30 MIN CALORIE KILLER HIIT Workout - Full body Cardio',
      description: 'Calorie-killing 30-minute HIIT workout with full body cardio movements.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/jpizoUy4K9s',
      duration: '30 min',
      difficulty: 'advanced'
    },
    {
      id: '35',
      title: 'Walking Exercise with the SUPER Coaches! | Walk at Home',
      description: 'Low-impact walking exercise routine that can be done at home.',
      category: 'bodyweight',
      videoUrl: 'https://www.youtube.com/embed/AdqrTg_hpEQ',
      duration: '30 min',
      difficulty: 'beginner'
    },
    {
      id: '36',
      title: '30 Minute Full Body Cardio HIIT Workout (With Modifications)',
      description: 'Full body cardio HIIT workout with modifications for different fitness levels.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/Okpb-ZX8a_k',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '37',
      title: 'Burn 1000 Calories with this 45 MIN CARDIO HIIT Workout',
      description: 'Intense 45-minute cardio HIIT workout designed to burn 1000 calories.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/yVUcHEOr450',
      duration: '45 min',
      difficulty: 'advanced'
    },
    {
      id: '38',
      title: 'The Ultimate 45 Min FULL BODY WORKOUT | Rowan Row',
      description: 'Ultimate 45-minute full body workout covering all major muscle groups.',
      category: 'bodyweight',
      videoUrl: 'https://www.youtube.com/embed/cDq-nFmD0rI',
      duration: '45 min',
      difficulty: 'advanced'
    },
    {
      id: '39',
      title: 'Belly Fat Workout + Full Body Exercise Video | Zumba Fitness',
      description: 'Zumba fitness routine targeting belly fat with full body exercises.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/TzbaUd5j_jA',
      duration: '35 min',
      difficulty: 'intermediate'
    },
    {
      id: '40',
      title: '15 MIN SWEATY HIIT Workout - No Equipment, No Repeat',
      description: 'Quick 15-minute sweaty HIIT workout with no equipment and no repeated exercises.',
      category: 'hiit',
      videoUrl: 'https://www.youtube.com/embed/_3hoz1zATys',
      duration: '15 min',
      difficulty: 'intermediate'
    },
    {
      id: '41',
      title: 'Yoga for Weight Loss & Belly Fat, Complete Beginners Fat Burning Workout',
      description: 'Beginner-friendly yoga routine specifically designed for weight loss and belly fat reduction.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/WmSIMpIDa_A',
      duration: '40 min',
      difficulty: 'beginner'
    },
    {
      id: '42',
      title: 'Hatha Yoga Exercise | Yoga For Beginners | Yoga At Home',
      description: 'Traditional Hatha yoga practice designed for beginners to build strength and flexibility at home.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/h9-pIazVD8w',
      duration: '30 min',
      difficulty: 'beginner'
    },
    {
      id: '43',
      title: 'Hatha Yoga Exercise | Yoga For Beginners | Yoga At Home (Session 2)',
      description: 'Second session of Hatha yoga exercises for beginners focusing on basic poses and breathing.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/80UUstepYB8',
      duration: '30 min',
      difficulty: 'beginner'
    },
    {
      id: '44',
      title: 'Hatha Yoga For Flexibility In Hindi - Day 7 | Surya Namaskar For Flexibility',
      description: 'Day 7 of Hatha yoga series focusing on flexibility through Surya Namaskar practice in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/GAgQQvswvbs',
      duration: '35 min',
      difficulty: 'intermediate'
    },
    {
      id: '45',
      title: 'Strength Building Hatha Yoga in Hindi - Day 6 | Surya Namaskar For Strength',
      description: 'Day 6 of Hatha yoga series focusing on building strength through Surya Namaskar in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/unmh2KWlspM',
      duration: '35 min',
      difficulty: 'intermediate'
    },
    {
      id: '46',
      title: 'Hatha Yoga In Hindi - Day 5 | Surya Namaskar For Flexibility',
      description: 'Day 5 of Hatha yoga series with Surya Namaskar practice for improved flexibility in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/j-_xKs6QEos',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '47',
      title: 'Hatha Yoga In Hindi - Day 4 | Surya Namaskar For Strength And Flexibility',
      description: 'Day 4 of Hatha yoga combining strength and flexibility through Surya Namaskar in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/5iKB4Axb1W0',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '48',
      title: 'Hatha Yoga For Strength In Hindi - Day 3 | Yoga At Home',
      description: 'Day 3 of Hatha yoga series focusing on building strength at home in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/Zh-ViLXsWbo',
      duration: '30 min',
      difficulty: 'beginner'
    },
    {
      id: '49',
      title: 'Hatha Yoga In Hindi - Day 2 | Surya Namaskar | Yoga At Home',
      description: 'Day 2 of Hatha yoga series with Surya Namaskar practice for beginners in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/3gKfU2gf0v0',
      duration: '25 min',
      difficulty: 'beginner'
    },
    {
      id: '50',
      title: 'Hatha Yoga | Yoga at Home for Flexibility & Strength | Hindi Yoga Class',
      description: 'Complete Hatha yoga session for flexibility and strength practice at home in Hindi.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/eKagi0hX9bY',
      duration: '40 min',
      difficulty: 'beginner'
    },
    {
      id: '51',
      title: 'Power Yoga for Beginners | Yoga For Beginners | Yoga At Home',
      description: 'Dynamic Power yoga session designed for beginners to build strength and endurance.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/eJ_dgBQ_cxo',
      duration: '45 min',
      difficulty: 'intermediate'
    },
    {
      id: '52',
      title: 'Beginner Power Yoga Routine | Yoga at Home for Strength & Flexibility',
      description: 'Power yoga routine for beginners focusing on building strength and flexibility at home.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/z_Ot848Lew4',
      duration: '40 min',
      difficulty: 'intermediate'
    },
    {
      id: '53',
      title: 'Power Yoga for Beginners | Yoga For Beginners | Yoga At Home (Advanced)',
      description: 'Advanced Power yoga session for beginners ready to challenge themselves with dynamic poses.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/GtUWr1nbf_8',
      duration: '45 min',
      difficulty: 'intermediate'
    },
    {
      id: '54',
      title: 'Morning Power Yoga for Beginners | Yoga For Beginners | Yoga At Home',
      description: 'Energizing morning Power yoga routine perfect for starting your day with strength and focus.',
      category: 'yoga',
      videoUrl: 'https://www.youtube.com/embed/8C_YyW9-QvA',
      duration: '35 min',
      difficulty: 'beginner'
    },
    {
      id: '55',
      title: 'Bollywood Zumba Workout Video | Dance Video | Zumba Video',
      description: 'High-energy Bollywood Zumba workout combining dance moves with fitness for a fun workout experience.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/34nhJPcMRVI',
      duration: '35 min',
      difficulty: 'intermediate'
    },
    {
      id: '56',
      title: 'Mat Workout Video For Belly Fat And Full Body Workout Video',
      description: 'Mat-based Zumba workout targeting belly fat with full body movements for comprehensive fitness.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/JDsScafAOSM',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '57',
      title: '30 minutes Nonstop Workout Video | Full Body Workout Video',
      description: 'Non-stop 30-minute Zumba workout for full body conditioning and cardiovascular fitness.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/5A16XH5tVFc',
      duration: '30 min',
      difficulty: 'intermediate'
    },
    {
      id: '58',
      title: 'Workout For Lower And Upper Belly Fat Video',
      description: 'Targeted Zumba workout focusing on lower and upper belly fat reduction through dance movements.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/FwTXhMkTeYU',
      duration: '25 min',
      difficulty: 'intermediate'
    },
    {
      id: '59',
      title: '5 Kg Weight Loss Video | Nonstop 40 Minutes Hard Exercise Video',
      description: 'Intense 40-minute non-stop Zumba workout designed for significant weight loss and fat burning.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/5cPVjzPOJgg',
      duration: '40 min',
      difficulty: 'advanced'
    },
    {
      id: '60',
      title: '1 Hour Best Exercise For Everyone | Full Body Workout Video',
      description: 'Comprehensive 1-hour Zumba workout suitable for all fitness levels with full body conditioning.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/-F0dBjgcfgc',
      duration: '60 min',
      difficulty: 'intermediate'
    },
    {
      id: '61',
      title: 'Belly Fat And Full Body Workout Video | Zumba Fitness',
      description: 'Zumba fitness routine targeting belly fat while providing full body workout for overall fitness.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/KcsQtCdWJNQ',
      duration: '35 min',
      difficulty: 'intermediate'
    },
    {
      id: '62',
      title: 'Beginners के लिए Easy Exercise Video | Zumba Fitness',
      description: 'Easy Zumba exercise video designed specifically for beginners in Hindi with simple movements.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/eGLbvwSxPmY',
      duration: '25 min',
      difficulty: 'beginner'
    },
    {
      id: '63',
      title: 'वजन कम करने के लिए यह आसान एक्सरसाइज | Easy Exercise for Weight Loss',
      description: 'Easy Zumba exercises for weight loss in Hindi, perfect for those starting their fitness journey.',
      category: 'zumba',
      videoUrl: 'https://www.youtube.com/embed/XdNLRK7vyMU',
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

  // Pagination logic
  const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkouts = filteredWorkouts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

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
            Showing {startIndex + 1}-{Math.min(endIndex, filteredWorkouts.length)} of {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Workout Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <iframe
                  src={workout.videoUrl}
                  title={workout.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center space-x-2 mt-12"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}

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