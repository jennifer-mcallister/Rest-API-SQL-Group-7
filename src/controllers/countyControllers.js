const { QueryTypes } = require('sequelize')
const { userRoles } = require('../constants/users')
const { sequelize } = require('../database/config')
const { UnauthorizedError, NotFoundError } = require('../utils/errors')

exports.getAllCounties = async (req, res) => {
    let query
    let options = {}
    query = `
      SELECT county.county_id, county.name, walkingtrail.fk_county_id
      FROM county 
      LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id
      LIMIT 10;
    `
    const [results] = await sequelize.query(query, options)
    return res.json(results)
}

exports.getCountyById = async (req, res) => {
    const countyId = req.params.countyId

    const [results] = await sequelize.query(
        `
            SELECT county.county_id, county.name, walkingtrail.fk_county_id
            FROM county 
            LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id
            WHERE county.county_id = $countyId
            LIMIT 1;
		`,
        {
            bind: { countyId: countyId },
            type: QueryTypes.SELECT,
        }
    )

    if (!results || results.length == 0) {
        throw new NotFoundError('We could not find the county you are looking for')
    }

    return res.json(results)
}

exports.createNewCounty = async (req, res) => {

    const countyName = req.body.countyName;

    if (req.user.role === userRoles.USER) {
        throw new UnauthorizedError('You do not have permission to create a review')
    }

    const [newCountyId] = await sequelize.query(`INSERT INTO County (name)
    VALUES ($name);
    `,
        {
            bind: { countyName: countyName },
            type: QueryTypes.INSERT,
        })

    return res
        .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/review/${newCountyId}`)
        .sendStatus(201)
}

exports.updateCountyById = async (req, res) => {
    const countyId = req.params.countyId
    const countyName = req.body.countyName;

    if (req.user.role !== userRoles.USER) {
        const [county] = await sequelize.query(
            `
            SELECT county.county_id AS countyId
            FROM county
            WHERE countyId = $countyId;
            LIMIT 1
            `,
            {
                bind: { countyId: countyId },
                type: QueryTypes.SELECT,
            }
        )

        if (!county || county.length == 0) {
            throw new NotFoundError('We could not find the county you are looking for')
        }

        // if (req.user.role === userRoles.COUNTY) {
        //     const [county] = await sequelize.query(
        //         `
        //         SELECT county.county_id AS countyId, review.fk_user_id AS userId
        //         FROM review
        //         WHERE reviewId = $reviewId AND review.fk_user_id = $userId;
        //         LIMIT 1
        //         `,
        //         {
        //             bind: { reviewId: reviewId, userId: userId },
        //             type: QueryTypes.SELECT,
        //         }
        //     )

        //     if (county.county_id !== userId) {
        //         throw new UnauthorizedError('You do not have permission to updated this county')
        //     }
        // }

    } else {
        throw new UnauthorizedError('You do not have permission to update counties')
    }


    if (countyName) {
        await sequelize.query(`
        UPDATE county
        SET name = $countyName
        WHERE county.county_id = $countyId;
        `,
            {
                bind: { countyName: countyName, countyId: countyId },
                type: QueryTypes.UPDATE,
            },
        )
    }

    return res.json("County was succesfully updated")
}

exports.deleteCountyById = async (req, res) => {

    const countyId = req.params.countyId
    // const userId = req.body.userId;

    if (req.user.role !== userRoles.USER) {
        const [county] = await sequelize.query(
            `
            SELECT county.county_id AS countyId
            FROM county
            WHERE countyId = $countyId;
            LIMIT 1
            `,
            {
                bind: { countyId: countyId },
                type: QueryTypes.SELECT,
            }
        )

        if (!county || county.length == 0) {
            throw new NotFoundError('We could not find the county you are looking for')
        }

        // if (req.user.role === userRoles.USER) {
        //     const [user] = await sequelize.query(
        //         `
        //         SELECT review.review_id AS reviewId, review.fk_user_id AS userId
        //         FROM review
        //         WHERE reviewId = $reviewId AND review.fk_user_id = $userId;
        //         LIMIT 1
        //         `,
        //         {
        //             bind: { reviewId: reviewId, userId: userId },
        //             type: QueryTypes.SELECT,
        //         }
        //     )

        //     if(user?.userId !== userId) {
        //         throw new UnauthorizedError('You do not have permission to delete this review')
        //     }
        // }

    } else {
        throw new UnauthorizedError('You do not have permission to delete counties')
    }


    await sequelize.query(`
        DELETE FROM county 
        WHERE county_id = $countyId;
    `,
        {
            bind: { countyId: countyId },
            type: QueryTypes.DELETE,
        },
    )

    return res.sendStatus(204)
}