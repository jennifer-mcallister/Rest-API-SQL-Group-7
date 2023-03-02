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
    // await sequelize.query(`DROP TABLE IF EXISTS role;`);
    // await sequelize.query(`DROP TABLE IF EXISTS county;`);
    // await sequelize.query(`DROP TABLE IF EXISTS user;`);
    // await sequelize.query(`DROP TABLE IF EXISTS walkingtrail;`);
    // await sequelize.query(`DROP TABLE IF EXISTS review;`);

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
            ('Bob', 'Big fan of nature', 'bobby123@mail.com', 'secret', (SELECT role_id FROM role r WHERE role = 'USER')), 
            ('Frans', 'Forest lover', 'forest_frans@mail.com', 'secret', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Karen', 'Mother nature', 'karen@mail.com', 'secret', (SELECT role_id FROM role r WHERE role = 'COUNTY')),
            ('Boss', 'Big Boss', 'boss@mail.com', 'secret', (SELECT role_id FROM role r WHERE role = 'ADMIN')),
            ('Anna', 'Love camping all year around', 'anna_maja@mail.com', 'secret', (SELECT role_id FROM role r WHERE role = 'USER'))`
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
      `INSERT INTO review (review_id, fk_user_id, title, description, rating, fk_walkingtrail_id) VALUES 
      ('1', (SELECT user_id FROM user WHERE name = 'Bob'), 'Måste testas!', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the', 5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Sörmlandsleden')),
      (2, (SELECT user_id FROM user WHERE name = 'Frans'), 'Helt ok', '1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but', 3, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      (3, (SELECT user_id FROM user WHERE name = 'Karen'), 'UNDERBAR', 'Essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets', 5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandleden')),
      (4, (SELECT user_id FROM user WHERE name = 'Anna'), 'Vacker och behaglig', '1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem', 5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Höga Kustenleden')),
      (5, (SELECT user_id FROM user WHERE name = 'Boss'), 'Jag gör inte om detta...', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem', 2, (SELECT walkingtrail_id FROM walkingtrail WHERE name= 'Rotsidan')),
      (6, (SELECT user_id FROM user WHERE name = 'Boss'), 'Jag gör inte om detta...', 'is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable', 4, (SELECT walkingtrail_id FROM walkingtrail WHERE name= 'Helvetesbrännan')),
      (7, (SELECT user_id FROM user WHERE name = 'Karen'), 'Aldrig mer', 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum"', 0, (SELECT walkingtrail_id FROM walkingtrail WHERE name= 'Rotenledet')),
      (8, (SELECT user_id FROM user WHERE name = 'Frans'), 'Jag är ingen vandringsperson...', 'will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpos', 1, (SELECT walkingtrail_id FROM walkingtrail WHERE name= 'Höga Kustenleden')),
      (9, (SELECT user_id FROM user WHERE name = 'Anna'), 'Magiskt och lugnande', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over', 5, (SELECT walkingtrail_id FROM walkingtrail WHERE name= 'Kärkevagge')),
      (10, (SELECT user_id FROM user WHERE name = 'Bob'), 'Kul men inte för mig','2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words', 3, (SELECT walkingtrail_id FROM walkingtrail WHERE name= 'Björkliden'))`
    );


    // await sequelize.query(`INSERT INTO stores 
    //       (store_name, address, fk_citys_id, fk_users_id) 
    //       VALUES 
    //       ('Ica Supermarket Alvikstorg', 'Gustavslundsvägen 22', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), 5),
    //       ('Lidl Göteborg', 'Kungsgatan 16', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 6),
    //       ('Lidl Medborgarplatsen', 'Folkungagatan 51', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), 5), 
    //       ('Coop Hötorget', 'T-station Hötorget', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), userid), 
    //       ('ICA Supermarket Majorna','Karl Johansgatan 21', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 7),
    //       ('Stora Coop Stadion','Stadiongatan 24', (SELECT id FROM citys c WHERE city_name = 'Malmö'), 5),
    //       ('Ica Supermarket Hansa',' Stora Nygatan', (SELECT id FROM citys c WHERE city_name = 'Malmö'), 6),
    //       ('Hemköp Triangeln',' Södra Förstadsgatan 58',(SELECT id FROM citys c WHERE city_name = 'Malmö') , 7), 
    //       ('ICA Supermarket Olskroken',' Redbergsvägen 14', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 7),
    //       ('Coop Mölndalsvägen','Mölndalsvägen 1', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 6)`);

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
