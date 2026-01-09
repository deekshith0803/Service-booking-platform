import React, { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const ReviewSection = ({ serviceId }) => {
    const { axios, user } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [serviceId]);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/reviews/${serviceId}`);
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to write a review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("/api/reviews/add", {
                serviceId,
                rating,
                comment,
            });

            if (data.success) {
                toast.success("Review added successfully!");
                setComment("");
                setRating(0);
                fetchReviews(); // Refresh list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

            {/* Review Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-borderColor mb-8">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    {star <= (hover || rating) ? (
                                        <StarIcon className="w-6 h-6 text-yellow-500" />
                                    ) : (
                                        <StarIconOutline className="w-6 h-6 text-gray-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full p-3 border border-borderColor rounded-lg focus:outline-none focus:border-primary min-h-[100px]"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white p-6 rounded-xl border border-borderColor">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={review.userId?.image || assets.user_profile}
                                        alt="user"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{review.userId?.name || "Anonymous"}</h4>
                                        <p className="text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-500" : "text-gray-200"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
