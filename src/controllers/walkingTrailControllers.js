const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError, BadRequestError } = require("../utils/errors");

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
    const walkingtrailName = req.body.walkingtrail;
    const walkingtrailLocation = req.body.location || "Finns ingen angiven plats";
    let countyName = req.user.name;
    const walkingtrailDistance = req.body.distance || 0;
    const walkingtrailDifficulty = req.body.difficulty || "UNKNOWN";
    const walkingtrailDescription = req.body.description || "Finns ingen beskrivning";

    if ( req.user.role === userRoles.USER) {
        throw new UnauthorizedError('You do not have permission to create a walkingtrail')
    }

    if (!walkingtrailName) {
        throw new BadRequestError('Please fill in name for walkingtrail')
    }

    if(req.user.role === userRoles.ADMIN) {
        countyName = req.body.county;
        if(!countyName) {
            throw new BadRequestError('Please fill in county')
        }
    }

    
    const [county] = await sequelize.query(
        `
        SELECT county.name AS countyName
        FROM county
        WHERE countyName = $countyName;
        LIMIT 1
        `,
        {
            bind: { countyName: countyName},
            type: QueryTypes.SELECT,
        }
    )
    
    if (!county || county.length == 0) {
        throw new NotFoundError('County do not exists. Please enter an existing county')
    }

    if (req.user.role === userRoles.COUNTY && req.user.name !== countyName) {
        throw new UnauthorizedError('You do not have permission to create walkingtrail for this county')
    }

    const [walkingtrail] = await sequelize.query(
        `
        SELECT walkingtrail.name AS walkingtrailName
        FROM walkingtrail
        WHERE walkingtrailName = $walkingtrailName;
        LIMIT 1
        `,
        {
            bind: { walkingtrailName: walkingtrailName},
            type: QueryTypes.SELECT,
        }
    )
    
    if (walkingtrail) {
        throw new UnauthorizedError("Walkingtrail already exists, please enter an other name for your walkingtrail")
    }

    const [newWalkingtrail] = await sequelize.query(`INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description)
    VALUES ($walkingtrailName, $walkingtrailLocation, (SELECT county_id FROM county WHERE name = $countyName), $walkingtrailDistance, $walkingtrailDifficulty, $walkingtrailDescription);
    `,
    {
        bind: { walkingtrailName: walkingtrailName, walkingtrailLocation: walkingtrailLocation, countyName: countyName, walkingtrailDistance: walkingtrailDistance, walkingtrailDifficulty: walkingtrailDifficulty, walkingtrailDescription: walkingtrailDescription },
        type: QueryTypes.INSERT,
    })
 
    return res
        .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/walkingtrail/${newWalkingtrail}`)
        .sendStatus(201)
}

exports.updateWalkingtrailById = async (req, res) => {
    const walkingtrailId = req.params.walkingtrailId;
    const walkingtrailName = req.body.walkingtrail;
    const walkingtrailLocation = req.body.location;
    const walkingtrailDistance = req.body.distance;
    const walkingtrailDifficulty = req.body.difficulty;
    const walkingtrailDescription = req.body.description;

    if ( req.user.role !== userRoles.USER) {
        const [walkingtrail] = await sequelize.query(
            `
            SELECT  walkingtrail.walkingtrail_id as walkingtrailId, walkingtrail.fk_county_id as countyId, county.name AS countyName
            FROM walkingtrail
            LEFT JOIN county ON countyId = county.county_id
            WHERE walkingtrailId = $walkingtrailId;
            LIMIT 1
            `,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.SELECT,
            }
        )

        if (!walkingtrail || walkingtrail.length == 0) {
            throw new NotFoundError('We could not find the walkingtrail you are looking for')
        }

        if (req.user.role === userRoles.COUNTY && req.user.name !== walkingtrail.countyName) {
            throw new UnauthorizedError('You do not have permission to update walkingtrail for this county')
        }

    } else {

        throw new UnauthorizedError('You do not have permission to updated walkingtrails')
    }

    if (walkingtrailName) {
        await sequelize.query(`
        UPDATE walkingtrail
        SET name = $walkingtrailName
        WHERE walkingtrail.walkingtrail_id = $walkingtrailId;
        `,
        {
            bind: { walkingtrailName: walkingtrailName, walkingtrailId: walkingtrailId },
            type: QueryTypes.UPDATE,
        },
        )
    }

    if (walkingtrailLocation) {
        await sequelize.query(`
        UPDATE walkingtrail
        SET location = $walkingtrailLocation
        WHERE walkingtrail.walkingtrail_id = $walkingtrailId;
        `,
        {
            bind: { walkingtrailLocation: walkingtrailLocation, walkingtrailId: walkingtrailId },
            type: QueryTypes.UPDATE,
        },
        )
    }

    if (walkingtrailDistance) {
        await sequelize.query(`
        UPDATE walkingtrail
        SET distance = $walkingtrailDistance
        WHERE walkingtrail.walkingtrail_id = $walkingtrailId;
        `,
        {
            bind: { walkingtrailDistance: walkingtrailDistance, walkingtrailId: walkingtrailId },
            type: QueryTypes.UPDATE,
        },
        )
    }

    if (walkingtrailDifficulty) {
        await sequelize.query(`
        UPDATE walkingtrail
        SET difficulty = $walkingtrailDifficulty
        WHERE walkingtrail.walkingtrail_id = $walkingtrailId;
        `,
        {
            bind: { walkingtrailDifficulty: walkingtrailDifficulty, walkingtrailId: walkingtrailId },
            type: QueryTypes.UPDATE,
        },
        )
    }

    if (walkingtrailDescription) {
        await sequelize.query(`
        UPDATE walkingtrail
        SET description = $walkingtrailDescription
        WHERE walkingtrail.walkingtrail_id = $walkingtrailId;
        `,
        {
            bind: { walkingtrailDescription: walkingtrailDescription, walkingtrailId: walkingtrailId },
            type: QueryTypes.UPDATE,
        },
        )
    }

    return res.json("walkingtrail was succesfully updated")
}

exports.deleteWalkingtrailById = async (req, res) => {
    const walkingtrailId = req.params.walkingtrailId;

    if (req.user.role !== userRoles.USER) {
        const [walkingtrail] = await sequelize.query(
            `
            SELECT  walkingtrail.walkingtrail_id as walkingtrailId, walkingtrail.fk_county_id as countyId, county.name AS countyName
            FROM walkingtrail
            LEFT JOIN county ON countyId = county.county_id
            WHERE walkingtrailId = $walkingtrailId;
            LIMIT 1
    	    `,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.SELECT,
            }
        );

        if (!walkingtrail || walkingtrail.length == 0) {
            throw new NotFoundError(
                "We could not find the walkingtrail you are looking for"
            );
        }

        if (req.user.name !== walkingtrail.countyName && req.user.role === userRoles.COUNTY) {
            throw new UnauthorizedError('You do not have permission to delete this walkingtrail')
        }

        await sequelize.query(`
            DELETE FROM review 
            WHERE fk_walkingtrail_id = $walkingtrailId;
            `,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.DELETE,
            },
        );

        await sequelize.query(`
            DELETE FROM walkingtrail 
            WHERE walkingtrail_id = $walkingtrailId;
            `,
            {
                bind: { walkingtrailId: walkingtrailId },
                type: QueryTypes.DELETE,
            },
        );

        return res
        .json("walkingtrail was succesfully deleted")
        .sendStatus(204);

    } else {
        
        throw new UnauthorizedError(
            "You do not have permission to delete this walkingtrail"
        );
    }
};
