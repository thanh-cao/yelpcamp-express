const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams = true to get access to campground id in params when base routes contain /:id

const catchAsync = require('../utils/catchAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;