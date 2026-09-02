import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles, TrendingUp, Zap, Star } from "lucide-react";

const FrontDisplay = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const slidesData = [
    {
      image:
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1142&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Summer Collection",
      subtitle: "Fresh Styles Await",
      tag: "NEW",
      discount: "50% OFF",
    },
    {
      image:
        "https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Tech & Electronics",
      subtitle: "Latest Gadgets",
      tag: "TRENDING",
      discount: "30% OFF",
    },
    {
      image:
        "https://images.unsplash.com/photo-1547658718-1cdaa0852790?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Home Essentials",
      subtitle: "Comfort & Style",
      tag: "SALE",
      discount: "40% OFF",
    },
    {
      image:
        "https://images.unsplash.com/photo-1669723008519-3b5043b5b826?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "OLED Monitor (Organic LED)",
      subtitle: "Style That Speaks",
      tag: "HOT",
      discount: "45% OFF",
    },
    {
      image:
        "https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Sports & Fitness",
      subtitle: "Gear Up Now",
      tag: "BEST",
      discount: "35% OFF",
    },
  ];

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() % slidesData.length);
    };

    api.on("select", onSelect);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      api.off("select", onSelect); // cleanup important
      clearInterval(interval);
    };
  }, [api]);

  return (
    <div className="w-full bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-700 py-8 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slidesData.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-10/50 to-white shadow-xl hover:shadow-2xl transition-all duration-500 dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-800/50 dark:to-zinc-900">
                  {/* Image Section */}
                  <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
                    <img
                      src={slide.image}
                      loading="lazy"
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Tag Badge */}
                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg animate-fade-in dark:from-indigo-500 dark:to-purple-500">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-white font-bold text-sm tracking-wider">
                          {slide.tag}
                        </span>
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6">
                      {/* Discount Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl shadow-md dark:bg-rose-500/10">
                        <span className="text-rose-600 font-bold text-lg dark:text-rose-400">
                          {slide.discount}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                          {slide.title}
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                          {slide.subtitle}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div className="pt-2">
                        <Link to="/products">
                          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold px-8 py-6 text-base rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 dark:from-indigo-500 dark:to-purple-500">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Shop Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 shadow-xl transition-all duration-300 hover:scale-110 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 shadow-xl transition-all duration-300 hover:scale-110 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700" />
        </Carousel>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2.5 mt-8">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-10 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg dark:from-indigo-500 dark:to-purple-500"
                  : "w-3 h-3 bg-slate-300 hover:bg-slate-400 dark:bg-zinc-600 dark:hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          <div className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              10K+
            </div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium dark:text-slate-400">
              Products
            </div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              50K+
            </div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium dark:text-slate-400">
              Customers
            </div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              4.9★
            </div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium dark:text-slate-400">
              Rating
            </div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              24/7
            </div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium dark:text-slate-400">
              Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDisplay;

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/Carousel"

// const FrontDisplay = () => {

//   const imagesData = [
//     "https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg",
//     "https://images.pexels.com/photos/1999463/pexels-photo-1999463.jpeg",
//     "https://images.pexels.com/photos/20255587/pexels-photo-20255587.jpeg",
//     "https://images.pexels.com/photos/12351691/pexels-photo-12351691.png",
//     "https://images.pexels.com/photos/12392915/pexels-photo-12392915.jpeg"

//   ];

//   return (
//     <Carousel className="relative mx-auto w-[70vw] overflow-x-clip sm:overflow-visible">
//       <CarouselContent>
//         {
//           imagesData.map((Images, index) => (
//             <CarouselItem key={index} >
//               <img
//                 src={Images}
//                 loading="lazy"
//                 className="object-cover w-[70vw] h-[50vh] rounded-3xl " />
//             </CarouselItem>
//           ))
//         }

//       </CarouselContent>

//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   )
// }

// export default FrontDisplay
