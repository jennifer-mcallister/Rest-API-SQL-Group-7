const { sequelize } = require("./config");
const { reviews } = require("./mockData/reviews");
const { walkingtrails } = require("./mockData/walkingTrails");
const { users } = require("./mockData/users");
const { countys } = require("./mockData/countys");
const { roles } = require("./mockData/roles");

const seedWalkingtrailsDb = async () => {
  try {
    // TABLES

    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS role;`);
    await sequelize.query(`DROP TABLE IF EXISTS county;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS walkingtrail;`);
    await sequelize.query(`DROP TABLE IF EXISTS review;`);

    // Create role table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS role (
            role_id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL UNIQUE
        );
        `);

    // Create county table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS county (
            county_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        `);

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
        `);

    // Create walkingtrail table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS walkingtrail (
            walkingtrail_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            location TEXT,
            fk_county_id INTEGER NOT NULL,
            distance INTEGER,
            difficulty TEXT,
            description TEXT,

            FOREIGN KEY(fk_county_id) REFERENCES county(county_id)
        );
        `);

    // Create review table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS review (
            review_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fk_user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            rating INTEGER NOT NULL,
            fk_walkingtrail_id INTEGER NOT NULL,

            FOREIGN KEY(fk_user_id) REFERENCES user(user_id),
            FOREIGN KEY(fk_walkingtrail_id) REFERENCES walkingtrail(walkingtrail_id)
        );
        `);

    // ROLE

    await sequelize.query(
      `INSERT INTO users (email, password) VALUES 
            ('testus@gmail.com','testar123', 1), 
            ('jessica.tan@gmail.com', 'password456',0), 
            ('mikael.rönnberg@gmail.com','password789',0), 
            ('jennifer.mcallister@gmail.com','password123',0)`
    );

    await sequelize.query(
      `INSERT INTO citys (city_name) VALUES ('Stockholm'), ('Malmö'), ('Göteborg')`
    );

    await sequelize.query(`INSERT INTO stores 
          (store_name, address, fk_citys_id, fk_users_id) 
          VALUES 
          ('Ica Supermarket Alvikstorg', 'Gustavslundsvägen 22', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), 5),
          ('Lidl Göteborg', 'Kungsgatan 16', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 6),
          ('Lidl Medborgarplatsen', 'Folkungagatan 51', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), 5), 
          ('Coop Hötorget', 'T-station Hötorget', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), userid), 
          ('ICA Supermarket Majorna','Karl Johansgatan 21', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 7),
          ('Stora Coop Stadion','Stadiongatan 24', (SELECT id FROM citys c WHERE city_name = 'Malmö'), 5),
          ('Ica Supermarket Hansa',' Stora Nygatan', (SELECT id FROM citys c WHERE city_name = 'Malmö'), 6),
          ('Hemköp Triangeln',' Södra Förstadsgatan 58',(SELECT id FROM citys c WHERE city_name = 'Malmö') , 7), 
          ('ICA Supermarket Olskroken',' Redbergsvägen 14', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 7),
          ('Coop Mölndalsvägen','Mölndalsvägen 1', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 6)`);

    console.log("Database successfully populated with data");
  } catch (error) {
    // Log any eventual errors to Terminal
    console.error(error);
  } finally {
    // End Node process
    process.exit(0);
  }
};

seedWalkingtrailsDb();
