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
        await sequelize.query(`DROP TABLE IF EXISTS walking_trail;`)
        await sequelize.query(`DROP TABLE IF EXISTS review;`)

        // Create role table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS role (
            role_id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL
        );
        `)

        // Create county table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS county (
            county_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
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

        // Create walking_trail table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS walking_trail (
            walking_trail_id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            fk_walking_trail_id INTEGER NOT NULL,
            FOREIGN KEY(fk_walking_trail_id) REFERENCES walking_trail(walking_trail_id),
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
    'INSERT INTO walking_trail (name, location, fk_county_id, distance, difficulty, description) VALUES '




    // REVIEW


    } catch (error) {
        // Log any eventual errors to Terminal
        console.error(error)
    } finally {
        // End Node process
        process.exit(0)
    }
}
    
seedPresidentsDb()
