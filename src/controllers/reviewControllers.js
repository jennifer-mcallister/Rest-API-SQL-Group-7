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
    `	
	const [results, metadata] = await sequelize.query(query, options)
	return res.json(results)
}

exports.getReviewById = async (req, res) => {
    const reviewId = req.params.reviewId

	const [results, metadata] = await sequelize.query(
		`
			SELECT review.review_id, user.user_id, user.name AS user, review.title, review.description, review.rating, walkingtrail.walkingtrail_id, walkingtrail.name AS walkingtrail
			FROM review 
            LEFT JOIN user ON review.fk_user_id = user.user_id
            LEFT JOIN walkingtrail ON review.fk_walkingtrail_id = walkingtrail.walkingtrail_id
			WHERE review.review_id = ${reviewId};
		`,
	)

	if (!results || results.length == 0) {
		throw new NotFoundError('We could not find the review you are looking for')
	}

	return res.json(results)
}

exports.createNewReview = async (req, res) => {
    const userName = req.body.userName;
    const reviewTitle = req.body.reviewTitle;
    const reviewDescription = req.body.reviewDescription;
    const reviewRating = req.body.reviewRating;
    const walkingtrailName = req.body.walkingtrailName;


const [newReviewId] = await sequelize.query(`INSERT INTO review (fk_user_id, title, description, rating, fk_walkingtrail_id)
VALUES ((SELECT user_id FROM user WHERE name = '${userName}'), '${reviewTitle}', '${reviewDescription}', '${reviewRating}', (SELECT walkingtrail_id FROM walkingtrail WHERE name = '${walkingtrailName}'));
`,
    {
        type: QueryTypes.INSERT,
    })
 
return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/review/${newReviewId}`)
    .sendStatus(201)

}

exports.updateReviewById = async (req, res) => {
    const reviewId = req.params.reviewId
    const reviewTitle = req.body.reviewTitle;
    const reviewDescription = req.body.reviewDescription;
    const reviewRating = req.body.reviewRating;

    if (reviewTitle) {
        await sequelize.query( `
        UPDATE review
        SET title = '${reviewTitle}'
        WHERE review.review_id = ${reviewId};
    `
    ) 
    }
    
    if (reviewDescription) {
        await sequelize.query( `
        UPDATE review
        SET description = '${reviewDescription}'
        WHERE review.review_id = ${reviewId};
    `
    ) 
    }

    if (reviewRating) {
        await sequelize.query( `
        UPDATE review
        SET rating = '${reviewRating}'
        WHERE review.review_id = ${reviewId};
    `
    ) 
    }


    return res.json("review was succesfully updated")
}

exports.deleteReviewById = async (req, res) => {
    console.log(req.params)
    const reviewId = req.params.reviewId
    

    await sequelize.query(`DELETE FROM review WHERE review_id = '${reviewId}';`, {
        type: QueryTypes.DELETE,
    })
    return res.sendStatus(204)
}