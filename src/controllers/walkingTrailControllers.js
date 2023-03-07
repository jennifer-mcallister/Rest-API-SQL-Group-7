const { QueryTypes } = require('sequelize')
const { userRoles } = require('../constants/users')
const { sequelize } = require('../database/config')
const { UnauthorizedError, NotFoundError } = require('../utils/errors')

exports.getAllWalkingtrails = async (req, res) => {
    const [results, metadata] = await sequelize.query(`
        SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, walkingtrail.location, walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description , county.county_id AS countyId, county.name FROM walkingtrail 
        LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id LIMIT 10;
    `)

    return res.json(results)
}

exports.getWalkingtrailById = async (req, res) => {
    const walkingtrailId = req.params.walkingtrailId

    const [results, metadata] = await sequelize.query(
        `
            SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, walkingtrail.location, walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description , county.county_id AS countyId, county.name FROM walkingtrail 
            LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id
			WHERE walkingtrailId = $walkingtrailId LIMIT 10;
		`,
        {
            bind: { walkingtrailId: walkingtrailId },
            type: QueryTypes.SELECT
        }
    )

    if (!results || results.length == 0) {
        throw new NotFoundError('We could not find the walkingtrail you are looking for')
    }

    return res.json(results)
}

exports.createNewWalkingtrail = async (req, res) => {

    if (req.user.role !== userRoles.USER) {
        const walkingtrailName = req.body.walkingtrailName;
        const walkingtrailLocation = req.body.walkingtrailLocation;
        const countyName = req.body.countyName;
        const walkingtrailDistance = req.body.walkingtrailDistance;
        const walkingtrailDifficulty = req.body.walkingtrailDifficulty;
        const walkingtrailDescription = req.body.walkingtrailDescription;

        const [newWalkingtrailId] = await sequelize.query(`INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description) 
        VALUES ('$walkingtrailName', '$walkingtrailLocation', (SELECT county_id FROM county WHERE name = '$countyName'), '$walkingtrailDistance', '$walkingtrailDifficulty', '$walkingtrailDescription}'); 
    `,
            {
                bind: {
                    walkingtrailName: walkingtrailName,
                    walkingtrailLocation: walkingtrailLocation,
                    countyName: countyName,
                    walkingtrailDistance: walkingtrailDistance,
                    walkingtrailDifficulty: walkingtrailDifficulty,
                    walkingtrailDescription: walkingtrailDescription,
                },
                type: QueryTypes.INSERT,
            }
        )
        return res
            .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/walkingtrail/${newWalkingtrailId}`)
            .sendStatus(201);
    } else {
        throw new UnauthorizedError('You do not have permission for this action!')
    }
}

exports.updateWalkintrailById = async (req, res) => {

    if (req.user.role !== userRoles.USER) {

        const walkingtrailId = req.params.walkingtrailId;

        const [walkingtrailToUpdate, walkingtrailMeta] = await sequelize.query(`
        SELECT * FROM walkingtrail WHERE walkingtrail_id = $walkingtrailId
        `,
            {
                bind: {
                    walkingtrailId: walkingtrailId,
                },
                type: QueryTypes.SELECT,
            }),

        const walkingtrailName = req.body.walkingtrailName;
        const walkingtrailLocation = req.body.walkingtrailLocation;
        const countyName = req.body.countyName;
        const walkingtrailDistance = req.body.walkingtrailDistance;
        const walkingtrailDifficulty = req.body.walkingtrailDifficulty;
        const walkingtrailDescription = req.body.walkingtrailDescription;

        const [updateWalkingtrail, metadata] = await sequelize.query(
            `
                    UPDATE walkingtrail SET name = $walkingtrailName, location = $walkingtrailLocation, fk_county_id = (SELECT county_id FROM county WHERE name = $countyName), distance = $walkingtrailDistance, difficulty = $walkingtrailDifficulty, description = $walkingtrailDescription 
                    WHERE walkingtrail_id = $walkingtrailId RETURNING *;
                    `,
            {
                bind: {
                    walkingtrailId: walkingtrailId,
                    walkingtrailName: walkingtrailName,
                    walkingtrailLocation: walkingtrailLocation,
                    countyName: countyName,
                    walkingtrailDistance: walkingtrailDistance,
                    walkingtrailDifficulty: walkingtrailDifficulty,
                    walkingtrailDescription: walkingtrailDescription,
                },
                type: QueryTypes.UPDATE,
            }
        );
        return res.json(updateWalkingtrail)

    } else {
        throw new UnauthorizedError('You do not have permission for this action!')
    };

};

exports.deleteWalkingtrailById = async (req, res) => {

    const walkingtrialId = req.params.walkingtrailId;

    if (req.user.role !== userRoles.USER) {

        const [walkingtrailId, metadata] = await sequelize.query(
            `
    		SELECT * FROM walkingtrail WHERE walkingtrail_id = $walkingtrailId
    		LIMIT 1
    	    `,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.SELECT,
            }
        )

        if (!walkingtrailId) {
            throw new NotFoundError('We could not find the walkingtrail you are looking for')
        }

        await sequelize.query(`DELETE FROM walkingtrail WHERE walkingtrail_id = $walkingtrialId;`, {
            bind: { walkingtrailId: walkingtrailId },
            type: QueryTypes.DELETE,
        })

        await sequelize.query(`DELETE FROM review WHERE fk_walkingtrail_id = $walkingtrailId;`, {
            bind: { walkingtrailId: walkingtrailId },
            type: QueryTypes.DELETE,
        })

        return res.sendStatus(204)

    } else {
        throw new UnauthorizedError('You do not have permission to delete this walkingtrail')
    }
}