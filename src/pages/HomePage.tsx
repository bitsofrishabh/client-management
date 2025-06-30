import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Heart, Target, Users, Award, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ReferralSubmission } from '../types';

const HomePage: React.FC = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReferralSubmission>();

  const responsibilities = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Set Clear Goals",
      description: "Define your fitness objectives and commit to achieving them with dedication and consistency."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Follow the Program",
      description: "Adhere to your personalized workout and nutrition plan for optimal results."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Communicate Regularly",
      description: "Keep in touch with your coach, ask questions, and provide feedback on your progress."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Track Your Progress",
      description: "Monitor your achievements, log workouts, and celebrate milestones along the way."
    }
  ];

  const termsData = [
    {
      id: 'program-overview',
      title: 'Program Overview',
      content: 'Our comprehensive fitness coaching program is designed to help you achieve your health and wellness goals through personalized training, nutrition guidance, and ongoing support.'
    },
    {
      id: 'commitment',
      title: 'Client Commitment',
      content: 'Clients are expected to follow their personalized program, attend scheduled sessions, and maintain open communication with their assigned coach.'
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      content: 'We protect your personal information and health data in accordance with privacy laws. Your information is used solely for program delivery and improvement.'
    },
    {
      id: 'cancellation',
      title: 'Cancellation Policy',
      content: 'Clients may cancel their subscription with 30 days notice. Refunds are processed according to our refund policy terms.'
    }
  ];

  const onSubmitReferral = (data: ReferralSubmission) => {
    // Mock API call
    console.log('Referral submitted:', data);
    toast.success('Thank you for your referral! We\'ll be in touch soon.');
    reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-emerald-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Thank You for Starting Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100">
              Welcome to a transformative experience where your health and wellness goals become reality. 
              We're here to guide, support, and celebrate every step of your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Client Responsibilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Responsibilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Success in fitness requires commitment and consistency. Here's what we expect from you:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {responsibilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-3 rounded-lg w-fit mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Terms & Conditions Guide
            </h2>
            <p className="text-lg text-gray-600">
              Please review these important guidelines for our fitness program
            </p>
          </motion.div>

          <div className="space-y-4">
            {termsData.map((term) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === term.id ? null : term.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{term.title}</h3>
                  {expandedSection === term.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === term.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600">{term.content}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Quote */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <blockquote className="text-2xl md:text-3xl font-bold mb-6 italic">
              "The groundwork for all happiness is good health."
            </blockquote>
            <p className="text-lg mb-8 text-indigo-100">- Leigh Hunt</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-xl font-semibold hover:shadow-lg transition-shadow duration-300">
                Let's Start Your Journey! 🚀
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Referral Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Refer a Friend
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Know someone who could benefit from our fitness program? Refer them and help them start their journey to better health!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Referral Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Free Month for You</h4>
                    <p className="text-gray-600">Get a free month of coaching when your referral signs up</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Discounted Rate for Friend</h4>
                    <p className="text-gray-600">Your friend gets 20% off their first month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Exclusive Community Access</h4>
                    <p className="text-gray-600">Both get access to our exclusive referral community</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-2xl"
            >
              <form onSubmit={handleSubmit(onSubmitReferral)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="referrerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      id="referrerName"
                      {...register('referrerName', { required: 'Your name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your name"
                    />
                    {errors.referrerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.referrerName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="referrerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <input
                      id="referrerEmail"
                      type="email"
                      {...register('referrerEmail', { 
                        required: 'Your email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.referrerEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.referrerEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="friendName" className="block text-sm font-medium text-gray-700 mb-2">
                      Friend's Name *
                    </label>
                    <input
                      id="friendName"
                      {...register('friendName', { required: 'Friend\'s name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter friend's name"
                    />
                    {errors.friendName && (
                      <p className="mt-1 text-sm text-red-600">{errors.friendName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="friendEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Friend's Email *
                    </label>
                    <input
                      id="friendEmail"
                      type="email"
                      {...register('friendEmail', { 
                        required: 'Friend\'s email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="friend@email.com"
                    />
                    {errors.friendEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.friendEmail.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Add a personal note for your friend..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow duration-200 font-semibold"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Referral</span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;