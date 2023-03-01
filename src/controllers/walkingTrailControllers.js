const { QueryTypes } = require('sequelize')
const { userRoles } = require('../constants/users')
const { sequelize } = require('../database/config')
const { UnauthorizedError, NotFoundError } = require('../utils/errors')

exports.getAllWalkingtrails = async (req, res) => {
    let query
    let options = {}
    if (req.user.role === userRoles.ADMIN) {
        query = `
      SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, county.county_id AS countyId, county.name FROM walkingtrail 
      LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id
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
			SELECT wt.walkingtrail_id, walkingtrail.name, r.title, r.rating 
			FROM walkingtrail wt 
				LEFT JOIN review r ON r.fk_walkingtrail_id = wt.walkingtrail_id
			WHERE wt.walkingtrail_id = $walkingtrialId;
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
    const { name } = req.body

    const [newWalkingtrailId] = await sequelize.query('INSERT INTO walkingtrail (name) VALUES ($walkingtrailName);', {
        bind: { walkingtrailName: name },
        type: QueryTypes.INSERT, // returns ID of created row
    })

    // prettier-ignore
    await sequelize.query(`
    INSERT INTO walkingtrail (fk_users_id, fk_lists_id, fk_roles_id) 
    VALUES ($userId, $walkingtrailId, (SELECT role_id FROM role WHERE role = 'COUNTY')) 
  `,
        {
            bind: {
                userId: req.user.userId,
                walkingtrialId: newWalkingtrailId,
            },
        }
    )
    // prettier-ignore
    return res
        .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/walkingtrail/${newWalkingtrailId}`)
        .sendStatus(201)
}

exports.deleteWalkingtrailById = async (req, res) => {
    const walkingtrialId = req.params.walkingtrialId

    if (req.user.role !== userRoles.ADMIN) {
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
            throw new UnauthorizedError('You do not have permission to delete this walkingtrial')
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