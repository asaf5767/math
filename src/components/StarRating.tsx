import { motion } from 'framer-motion'

interface StarRatingProps {
  stars: number
  maxStars?: number
  sizeClassName?: string
}

function StarRating({ stars, maxStars = 3, sizeClassName = 'text-3xl' }: StarRatingProps) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`${stars} מתוך ${maxStars} כוכבים`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const earned = index < stars

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: earned ? [0.7, 1.25, 1] : 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`${earned ? 'star-earned' : 'star-empty'} ${sizeClassName}`}
          >
            ⭐
          </motion.span>
        )
      })}
    </div>
  )
}

export default StarRating
