
import React, { useId } from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  starColor?: string;
  halfStarRgbColor?: string;
}

const Star: React.FC<{ color: string }> = ({ color }) => (
  <svg className={`w-5 h-5 ${color}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.539 1.118l-3.368-2.445a1 1 0 00-1.175 0l-3.368 2.445c-.783.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

const HalfStar: React.FC<{color: string}> = ({ color }) => {
    const id = useId();
    const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.539 1.118l-3.368-2.445a1 1 0 00-1.175 0l-3.368 2.445c-.783.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z";
    
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
            <defs>
                <linearGradient id={id}>
                    <stop offset="50%" stopColor={color} />
                    <stop offset="50%" stopColor="rgb(209 213 219)" />
                </linearGradient>
            </defs>
            <path d={starPath} fill={`url(#${id})`} />
        </svg>
    )
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, starColor = 'text-amber-400', halfStarRgbColor = 'rgb(251 191 36)' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} color={starColor} />
      ))}
      {halfStar && <HalfStar color={halfStarRgbColor} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} color="text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;