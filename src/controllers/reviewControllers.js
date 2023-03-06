const { QueryTypes } = require('sequelize')
const { userRoles } = require('../constants/users')
const { sequelize } = require('../database/config')
const { UnauthorizedError, NotFoundError } = require('../utils/errors')

exports.getAllReviews = async (req, res) => {
	let query
	let options = {}
		query = `
      SELECT review.review_id, user.user_id, user.name AS user, review.title, review.description, review.rating, walkingtrail.walkingtrail_id, walkingtrail.name AS walkingtrail
      FROM review 
      LEFT JOIN user ON review.fk_user_id = user.user_id
      LEFT JOIN walkingtrail ON review.fk_walkingtrail_id = walkingtrail.walkingtrail_id
      LIMIT 10
    `	
	const [results] = await sequelize.query(query, options)
	return res.json(results)
}

exports.getReviewById = async (req, res) => {
    const reviewId = req.params.reviewId

	const [results] = await sequelize.query(
		`
			SELECT review.review_id AS reviewId, user.user_id, user.name AS user, review.title, review.description, review.rating, walkingtrail.walkingtrail_id, walkingtrail.name AS walkingtrail
			FROM review 
            LEFT JOIN user ON review.fk_user_id = user.user_id
            LEFT JOIN walkingtrail ON review.fk_walkingtrail_id = walkingtrail.walkingtrail_id
			WHERE review.review_id = $reviewId;
            LIMIT 1
		`,
        {
            bind: { reviewId: reviewId},
            type: QueryTypes.SELECT,
        }
	)

	if (!results || results.length == 0) {
		throw new NotFoundError('We could not find the review you are looking for')
	}

	return res.json(results)
}

exports.createNewReview = async (req, res) => {
    const userName = req.body.userName;
    const reviewTitle = req.body.title;
    const reviewDescription = req.body.description || "";
    const reviewRating = req.body.rating;
    const walkingtrailName = req.body.walkingtrailName;
   
    if ( req.user.role === userRoles.COUNTY ) {
        throw new UnauthorizedError('You do not have permission to create a review')
    }

    const [newReviewId] = await sequelize.query(`INSERT INTO review (fk_user_id, title, description, rating, fk_walkingtrail_id)
    VALUES ((SELECT user_id FROM user WHERE name = $userName), $reviewTitle, $reviewDescription, $reviewRating, (SELECT walkingtrail_id FROM walkingtrail WHERE name = $walkingtrailName));
    `,
    {
        bind: { userName: userName, reviewTitle: reviewTitle, reviewDescription: reviewDescription, reviewRating: reviewRating, walkingtrailName: walkingtrailName },
        type: QueryTypes.INSERT,
    })
 
    return res
        .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/review/${newReviewId}`)
        .sendStatus(201)
}

exports.updateReviewById = async (req, res) => {
    const reviewId = req.params.reviewId
    const userId = req.body.userId;
    const reviewTitle = req.body.title;
    const reviewDescription = req.body.description || "";
    const reviewRating = req.body.rating;


    if ( req.user.role !== userRoles.COUNTY) {
        const [review] = await sequelize.query(
            `
            SELECT review.review_id AS reviewId
            FROM review
            WHERE reviewId = $reviewId;
            LIMIT 1
            `,
            {
                bind: { reviewId: reviewId},
                type: QueryTypes.SELECT,
            }
        )
    
        if (!review || review.length == 0) {
            throw new NotFoundError('We could not find the review you are looking for')
        }

        if (req.user.role === userRoles.USER) {
            const [user] = await sequelize.query(
                `
                SELECT review.review_id AS reviewId, review.fk_user_id AS userId
                FROM review
                WHERE reviewId = $reviewId AND review.fk_user_id = $userId;
                LIMIT 1
                `,
                {
                    bind: { reviewId: reviewId, userId: userId },
                    type: QueryTypes.SELECT,
                }
            )
            
            if(user?.userId !== userId) {
                throw new UnauthorizedError('You do not have permission to updated this review')
            }
        }
    
    } else {
        throw new UnauthorizedError('You do not have permission to updated reviews')
    }


    if (reviewTitle) {
        await sequelize.query(`
        UPDATE review
        SET title = $reviewTitle
        WHERE review.review_id = $reviewId;
        `,
        {
            bind: { reviewTitle: reviewTitle, reviewId: reviewId},
            type: QueryTypes.UPDATE,
        },
        )
    }
    
    if (reviewDescription) {
        await sequelize.query( `
        UPDATE review
        SET description = $reviewDescription
        WHERE review.review_id = $reviewId;
        `,
        {
            bind: { reviewDescription: reviewDescription, reviewId: reviewId },
            type: QueryTypes.UPDATE,
        },
        ) 
    }

    if (reviewRating) {
        await sequelize.query( `
        UPDATE review
        SET rating = $reviewRating 
        WHERE review.review_id = $reviewId;
    `,
    {
        bind: { reviewRating: reviewRating, reviewId: reviewId },
        type: QueryTypes.UPDATE,
    },
    ) 
    }

    return res.json("review was succesfully updated")
}

exports.deleteReviewById = async (req, res) => {

        const reviewId = req.params.reviewId
        const userId = req.body.userId;

        if ( req.user.role !== userRoles.COUNTY) {
            const [review] = await sequelize.query(
                `
                SELECT review.review_id AS reviewId
                FROM review
                WHERE reviewId = $reviewId;
                LIMIT 1
                `,
                {
                    bind: { reviewId: reviewId},
                    type: QueryTypes.SELECT,
                }
            )
        
            if (!review || review.length == 0) {
                throw new NotFoundError('We could not find the review you are looking for')
            }

            if (req.user.role === userRoles.USER) {
                const [user] = await sequelize.query(
                    `
                    SELECT review.review_id AS reviewId, review.fk_user_id AS userId
                    FROM review
                    WHERE reviewId = $reviewId AND review.fk_user_id = $userId;
                    LIMIT 1
                    `,
                    {
                        bind: { reviewId: reviewId, userId: userId },
                        type: QueryTypes.SELECT,
                    }
                )
                
                if(user?.userId !== userId) {
                    throw new UnauthorizedError('You do not have permission to delete this review')
                }
            }
        
        } else {
            throw new UnauthorizedError('You do not have permission to delete reviews')
        }
        
    
        await sequelize.query(`
            DELETE FROM review 
            WHERE review_id = $reviewId;
        `,
        {
            bind: { reviewId: reviewId },
            type: QueryTypes.DELETE,
        },
        )

    return res.sendStatus(204)
}

   
