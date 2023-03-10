const { sequelize } = require("./config");
const bcrypt = require("bcrypt");

const createHashedPassword = async (password) => {
  try {
    console.log("trying to hash");
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    return hashedpassword;
  } catch (err) {
    console.log(err);
  }
};

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
            rating INTEGER NOT NULL CHECK (rating IN (1, 2, 3, 4, 5)),
            fk_walkingtrail_id INTEGER NOT NULL,

            FOREIGN KEY(fk_user_id) REFERENCES user(user_id),
            FOREIGN KEY(fk_walkingtrail_id) REFERENCES walkingtrail(walkingtrail_id)
        );
        `);

    await sequelize.query(
      `INSERT INTO county (name) VALUES ('Stockholm'), ('V??sternorrland'), ('Abisko')`
    );

    await sequelize.query(
      `INSERT INTO role (role) VALUES ('ADMIN'), ('COUNTY'), ('USER')`
    );

    // BOB password
    const passwordBob = "secret";
    const newPasswordBob = await createHashedPassword(passwordBob);
    const newPasswordBobHash = newPasswordBob;

    // FRANS password
    const passwordFrans = "secret";
    const newPasswordFrans = await createHashedPassword(passwordFrans);
    const newPasswordFransHash = newPasswordFrans;

    // KAREN password
    const passwordKaren = "secret";
    const newPasswordKaren = await createHashedPassword(passwordKaren);
    const newPasswordKarenHash = newPasswordKaren;

    // BOSS password
    const passwordAdmin = "123";
    const newPasswordAdmin = await createHashedPassword(passwordAdmin);
    const newPasswordAdminHash = newPasswordAdmin;

    // ANNA password
    const passwordAnna = "secret";
    const newPasswordAnna = await createHashedPassword(passwordAnna);
    const newPasswordAnnaHash = newPasswordAnna;

    // MAY-BRITT password
    const passwordMaybritt = "secret";
    const newPasswordMaybritt = await createHashedPassword(passwordMaybritt);
    const newPasswordMaybrittHash = newPasswordMaybritt;

    // STOCKHOLM password
    const passwordStockholm = "secret";
    const newPasswordStockholm = await createHashedPassword(passwordStockholm);
    const newPasswordStockholmHash = newPasswordStockholm;

    // V??STERNORRLAND password
    const passwordVasternorrland = "secret";
    const newPasswordVasternorrland = await createHashedPassword(
      passwordVasternorrland
    );
    const newPasswordVasternorrlandHash = newPasswordVasternorrland;

    // ABISKO password
    const passwordAbisko = "secret";
    const newPasswordAbisko = await createHashedPassword(passwordAbisko);
    const newPasswordAbiskoHash = newPasswordAbisko;

    await sequelize.query(
      `INSERT INTO user (name, description, email, password, fk_role_id) VALUES 
            ('Bob', 'Stort fan av naturen', 'bobby123@mail.com', '${newPasswordBobHash}', (SELECT role_id FROM role r WHERE role = 'USER')), 
            ('Frans', 'Skogs??lskare', 'forest_frans@mail.com', '${newPasswordFransHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Karen', 'Moder Natur', 'karen@mail.com', '${newPasswordKarenHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('May-Britt', 'Gillar bilar och TV', 'brittan@mail.com', '${newPasswordMaybrittHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Boss', 'Big Boss', 'boss@mail.com', '${newPasswordAdminHash}', (SELECT role_id FROM role r WHERE role = 'ADMIN')),
            ('Anna', '??lskar att campa ??ret runt', 'anna_maja@mail.com', '${newPasswordAnnaHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Stockholm', 'Stockholm kommun', 'stockholm@mail.com', '${newPasswordStockholmHash}', (SELECT role_id FROM role r WHERE role = 'COUNTY')),
            ('V??sternorrland', 'V??sternorrland l??n', 'vasternorrland@mail.com', '${newPasswordVasternorrlandHash}', (SELECT role_id FROM role r WHERE role = 'COUNTY')),
            ('Abisko', 'Abisko', 'abisko@mail.com', '${newPasswordAbiskoHash}', (SELECT role_id FROM role r WHERE role = 'COUNTY'))
            `
    );

    await sequelize.query(
      `INSERT INTO walkingtrail (name, location, fk_county_id, distance, difficulty, description) VALUES 
      ('S??rmlandsleden', 'Vid sj??n', (SELECT county_id FROM county c WHERE name = 'Stockholm'), 628, 'EASY',
      'En trevlig och lagom l??ng vandring med m??nga h??rliga etapper. Framkomligheten ??r bra och passar de flesta som kan r??ra sig fram??t. 
      En del av vandringen g??r genom st??der men f??r det mesta ??r det skog. Bra med vatten och vindskydd, skyltar finns ofta till dessa.'),
      ('Roslagsleden', 'Vid skogen', (SELECT county_id FROM county c WHERE name = 'Stockholm'), 190, 'EASY',
      'Fin och enkel vandringsled, med fina turer kring antika vikingagravar. Har ni tur kan ni st??ta p?? runstenar! 
      Framkomligheten kan variera vid vissa etapper men f??r det mesta g??r det bra. Lagom l??ng vandring!'), 
      ('Upplandsleden', 'Vid mystiska dalen', (SELECT county_id FROM county c WHERE name = 'Stockholm'), 234, 'MEDIUM',
      'Den ber??mda Upplandsleden, k??nd f??r sina hems??kta platser d??r den skrikande damen kan skymtas. Akta er f??r att passera Balders bro 
      vid midnatt f??r att undvika damen i vit kl??nning. Framkomligheten ??r d??rf??r anpassad f??r de med nerver av st??l.'),
      ('H??ga Kustenleden', 'Vid berget', (SELECT county_id FROM county c WHERE name = 'V??sternorrland'), 129, 'HARD',
      'En vandring f??r den med b??ttre fysik, h??r finns snabba h??jningar och varierande terr??ng. 
      F??r den som d??remot orkar ta sig f??rbi detta v??ntar otroliga milj??er, d??r vi har en sj?? uppe p?? berget. 
      Varf??r inte se den ber??mda Sl??ttdalsskrevan det s??gs att Ronja R??vardotter spelades in? (Vilket den inte gjorde)'),
      ('Rotsidan', 'Vid roten av roten', (SELECT county_id FROM county c WHERE name = 'V??sternorrland'), 211, 'EASY',
      'En trevlig och lagom l??ng vandring med m??nga h??rliga etapper. Framkomligheten ??r bra och passar de flesta som kan r??ra sig fram??t. 
      En del av vandringen g??r genom st??der men f??r det mesta ??r det skog. Bra med vatten och vindskydd, skyltar finns ofta till dessa'),
      ('Helvetesbr??nnan', 'Vid Mordor', (SELECT county_id FROM county c WHERE name = 'V??sternorrland'), 666, 'HARD',
      'Utmaningen f??r den uth??llige och mest t??lige v??ghalsen. Ledet som kommer br??nna dig hur mycket solskydd du ??n har. 
      F??rutom myggen kanske bergsv??rmen st??ller till det f??r er campingplats. 
      Bortser ni fr??n detta ??r det en relativt trevlig vandring med m??nga etapper. Kr??vs ett gott hum??r!'),
      ('Rotenleden', 'Vid andra roten', (SELECT county_id FROM county c WHERE name = 'V??sternorrland'), 221, 'MEDIUM',
      'Ett led f??r den mest adlige! F??rutom sin turist??ta ansamling kan man umg??s med mygg fr??n v??tmarken, 
      se v??r ber??mda Kebnekaise eller bara njuta av den svenska fj??llen. Varmt rekommenderad!'),
      ('Kungsleden', 'Vid monarkens led', (SELECT county_id FROM county c WHERE name = 'Abisko'), 1235, 'MEDIUM',
      'Ett led f??r den mest adlige! F??rutom sin turist??ta ansamling kan man umg??s med mygg fr??n v??tmarken, 
      se v??r ber??mda Kebnekaise eller bara njuta av den svenska fj??llen. Varmt rekommenderad!'),
      ('K??rkevagge', 'Bland bergen', (SELECT county_id FROM county c WHERE name = 'Abisko'), 234, 'HARD',
      'En vandring som kommer likna den h??ftigaste fantasyboken du l??st. Terr??ng som ??r sv??r, s?? v??lj dina vandringsk??ngor med omsorg.'),
      ('Bj??rkliden', 'Vid Betula pendula', (SELECT county_id FROM county c WHERE name= 'Abisko'), 622, 'EASY',
      'Saknar du att vandra bland samernas bj??rkar, d??r de kommunicerar med sina f??rf??drar f??r att l??ra sig mer om naturen? S??k inte l??ngre, 
      h??r p?? Bj??rklidens vandringsled hittar du allt mellan Bj??rkar och led utan att lida pin. 
      L??ttillg??nglig terr??ng med varierande h??jdskillnader')`
    );

    await sequelize.query(
      `INSERT INTO review (fk_user_id, title, description, rating, fk_walkingtrail_id) VALUES 
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Bj??rk??lskare titta hit!', 
      'Det h??r ??r paradiset f??r den som ??lskar Bj??rkar. Tips! Ta med h??ngmatta och stormk??k och koka dig sj??lv lite Bj??rkbladste', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Bj??rkliden')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'H??ftigt st??lle', 
      'Otrolig milj??, men ta med ficklampa!',
      2, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'UNDERBAR', 
      'Fin natur och roliga utmaningar. Sj??ng Ronja R??vardotter l??ten p?? Sl??ttdalsskrevan, varmt rekommenderat!', 
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'H??ga Kustenleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Vacker och behaglig', 
      'S?? mysigt <3 Kommer g?? den h??r igen! Wow <3 ', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'H??ga Kustenleden')),
      ((SELECT user_id FROM user WHERE name = 'May-Britt'), 'Nej', 
      'Fanns ingen toa.', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Bra men finns b??ttre.', 
      'Bra vandringsled.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Helvetesbr??nnan')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Aldrig mer.', 
      'Fett najs st??lle! Grillade korv p?? berget sen hitta jag en ring som l??s i elden s?? jag tog med mig den hem.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotenleden')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Fin natur', 
      'Naturen ??r fin. Bra v??gar. Lugnt och v??ldigt rent, men det b??rjade regna och jag hade inget parapaly', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'K??rkevagge')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Helt okej', 
      'Hade velat ha mer skog, men bra v??gar och skyltat', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Kul men inte f??r mig!', 
      'N??gon borde ta bort den d??r dimmen, kunde jue inte se n??nting. D??lig service.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Helvetesbr??nnan')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'D??lig service.', 
      'Tyckte inte att det var s?? v??rst organiserat, skulle g??rna vilja prata med managern', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'S??rmlandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'J??ttebra f??r nyb??rjar', 
      'S?? mysigt med skog och s??nt, prova caf??t i byn 10/10. Inte j??ttekul att bli biten av en m??s, annars hade det varit 5 stj??rnor fr??n mig. K??rlek <3', 
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'S??rmlandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Bra', 
      'Den va bra.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'S??rmlandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'GRYMT VANDRINGSLED', 
      'Helt sjukt! Hittade massa stenar som stod i en cirkel, sen l??g det en hj??lm och n??n slags yxa d??r, s?? jag tog med mig den hem! Nu ska det sk??ras k??tt och dricka hembr??nt.',
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'S?? fint', 
      'S?????? fint, kunde verkligen k??nna naturen i kroppen och finna mitt inre ro. Blev dock lite f??rskr??ckt n??r jag s??g en man springa in skogan med en yxa, men lite h??rligt ??nd?? med energifyllda sj??lar',
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'S??g d??den i ??gonen', 
      'Idag s??g jag d??den i ??gonen, men jag ??verlevde. Jag gick l??ngs grusv??gen upp till runstenarna och d??r stod ett sp??ke. Han plocka upp en yxa och skrek. Han t??nkte d??da mig, men jag anv??nda mina spirituellakrafter f??r att jaga honom in skogen. Jag ??r en survivor',
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'May-Britt'), 'D??ligt', 
      'Man fick inte r??ka, d??ligt.', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Najs st??lle', 
      'Tr??ffade n??n brud vid en bro, f??rs??kte ragga upp henne men hon skrek bara, s?? jag drog vidare. Men det var najs ??nd??, kn??ckte en ??l och ??t bl??b??r.', 
      3, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'May-Britt'), 'Bra', 
      'Den fanns en bar. Vin 50kr.', 
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'S?? underbart, wow!', 
      'Oj va fint! Tog med mig min fiol och spelade lite folkmusik vid en sj??. Kunde verkligen k??nna mig ett med naturen. K??rlek <3 ', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Jag g??r inte om detta..', 
      'Hitta ingenting kul. Fanns bara skog och vatten. Saknar min yxa.', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')), 
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Ass?? wow', 
      'Wow, k??nner mig som en ny person. Mitt spiritanimal lever verkligen nu <3', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'K??rkevagge'))
       `
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
