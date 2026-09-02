import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
              <Briefcase
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                strokeWidth={2}
              />
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Our Services
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive services designed to make your shopping experience
            seamless and enjoyable
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏪",
                title: "Online Shopping",
                desc: "Browse thousands of products with detailed descriptions and images",
                features: [
                  "Multiple categories",
                  "Easy navigation",
                  "Quick search",
                  "Wishlist feature",
                  "Price comparisons",
                ],
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Quick and reliable shipping directly to your doorstep",
                features: [
                  "Order tracking",
                  "Free delivery options",
                  "Same-day delivery",
                  "Scheduled delivery",
                  "Safe packaging",
                ],
              },
              {
                icon: "💳",
                title: "Secure Payments",
                desc: "Multiple payment options with advanced security",
                features: [
                  "Multiple methods",
                  "Bank protection",
                  "Buyer guarantee",
                  "Encrypted transactions",
                  "Instant confirmation",
                ],
              },
              {
                icon: "⭐",
                title: "Product Reviews",
                desc: "Read authentic reviews from verified customers",
                features: [
                  "Real feedback",
                  "Rating system",
                  "Photo reviews",
                  "Verified purchases",
                  "Detailed insights",
                ],
              },
              {
                icon: "🎁",
                title: "Special Offers",
                desc: "Exclusive deals and seasonal promotions",
                features: [
                  "Daily deals",
                  "Flash sales",
                  "Loyalty rewards",
                  "Seasonal offers",
                  "Bundle discounts",
                ],
              },
              {
                icon: "💬",
                title: "Customer Support",
                desc: "Dedicated support team available round the clock",
                features: [
                  "Live chat support",
                  "Email support",
                  "Phone support",
                  "Quick response",
                  "Problem resolution",
                ],
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-600 space-y-4"
              >
                <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {service.desc}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, fidx) => (
                      <li
                        key={fidx}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Services */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Additional Services
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                More features to enhance your shopping journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  emoji: "📦",
                  title: "Bulk Ordering",
                  desc: "Special discounts available for bulk orders and corporate purchases",
                },
                {
                  emoji: "🎯",
                  title: "Personalized Recommendations",
                  desc: "AI-powered product suggestions based on your preferences",
                },
                {
                  emoji: "💝",
                  title: "Gift Cards",
                  desc: "Purchase gift cards for your loved ones",
                },
                {
                  emoji: "🔄",
                  title: "Easy Returns",
                  desc: "Hassle-free returns and exchange within 30 days",
                },
                {
                  emoji: "📱",
                  title: "Mobile App",
                  desc: "Download our app for exclusive mobile-only deals",
                },
                {
                  emoji: "🏅",
                  title: "Loyalty Program",
                  desc: "Earn points on every purchase and redeem for rewards",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 space-y-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{item.emoji}</div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-center shadow-2xl shadow-purple-600/40 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              Experience Premium Shopping
            </h2>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto">
              Start using our services today and discover why thousands of
              customers trust SajiloMart
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/Products"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-purple-600 font-bold rounded-2xl hover:bg-slate-100 transition-all duration-300 text-lg hover:shadow-xl"
              >
                Shop Now
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white/20 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/30 transition-all duration-300 text-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
