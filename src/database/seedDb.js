const { sequelize } = require("./config");
const { reviews } = require("./mockData/reviews");
const { walkingtrails } = require("./mockData/walkingTrails");
const { users } = require("./mockData/users");
const { countys } = require("./mockData/countys");
const { roles } = require("./mockData/roles");
const bcrypt = require("bcrypt");

const seedWalkingtrailsDb = async () => {
  try {
    // TABLES

    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS walkingtrail;`);
    await sequelize.query(`DROP TABLE IF EXISTS county;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS role;`);
    // Create role table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS role (
            role_id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL 
        );
        `);

    // Create county table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS county (
            county_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL 
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

    await sequelize.query(
      `INSERT INTO county (name) VALUES ('Stockholm'), ('Vasternorrland'), ('Abisko')`
    );

    await sequelize.query(
      `INSERT INTO role (role) VALUES ('ADMIN'), ('COUNTY'), ('USER')`
    );

    await sequelize.query(
      `INSERT INTO user (name, description, email, password, fk_role_id) VALUES 
            ('Bob', 'Big fan of nature', 'bobby123@mail.com', 'password', (SELECT role_id FROM role r WHERE role = 'USER')), 
            ('Frans', 'Forest lover', 'forest_frans@mail.com', 'password', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Karen', 'Mother nature', 'karen@mail.com', 'password', (SELECT role_id FROM role r WHERE role = 'COUNTY')),
            ('Boss', 'Big Boss', 'boss@mail.com', 'password', (SELECT role_id FROM role r WHERE role = 'ADMIN')),
            ('Anna', 'Love camping all year around', 'anna_maja@mail.com', 'password', (SELECT role_id FROM role r WHERE role = 'USER'))`
    );

    await sequelize.query(
      `INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description) VALUES 
      ('Sörmlandsleden', 'Vid sjön', (SELECT county_id FROM county c WHERE name = 'Stockholm'), 628, 'EASY',
      'En trevlig och lagom lång vandring med många härliga etapper. Framkomligheten är bra och passar de flesta som kan röra sig framåt. 
      En del av vandringen går genom städer men för det mesta är det skog. Bra med vatten och vindskydd, skyltar finns ofta till dessa.'),
      ('Roslagsleden', 'Vid skogen', (SELECT county_id FROM county c WHERE name = 'Stockholm'), 190, 'EASY',
      'Fin och enkel vandringsled, med fina turer kring antika vikingagravar. Har ni tur kan ni stöta på runstenar! 
      Framkomligheten kan variera vid vissa etapper men för det mesta går det bra. Lagom lång vandring!'), 
      ('Upplandsleden', 'Vid mystiska dalen', (SELECT county_id FROM county c WHERE name = 'Stockholm'), 234, 'MEDIUM',
      'Den berömda Upplandsleden, känd för sina hemsökta platser där den skrikande damen kan skymtas. Akta er för att passera Balders bro 
      vid midnatt för att undvika damen i vit klänning. Framkomligheten är därför anpassad för de med nerver av stål.'),
      ('Höga Kustenleden', 'Vid berget', (SELECT county_id FROM county c WHERE name = 'Vasternorrland'), 129, 'HARD',
      'En vandring för den med bättre fysik, här finns snabba höjningar och varierande terräng. 
      För den som däremot orkar ta sig förbi detta väntar otroliga miljöer, där vi har en sjö uppe på berget. 
      Varför inte se den berömda Slåttdalsskrevan det sägs att Ronja Rövardotter spelades in? (Vilket den inte gjorde)'),
      ('Rotsidan', 'Vid roten av roten', (SELECT county_id FROM county c WHERE name = 'Vasternorrland'), 211, 'EASY',
      'En trevlig och lagom lång vandring med många härliga etapper. Framkomligheten är bra och passar de flesta som kan röra sig framåt. 
      En del av vandringen går genom städer men för det mesta är det skog. Bra med vatten och vindskydd, skyltar finns ofta till dessa'),
      ('Helvetesbrännan', 'Vid Mordor', (SELECT county_id FROM county c WHERE name = 'Vasternorrland'), 666, 'HARD',
      'Utmaningen för den uthållige och mest tålige våghalsen. Ledet som kommer bränna dig hur mycket solskydd du än har. 
      Förutom myggen kanske bergsvärmen ställer till det för er campingplats. 
      Bortser ni från detta är det en relativt trevlig vandring med många etapper. Krävs ett gott humör!'),
      ('Rotenleden', 'Vid andra roten', (SELECT county_id FROM county c WHERE name = 'Vasternorrland'), 221, 'MEDIUM',
      'Ett led för den mest adlige! Förutom sin turistäta ansamling kan man umgås med mygg från våtmarken, 
      se vår berömda Kebnekaise eller bara njuta av den svenska fjällen. Varmt rekommenderad!'),
      ('Kungsleden', 'Vid monarkens led', (SELECT county_id FROM county c WHERE name = 'Abisko'), 1235, 'MEDIUM',
      'Ett led för den mest adlige! Förutom sin turistäta ansamling kan man umgås med mygg från våtmarken, 
      se vår berömda Kebnekaise eller bara njuta av den svenska fjällen. Varmt rekommenderad!'),
      ('Kärkevagge', 'Bland bergen', (SELECT county_id FROM county c WHERE name = 'Abisko'), 234, 'HARD',
      'En vandring som kommer likna den häftigaste fantasyboken du läst. Terräng som är svår, så välj dina vandringskängor med omsorg.'),
      ('Björkliden', 'Vid Betula pendula', (SELECT county_id FROM county c WHERE name= 'Abisko'), 622, 'EASY',
      'Saknar du att vandra bland samernas björkar, där de kommunicerar med sina förfädrar för att lära sig mer om naturen? Sök inte längre, 
      här på Björklidens vandringsled hittar du allt mellan Björkar och led utan att lida pin. 
      Lättillgänglig terräng med varierande höjdskillnader')`
    );

    await sequelize.query(
      `INSERT INTO review (fk_user_id, title, description, rating, fk_walkingtrail_id) VALUES 
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Måste testas', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Björkliden')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Helt ok', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the',
      2, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'UNDERBAR', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Höga Kustenleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Vacker och behaglig', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Höga Kustenleden')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Jag gör inte om detta..', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Bra men finns bättre.', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Helvetesbrännan')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Aldrig mer.', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotenleden')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Jag är ingen vandringsperson..', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Kärkevagge')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Magiskt och lugnande..', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Kul men inte för mig!', 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Helvetesbrännan')) `
    );

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
