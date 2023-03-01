const { sequelize } = require('./config')
const { reviews } = require('./mockData/reviews')
const { walkingtrails } = require('./mockData/walkingTrails')
const { users } = require('./mockData/users')
const { countys } = require('./mockData/countys')
const { roles } = require('./mockData/roles')

const seedWalkingtrailsDb = async () => {
    try {

        // TABLES

        // Drop tables if exist
        await sequelize.query(`DROP TABLE IF EXISTS role;`)
        await sequelize.query(`DROP TABLE IF EXISTS county;`)
        await sequelize.query(`DROP TABLE IF EXISTS user;`)
        await sequelize.query(`DROP TABLE IF EXISTS walkingtrail;`)
        await sequelize.query(`DROP TABLE IF EXISTS review;`)

        // Create role table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS role (
            role_id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL UNIQUE
        );
        `)

        // Create county table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS county (
            county_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        `)

        // Create user table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            fk_role_id INTEGER NOT NULL,
            FOREIGN KEY(fk_role_id) REFERENCES role(role_id)
        );
        `)

        // Create walkingtrail table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS walkingtrail (
            walkingtrail_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            location TEXT,
            fk_county_id INTEGER NOT NULL,
            FOREIGN KEY(fk_county_id) REFERENCES county(county_id),
            distance INTEGER,
            difficulty TEXT,
            description TEXT,
        );
        `)

        // Create review table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS review (
            review_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fk_user_id INTEGER NOT NULL,
            FOREIGN KEY(fk_user_id) REFERENCES user(user_id),
            title TEXT NOT NULL,
            description TEXT,
            rating INTEGER NOT NULL,
            fk_walkingtrail_id INTEGER NOT NULL,
            FOREIGN KEY(fk_walkingtrail_id) REFERENCES walkingtrail(walkingtrail_id),
        );
        `)

        // ROLE

        let roleInsertQuery = 
            'INSERT INTO role (role) VALUES '
        
        let roleInsertQueryVars = []

        roles.forEach((role, index, array) => {
            let string = '('
            for (let i = 1; i < 2; i++) {
                string += `$${roleInsertQueryVars.length + i}`
                if (i < 1) string + ','
            }

            roleInsertQuery += string + ')'
            if (index < array.length -1) roleInsertQuery += ','

            const variables = [
                role.role,
            ]
            roleInsertQueryVars = [...roleInsertQueryVars, ...variables]
        })
        roleInsertQuery += ';'

        await sequelize.query(roleInsertQuery, {
            bind: roleInsertQueryVars,
        })

        // för FK ska funka och man kan koppla ihop tabeller
        const [rolesRes, rolesData] = await sequelize.query('SELECT role, role_id FROM role')



        // COUNTY

        let countyInsertQuery = 
        'INSERT INTO county (name) VALUES '
    
        let countyInsertQueryVars = []

        countys.forEach((county, index, array) => {
        let string = '('
        for (let i = 1; i < 2; i++) {
            string += `$${countyInsertQueryVars.length + i}`
            if (i < 1) string + ','
        }

        countyInsertQuery += string + ')'
        if (index < array.length -1) countyInsertQuery += ','

        const variables = [
            county.name,
        ]
        countyInsertQueryVars = [...countyInsertQueryVars, ...variables]
    })
    countyInsertQuery += ';'

    await sequelize.query(countyInsertQuery, {
        bind: countyInsertQueryVars,
    })

    const [countysRes, countysData] = await sequelize.query('SELECT name, county_id FROM county')


    // USER

    let userInsertQuery = 
    'INSERT INTO user (name, description, email, password, fk_role_id) VALUES '

    let userInsertQueryVars = []

    users.forEach((user, index, array) => {
    let string = '('
    for (let i = 1; i < 6; i++) {
        string += `$${userInsertQueryVars.length + i}`
        if (i < 5) string + ','
    }

    userInsertQuery += string + ')'
    if (index < array.length -1) userInsertQuery += ','

    const variables = [
        user.name,
        user.description,
        user.email,
        user.password,
    ]

    const roleId = rolesRes.find((r) => r.role === user.role)
    variables.push(roleId.role_id)

    userInsertQueryVars = [...userInsertQueryVars, ...variables]
    })
    userInsertQuery += ';'

    await sequelize.query(userInsertQuery, {
    bind: userInsertQueryVars,
    })

    const [usersRes, usersData] = await sequelize.query('SELECT name, user_id FROM user')


    // WALKINGTRAIL


    let walkingtrailInsertQuery = 
    'INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description) VALUES '

    let walkingtrailInsertQueryVars = []

    walkingtrails.forEach((walkingtrail, index, array) => {
    let string = '('
    for (let i = 1; i < 7; i++) {
        string += `$${walkingtrailInsertQueryVars.length + i}`
        if (i < 6) string + ','
    }

    walkingtrailInsertQuery += string + ')'
    if (index < array.length -1) walkingtrailInsertQuery += ','

    const variables = [
        walkingtrail.name,
        walkingtrail.location,
    ]

    const countyId = countysRes.find((c) => c.name === walkingtrail.county)
    variables.push(countyId.county_id)

    varibles.push(walkingtrail.distance, walkingtrail.difficulty, walkingtrail.description)

    walkingtrailInsertQueryVars = [...walkingtrailInsertQueryVars, ...variables]
    })
    walkingtrailInsertQuery += ';'

    await sequelize.query(walkingtrailInsertQuery, {
    bind: walkingtrailInsertQueryVars,
    })

    const [walkingtrailssRes, walkingtrailsData] = await sequelize.query('SELECT name, walkingtrail_id FROM walkingtrail')



    // REVIEW

    
    let reviewInsertQuery = 
    'INSERT INTO review (fk_user_id, title, description, rating, fk_walkingtrail_id) VALUES '

    let reviewInsertQueryVars = []

    reviews.forEach((review, index, array) => {
    let string = '('
    for (let i = 1; i < 6; i++) {
        string += `$${reviewInsertQueryVars.length + i}`
        if (i < 5) string + ','
    }

    reviewInsertQuery += string + ')'
    if (index < array.length -1) reviewInsertQuery += ','

    const variables = []

    const userId = usersRes.find((u) => u.name === review.user)
    variables.push(userId.user_id)

    varibles.push(review.title, review.description, review.rating)

    const walkingtrailId = walkingtrailsRes.find((w) => w.name === review.walkingtrail)
    variables.push(walkingtrailId.walkingtrail_id)


    reviewInsertQueryVars = [...reviewInsertQueryVars, ...variables]
    })
    reviewInsertQuery += ';'

    await sequelize.query(reviewInsertQuery, {
    bind: reviewInsertQueryVars,
    })


    } catch (error) {
        // Log any eventual errors to Terminal
        console.error(error)
    } finally {
        // End Node process
        process.exit(0)
    }
}
    
seedPresidentsDb()
