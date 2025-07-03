import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Award, Send, Brain, FileText, MessageCircle, Moon, Shield, Stethoscope, Clock, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ReferralSubmission } from '../types';

const HomePage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReferralSubmission>();

  const responsibilities = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Commitment & Mind-set",
      description: "Set clear, realistic goals with the coach. Treat the program as a priority (schedule sessions, meal prep, workouts). Approach setbacks as learning moments, not failures."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Honest Tracking",
      description: "Log meals, beverages, and snacks accurately (photos, app, or written journal). Record body weight, measurements, steps, sleep, and mood as instructed. Share dietary slip-ups instead of hiding them."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Adherence to Plans",
      description: "Follow prescribed meal plan or calorie/macro targets. Perform workouts/steps as scheduled (modify only after consulting coach). Take supplements/meds exactly as recommended."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Communication",
      description: "Check-in on agreed days (weekly form, photo updates, or calls). Report injuries, illnesses, travel plans, or high-stress events early. Ask questions instead of guessing."
    },
    {
      icon: <Moon className="h-6 w-6" />,
      title: "Lifestyle Habits",
      description: "Prioritise 7-9 h quality sleep. Stay hydrated (e.g., 2.5–3 L/day unless otherwise advised). Manage stress with breathwork, hobbies, or meditation."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Accountability & Self-Reflection",
      description: "Review weekly progress and note triggers for overeating or missed workouts. Celebrate small wins (e.g., better energy, looser jeans). Adjust personal environment (remove junk food, plan groceries)."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Respect & Ethics",
      description: "Arrive on time for sessions/check-ins. Provide at least 24 h notice for rescheduling. Follow payment schedules and program policies."
    },
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: "Medical Transparency",
      description: "Disclose existing medical conditions, medications, or recent lab results. Obtain physician clearance when required. Inform coach immediately of adverse symptoms."
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
              Client Responsibilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Success in fitness requires commitment and consistency. Here's what we expect from you across key areas:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {responsibilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-3 rounded-lg w-fit mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
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