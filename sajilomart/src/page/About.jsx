import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Zap, Shield, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <h1 className="text-2xl sm:text-4xl lg:text-7xl font-black text-white leading-tight">
            About SajiloMart
          </h1>
          <p className="text-sm sm:text-lg lg:text-2xl text-white/90 max-w-3xl mx-auto font-light">
            An online marketplace revolutionizing how Nepali people shop for
            quality products
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Who We Are */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-block px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  Who We Are
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 dark:text-white">
                  Welcome to SajiloMart
                </h2>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                SajiloMart is Nepal's premier online marketplace, dedicated to
                bringing convenience, quality, and affordability to every
                household. We believe shopping should be effortless and
                enjoyable.
              </p>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Since our launch, we've connected thousands of happy customers
                with thousands of trusted sellers, creating a vibrant ecosystem
                of commerce that puts customer satisfaction first.
              </p>

              <div className="pt-4">
                <Link
                  to="/Products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-600/40 transition-all duration-300 text-lg"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "100K+", label: "Happy Customers" },
                { number: "5K+", label: "Products" },
                { number: "24/7", label: "Support" },
                { number: "99.9%", label: "Uptime" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-3 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-indigo-200 dark:border-indigo-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-blue-600 text-white">
                  <Zap className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                To revolutionize online shopping in Nepal by providing a
                seamless, secure, and customer-centric platform where
                world-class quality meets unbeatable affordability.
              </p>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-purple-200 dark:border-purple-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-purple-600 text-white">
                  <Heart className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                To become Nepal's most trusted and loved online marketplace,
                where every customer feels valued and every transaction is a
                delightful experience.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                Our Core Values
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                What drives everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  emoji: "🛡️",
                  title: "Trust & Security",
                  desc: "Your safety and privacy are paramount in everything we do",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Heart,
                  emoji: "❤️",
                  title: "Customer First",
                  desc: "Every decision we make puts our customers at the center",
                  color: "from-red-500 to-pink-500",
                },
                {
                  icon: Zap,
                  emoji: "⚡",
                  title: "Swift Innovation",
                  desc: "We constantly evolve to meet your changing needs",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  icon: Users,
                  emoji: "👥",
                  title: "Community Driven",
                  desc: "Building a vibrant community of buyers and sellers",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((value, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 text-center hover:border-indigo-400 dark:hover:border-indigo-600"
                >
                  <div className="text-6xl">{value.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-700">
            <div className="text-center space-y-3">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                Why Choose SajiloMart?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  emoji: "🛍️",
                  title: "Wide Selection",
                  desc: "Thousands of carefully curated products across all categories",
                },
                {
                  emoji: "💰",
                  title: "Unbeatable Prices",
                  desc: "Competitive pricing with exciting discounts and offers every day",
                },
                {
                  emoji: "🚀",
                  title: "Lightning Fast",
                  desc: "Quick delivery across Nepal with real-time tracking",
                },
                {
                  emoji: "🔐",
                  title: "Secure & Safe",
                  desc: "Multiple payment options with buyer protection guarantee",
                },
                {
                  emoji: "💬",
                  title: "Always Available",
                  desc: "Round-the-clock customer support for any queries",
                },
                {
                  emoji: "✨",
                  title: "Hassle-Free Returns",
                  desc: "Easy returns and exchanges within 30 days, no questions asked",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-4xl flex-shrink-0 mt-1">
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6 py-12">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              Ready to Experience SajiloMart?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join thousands of happy customers shopping on Nepal's trusted
              marketplace
            </p>
            <Link
              to="/Products"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-600/40 transition-all duration-300 text-lg"
            >
              Start Shopping Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
