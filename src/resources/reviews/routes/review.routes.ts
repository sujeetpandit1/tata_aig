import express from 'express';
import { create_review } from '../controllers/create.review';
import { review_validation } from '../services/reviews.services';
import { auth } from '../../../auth/auth.middleware';
import { update_review } from '../controllers/update.review';
import { get_product_ratings_byid } from '../controllers/get.product.review.list';


const router = express.Router();


    router.post('/createReview', auth, review_validation, create_review );
    router.post('/updateReview', auth, review_validation, update_review );
    router.post('/listReview', auth, review_validation, get_product_ratings_byid);


  
  export default router;