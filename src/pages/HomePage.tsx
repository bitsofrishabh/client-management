import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, MessageCircle, Moon, Shield, Stethoscope, Clock, CheckCircle, Target, Users, BookOpen, TrendingUp, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  const clientResponsibilities = [
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

  const coachResponsibilities = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Assessment & Goal Setting",
      description: "Conduct thorough intake (medical history, lifestyle, diet, activity, labs). Help the client set SMART goals (specific, measurable, attainable, relevant, time-bound)."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Personalized Program Design",
      description: "Create nutrition plan or macro targets that fit client's culture, budget, skill level. Program workouts and activity targets tailored to fitness level, equipment, injuries. Integrate behavioural-change strategies (habit stacking, environmental cues)."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Education & Skill Building",
      description: "Teach portion control, label reading, meal prep basics. Explain exercise technique, tempo, progression. Provide resources (recipes, grocery lists, video demos)."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Ongoing Monitoring & Data Review",
      description: "Review food logs, weight trends, wearable-tracker data, mood & sleep reports. Adjust calories, macros, or training volume based on objective and subjective feedback. Track non-scale victories (energy, mobility, medical markers)."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Motivation & Accountability",
      description: "Celebrate wins, highlight improvements, re-frame setbacks positively. Use motivational interviewing to uncover deeper 'why'. Hold client accountable to commitments without shaming."
    }
  ];

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
            {clientResponsibilities.map((item, index) => (
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

      {/* Coach Responsibilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coach Responsibilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to your success through professional expertise, personalized guidance, and ongoing support:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {coachResponsibilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg w-fit mb-4">
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

      {/* Referral Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Referral Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Know someone who could benefit from our fitness program? Refer them and help them start their journey to better health!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-2xl"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Month for You</h3>
                <p className="text-gray-600">Get a free month of coaching when your referral signs up</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Discounted Rate for Friend</h3>
                <p className="text-gray-600">Your friend gets 20% off their first month</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Exclusive Community Access</h3>
                <p className="text-gray-600">Both get access to our exclusive referral community</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <a
                href="mailto:coach@fitwithrishabh.com?subject=Referral%20Request&body=Hi,%20I%20would%20like%20to%20refer%20a%20friend%20to%20your%20fitness%20program."
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-shadow duration-200 font-semibold"
              >
                <span>Contact Us for Referrals</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;