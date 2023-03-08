const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

exports.getAllWalkingtrails = async (req, res) => {
    const [results, metadata] = await sequelize.query(`
        SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, walkingtrail.location, walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description , county.county_id AS countyId, county.name FROM walkingtrail 
        LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id LIMIT 10;
    `);

    return res.json(results);
};

exports.getWalkingtrailById = async (req, res) => {
    const walkingtrailId = req.params.walkingtrailId;

    const [results, metadata] = await sequelize.query(
        `
            SELECT walkingtrail.walkingtrail_id AS walkingtrailId, walkingtrail.name, walkingtrail.location, walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description , county.county_id AS countyId, county.name FROM walkingtrail 
            LEFT JOIN county ON walkingtrail.fk_county_id = county.county_id
			WHERE walkingtrailId = $walkingtrailId LIMIT 1;
		`,
        {
            bind: { walkingtrailId: walkingtrailId },
            type: QueryTypes.SELECT,
        }
    );

    if (!results || results.length == 0) {
        throw new NotFoundError(
            "We could not find the walkingtrail you are looking for"
        );
    }

    return res.json(results);
};

exports.createNewWalkingtrail = async (req, res) => {
    if (req.user.role !== userRoles.USER) {
        const walkingtrailName = req.body.walkingtrailName;
        const walkingtrailLocation = req.body.walkingtrailLocation;
        const countyName = req.body.countyName;
        const walkingtrailDistance = req.body.walkingtrailDistance;
        const walkingtrailDifficulty = req.body.walkingtrailDifficulty;
        const walkingtrailDescription = req.body.walkingtrailDescription;

        const [newWalkingtrailId] = await sequelize.query(
            `
                INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description) 
                VALUES ($walkingtrailName, $walkingtrailLocation, (SELECT county_id FROM county WHERE name = $countyName), $walkingtrailDistance, $walkingtrailDifficulty, $walkingtrailDescription); 
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
        );
        return res
            .setHeader(
                "Location",
                `${req.protocol}://${req.headers.host}/api/v1/walkingtrail/${newWalkingtrailId}`
            )
            .sendStatus(201);
    } else {
        throw new UnauthorizedError("You do not have permission for this action!");
    }
};

exports.updateWalkintrailById = async (req, res) => {

    if (req.user.role !== userRoles.USER) {
        const walkingtrailId = req.params.walkingtrailId;
        const walkingtrailName = req.body.walkingtrailName;
        const walkingtrailLocation = req.body.walkingtrailLocation;
        // const countyName = req.body.countyName;
        const walkingtrailDistance = req.body.walkingtrailDistance;
        const walkingtrailDifficulty = req.body.walkingtrailDifficulty;
        const walkingtrailDescription = req.body.walkingtrailDescription;

        const [walkingtrail] = await sequelize.query(
            `
                SELECT * FROM walkingtrail WHERE walkingtrail_id = $walkingtrailId LIMIT 1;
            `,
            {
                bind: {
                    walkingtrailId: walkingtrailId,
                },
                type: QueryTypes.SELECT,
            }
        );

        if (!walkingtrail) {
            throw new NotFoundError(
                "We could not find the walking trail you are looking for"
            );
        }

        if (walkingtrailName) {
            await sequelize.query(
                `
            UPDATE walkingtrail SET name = $walkingtrailName
            WHERE walkingtrail.walkingtrail_id = $walkingtrailId; 
        `,

                {
                    bind: {
                        walkingtrailId: walkingtrailId,
                        walkingtrailName: walkingtrailName,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }

        if (walkingtrailLocation) {
            await sequelize.query(
                `
                UPDATE walkingtrail SET location = $walkingtrailLocation
                WHERE walkingtrail.walkingtrail_id = $walkingtrailId; 
            `,

                {
                    bind: {
                        walkingtrailId: walkingtrailId,
                        walkingtrailLocation: walkingtrailLocation,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }
        // if (countyName) {
        //     await sequelize.query(
        //         `
        //         UPDATE walkingtrail SET fk_county_id = (SELECT county_id FROM county WHERE name = $countyName)
        //         WHERE walkingtrail.walkingtrail_id = $walkingtrailId; 
        //     `,

        //         {
        //             bind: {
        //                 walkingtrailId: walkingtrailId,
        //                 countyName: countyName,
        //             },
        //             type: QueryTypes.UPDATE,
        //         }
        //     );
        // }

        // if (!countyName) {
        //     throw new NotFoundError(
        //         "We could not find the walking trail you are looking for"
        //     );
        // }

        if (walkingtrailDistance) {
            await sequelize.query(
                `
            UPDATE walkingtrail SET distance = $walkingtrailDistance
            WHERE walkingtrail.walkingtrail_id = $walkingtrailId; 
        `,

                {
                    bind: {
                        walkingtrailId: walkingtrailId,
                        walkingtrailDistance: walkingtrailDistance,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }

        if (walkingtrailDifficulty) {
            await sequelize.query(
                `
            UPDATE walkingtrail SET difficulty = $walkingtrailDifficulty
            WHERE walkingtrail.walkingtrail_id = $walkingtrailId; 
        `,

                {
                    bind: {
                        walkingtrailId: walkingtrailId,
                        walkingtrailDifficulty: walkingtrailDifficulty,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }

        if (walkingtrailDescription) {
            await sequelize.query(
                `
            UPDATE walkingtrail SET description = $walkingtrailDescription
            WHERE walkingtrail.walkingtrail_id = $walkingtrailId; 
        `,

                {
                    bind: {
                        walkingtrailId: walkingtrailId,
                        walkingtrailDescription: walkingtrailDescription,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }

        return res.json("Walking trail was successfully updated");

    } else {
        throw new UnauthorizedError("You do not have permission for this action!");
    }
};

exports.deleteWalkingtrailById = async (req, res) => {
    const walkingtrailId = req.params.walkingtrailId;

    if (req.user.role !== userRoles.USER) {
        await sequelize.query(
            `
    		SELECT * FROM walkingtrail WHERE walkingtrail_id = $walkingtrailId
    		LIMIT 1;
    	    `,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.SELECT,
            }
        );

        if (!walkingtrailId) {
            throw new NotFoundError(
                "We could not find the walkingtrail you are looking for"
            );
        }

        await sequelize.query(
            `DELETE FROM walkingtrail WHERE walkingtrail_id = $walkingtrailId
        LIMIT 1;`,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.DELETE,
            }
        );

        await sequelize.query(
            `DELETE FROM review WHERE fk_walkingtrail_id = $walkingtrailId;`,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.DELETE,
            }
        );

        return res.sendStatus(204);
    } else {
        throw new UnauthorizedError(
            "You do not have permission to delete this walkingtrail"
        );
    }
};
