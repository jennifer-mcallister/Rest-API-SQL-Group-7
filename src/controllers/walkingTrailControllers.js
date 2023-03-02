const { QueryTypes } = require('sequelize')
const { userRoles } = require('../constants/users')
const { sequelize } = require('../database/config')
const { UnauthorizedError, NotFoundError } = require('../utils/errors')

exports.getAllWalkingtrails = async (req, res) => {
    let query
    let options = {}
    if (req.user.role === userRoles.ADMIN) {
        query = `
        SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, walkingtrail.location, walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description , county.county_id AS countyId, county.name FROM walkingtrail 
        LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id;
    `
        // } if (req.user.role === userRoles.COUNTY) {
        //     query = `
        //   SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, user.user_id AS userId, user.name, roles.role FROM walkingtrail 
        //   LEFT JOIN user ON walkingtrail.walkingtrail_id = users_lists.fk_lists_id 
        //   LEFT JOIN users ON users_lists.fk_users_id = users.id
        //   LEFT JOIN roles ON roles.id = users_lists.fk_roles_id;
        // `
    } else {
        //     query = `
        //   SELECT walkingtrail.id AS walkingtrailId, walkingtrail.name,
        //   county.county_id AS countyId, county.name FROM walkingtrail 
        //   LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id 
        //   WHERE users_lists.fk_users_id = $userId;
        // `
        //     options.bind = { userId: req.user.userId }
    }
    const [results, metadata] = await sequelize.query(query, options)

    return res.json(results)
}

exports.getWalkingtrailById = async (req, res) => {
    const walkingtrailId = req.params.walkingtrailId

    const [results, metadata] = await sequelize.query(
        `
            SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, walkingtrail.location, walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description , county.county_id AS countyId, county.name FROM walkingtrail 
            LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id
			WHERE walkingtrailId = $walkingtrialId;
		`,
        {
            bind: { walkingtrailId: walkingtrailId },
        }
    )

    if (!results || results.length == 0) {
        throw new NotFoundError('We could not find the walkingtrail you are looking for')
    }

    // const walkingtrailResponse = {
    //     walkingtrailId: walkingtrailId,
    //     // @ts-ignore
    //     walkingtrailName: results[0].name,
    //     review: results.map((wtReview) => {
    //         // @ts-ignore
    //         return { wtReview.title}
    //     }),
    // }

    return res.json(results)
}

exports.createNewWalkingtrail = async (req, res) => {
    let query
    let options = {}
    if (req.user.role !== userRoles.USER) {
        const { name } = req.body

        const [newWalkingtrailId] = await sequelize.query('INSERT INTO walkingtrail (name) VALUES ($walkingtrailName);', {
            bind: { walkingtrailName: name },
            type: QueryTypes.INSERT, // returns ID of created row
        })

        // prettier-ignore
        query = await sequelize.query(`
        INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description) 
        VALUES ($walkingtrailName, $walkingtrailLocation, (SELECT fk_county_id FROM county WHERE name = $countyName), $walkingtrailDistance, $walkingtrailDifficulty, $walkingtrailDescription) 
      `,
            {
                bind: {
                    walkingtrailName: newWalkingtrailName,
                    walkingtrailLocation: newWalkingtrailLocation,
                    countyName: req.county.name,
                    walkingtrailDistance: newWalkingtrailDistance,
                    walkingtrailDifficulty: newWalkingtrailDifficulty,
                    walkingtrailDescription: walkingtrailDescription,
                },
            }
        )
        return res
            .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/walkingtrail/${newWalkingtrailId}`)
            .sendStatus(201)


        const [results, metadata] = await sequelize.query(query, options)


    }
}

exports.deleteWalkingtrailById = async (req, res) => {
    const walkingtrialId = req.params.walkingtrialId

    if (req.user.role !== userRoles.USER) {
        const [userWalkingtrailRole, userWalkingtrailRoleMeta] = await sequelize.query(
            `
			SELECT r.role 
			FROM user u
				JOIN role r ON r.role_id = u.fk_role_id 
			WHERE u.fk_lists_id = $listId AND fk_users_id = $userId 
			LIMIT 1
		`,
            {
                bind: { listId: listId, userId: req.user.userId },
                type: QueryTypes.SELECT,
            }
        )

        if (!userWalkingtrailRole) {
            throw new NotFoundError('We could not find the walkingtrail you are looking for')
        }

        // @ts-ignore
        if (userWalkingtrailRole?.role !== userRoles.COUNTY || userRoles.ADMIN) {
            throw new UnauthorizedError('You do not have permission to delete this walkingtrail')
        }
    }

    await sequelize.query(`DELETE FROM Walkingtrail WHERE walkingtrail_id = $walkingtrailId;`, {
        bind: { walkingtrailId: walkingtrailId },
        type: QueryTypes.DELETE,
    })

    await sequelize.query(`DELETE FROM review WHERE fk_walkingtrail_id = $walkingtrailId;`, {
        bind: { walkingtrailId: walkingtrailId },
    })

    // await sequelize.query(`DELETE FROM walkingtrail WHERE walkingttrail_id = $walkingtrailId;`, {
    //     bind: { walkingtrailId: walkingtrailId },
    //     type: QueryTypes.DELETE,
    // })

    return res.sendStatus(204)
}