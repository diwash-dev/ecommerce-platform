import React, { useEffect, useState } from "react";
import { Textarea } from "../textarea";
import { Input } from "../input";
import { Button } from "../button";
import { starsGenerator } from "@/const/Help";
import Error from "@/hooks/Error";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import axios from "axios";

const ProductFeedback = ({ productId }) => {
  // const [reviewsList, setReviewsList] = useState();

  // const [editing, setEditing] = useState({
  //   status: false,
  //   reviewId: null,
  //   review: "",
  // });

  // const [newReview, setNewReview] = useState({
  //   rating: 0,
  //   review: "",
  // });
  // const [newReply, setNewReply] = useState({ review: "" });
  // const [replyingTo, setReplyingTo] = useState(null);

  // const { handleErrorLogout } = Error();
  // const { toast } = useToast();
  // const { user } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   const getReviews = async () => {
  //     try {
  //       const res = await axios.get(
  //         import.meta.env.VITE_API_URL + `/reviews/product/${productId}`,
  //       );
  //       const { data } = await res.data;
  //       setReviewsList(data);
  //     } catch (error) {
  //       handleErrorLogout(error);
  //     }
  //   };
  // }, [productId]);

  // const addReview = async () => {
  //   if (!newReview.review || !newReview.rating) {
  //     return toast({
  //       title: "Please provide both review text and rating.",
  //       variant: "destructive",
  //       description: "Review text and rating are required.",
  //     });
  //   }
  //   try {
  //     const res = await axios.post(
  //       import.meta.env.VITE_API_URL + "/reviews/add",
  //       {
  //         rating: newReview.rating,
  //         review: newReview.review,
  //         productId: productId,
  //         userId: user.id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     );
  //     const { data, message } = await res.data;
  //     toast({
  //       title: "Review added successfully!",
  //       description: "Thank you for sharing your feedback.",
  //     });

  //     setReviewsList([...reviewsList, data]);
  //     setNewReview({ rating: 0, name: "", rating: 0, review: "" });
  //   } catch (error) {
  //     return handleErrorLogout(error);
  //   }
  // };

  // const deleteReview = async (reviewId) => {
  //   if (
  //     !confirm(
  //       "Are you sure you want to delete this review? This action cannot be undone.",
  //     )
  //   ) {
  //     return;
  //   }

  //   try {
  //     const res = await axios.delete(
  //       import.meta.env.VITE_API_URL + `/reviews/delete/${reviewId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     );

  //     const { message } = await res.data;
  //     toast({
  //       title: "Review deleted successfully!",
  //       description: "The review has been removed.",
  //     });

  //     setReviewsList(reviewsList.filter((review) => review.id !== reviewId));
  //   } catch (error) {
  //     return handleErrorLogout(
  //       error,
  //       "Failed to delete review. Please try again.",
  //     );
  //   }
  // };

  // const editReview = async (reviewId) => {
  //   if (!confirm("Are you sure you want to edit this review?")) {
  //     return;
  //   }

  //   try {
  //     const res = await axios.put(
  //       import.meta.env.VITE_API_URL + `/reviews/edit/${reviewId}`,
  //       {
  //         updatedReview: editing.review,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     );
  //     const { data, message } = await res.data;
  //     setReviewsList(
  //       reviewsList.map((review) => (review.id === reviewId ? data : review)),
  //     );
  //     toast({
  //       title: "Review edited successfully!",
  //       description: "Your review has been updated.",
  //     });
  //     setEditing({ status: false, reviewId: null, review: "" });
  //   } catch (error) {
  //     return handleErrorLogout(
  //       error,
  //       "Failed to edit review. Please try again.",
  //     );
  //   }
  // };

  // const addReply = async (reviewId) => {
  //   if (!newReply.review) {
  //     return toast({
  //       title: "Reply cannot be empty.",
  //       variant: "destructive",
  //       description: "Please enter a reply before submitting.",
  //     });
  //   }

  //   try {
  //     const res = await axios.put(
  //       import.meta.env.VITE_API_URL + `/reviews/reply/${reviewId}`,
  //       {
  //         reply: newReply.review,
  //       },

  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       },
  //     );

  //     const { data, message } = await res.data;
  //     toast({
  //       title: "Reply added successfully!",
  //       description: "Your reply has been posted.",
  //     });
  //     setReviewsList((prev) => {
  //       return prev.map((review) => {
  //         if (review.id === reviewId) {
  //           return data;
  //         }
  //         return review;
  //       });
  //     });
  //     setNewReply({ review: "" });
  //     setReplyingTo(null);
  //   } catch (error) {
  //     return handleErrorLogout(error, "Failed to add reply. Please try again.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-10 text-zinc-900 dark:text-white">
          Customer Reviews & Ratings
        </h3>

        {/*      ------------------------   Write Review Section   ----------------------------------     */}

        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-700 mb-8">
          <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            ✍️ Write Your Review
          </h4>

          <Textarea
            placeholder="Share your experience with this product..."
            className="w-full min-h-[120px] p-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 mb-6"
            // onChange={(e) =>
            //   setNewReview({ ...newReview, review: e.target.value })
            // }
            // value={newReview.review}
          />

          {/* -----------------------Rating section------------ */}

          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="flex-1 max-w-xs">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                ⭐ Your Rating
              </label>
              <Input
                type="number"
                max="5"
                min="1"
                placeholder="5"
                className="w-full h-12 px-4 text-center rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                // onChange={(e) =>
                //   setNewReview({ ...newReview, rating: Number(e.target.value) })
                // }
                // value={newReview.rating}
              />
            </div>

            {/* ------------------Button------------------- */}

            <Button
              // onClick={addReview}
              className="flex-1 sm:flex-initial sm:self-end h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Submit Review
            </Button>
          </div>
        </div>

        {/*       ------------ Reviews Display Section -------------------              */}

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 lg:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
            {/*  Reviewer Information */}

            <div className="flex items-start gap-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1761850648640-2ee5870ee883?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/"
                alt="User Avatar"
                className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-md flex-shrink-0"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    John Doe
                  </h3>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Jan 25, 2026
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {starsGenerator(4, "0", 18)}
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    (4.0)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              ipsa provident cumque exercitationem nobis in! Error cumque dolore
              hic natus. Quae mollitia tempora enim modi voluptates aliquam
              placeat exercitationem at.
            </p>

            {/* ----------------------------------------Replies section------------------------------ */}

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-800 p-6 rounded-xl border border-blue-200 dark:border-zinc-600">
              <h4 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                💬 Replies
                <span className="text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-semibold">
                  2
                </span>
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-4 bg-white dark:bg-zinc-800/60 p-4 rounded-xl border border-blue-100 dark:border-zinc-600 hover:shadow-md transition-all duration-200">
                  <img
                    src="https://images.unsplash.com/photo-1761850648640-2ee5870ee883?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/"
                    alt="Seller Avatar"
                    className="w-11 h-11 rounded-full ring-2 ring-blue-300 dark:ring-blue-600 shadow-md flex-shrink-0"
                  />

                  <div className="flex-1">
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
                      SajiloMart Team
                      <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
                        Seller ✓
                      </span>
                    </h5>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                      Thank you for your feedback! We are happy you loved the
                      product 😊
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Reply Input Section */}

            <div className="mt-6 pt-6 border-t-2 border-zinc-200 dark:border-zinc-700">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                💬 Reply to this review
              </label>
              <Textarea
                placeholder="Write your reply here..."
                className="w-full min-h-[100px] p-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 mb-4"
              />
              <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeedback;
