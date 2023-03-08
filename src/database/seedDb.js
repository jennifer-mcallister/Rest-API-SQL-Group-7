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
      `INSERT INTO county (name) VALUES ('Stockholm'), ('Västernorrland'), ('Abisko')`
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

    // VÄSTERNORRLAND password
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
            ('Frans', 'Skogsälskare', 'forest_frans@mail.com', '${newPasswordFransHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Karen', 'Moder Natur', 'karen@mail.com', '${newPasswordKarenHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('May-Britt', 'Gillar bilar och TV', 'brittan@mail.com', '${newPasswordMaybrittHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Boss', 'Big Boss', 'boss@mail.com', '${newPasswordAdminHash}', (SELECT role_id FROM role r WHERE role = 'ADMIN')),
            ('Anna', 'Älskar att campa året runt', 'anna_maja@mail.com', '${newPasswordAnnaHash}', (SELECT role_id FROM role r WHERE role = 'USER')),
            ('Stockholm', 'Stockholm kommun', 'stockholm@mail.com', '${newPasswordStockholmHash}', (SELECT role_id FROM role r WHERE role = 'COUNTY')),
            ('Västernorrland', 'Västernorrland län', 'vasternorrland@mail.com', '${newPasswordVasternorrlandHash}', (SELECT role_id FROM role r WHERE role = 'COUNTY')),
            ('Abisko', 'Abisko', 'abisko@mail.com', '${newPasswordAbiskoHash}', (SELECT role_id FROM role r WHERE role = 'COUNTY'))
            `
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
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Björkälskare titta hit!', 
      'Det här är paradiset för den som älskar Björkar. Tips! Ta med hängmatta och stormkök och koka dig själv lite Björkbladste', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Björkliden')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Häftigt ställe', 
      'Otrolig miljö, men ta med ficklampa!',
      2, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'UNDERBAR', 
      'Fin natur och roliga utmaningar. Sjöng Ronja Rövardotter låten på Slåttdalsskrevan, varmt rekommenderat!', 
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Höga Kustenleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Vacker och behaglig', 
      'Så mysigt <3 Kommer gå den här igen! Wow <3 ', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Höga Kustenleden')),
      ((SELECT user_id FROM user WHERE name = 'May-Britt'), 'Nej', 
      'Fanns ingen toa.', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Bra men finns bättre.', 
      'Bra vandringsled.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Helvetesbrännan')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Aldrig mer.', 
      'Fett najs ställe! Grillade korv på berget sen hitta jag en ring som lös i elden så jag tog med mig den hem.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotenleden')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Fin natur', 
      'Naturen är fin. Bra vägar. Lugnt och väldigt rent, men det började regna och jag hade inget parapaly', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Kärkevagge')),
      ((SELECT user_id FROM user WHERE name = 'Frans'), 'Helt okej', 
      'Hade velat ha mer skog, men bra vägar och skyltat', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Kul men inte för mig!', 
      'Någon borde ta bort den där dimmen, kunde jue inte se nånting. Dålig service.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Helvetesbrännan')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Dålig service.', 
      'Tyckte inte att det var så värst organiserat, skulle gärna vilja prata med managern', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Sörmlandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Jättebra för nybörjar', 
      'Så mysigt med skog och sånt, prova cafét i byn 10/10. Inte jättekul att bli biten av en mås, annars hade det varit 5 stjärnor från mig. Kärlek <3', 
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Sörmlandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Boss'), 'Bra', 
      'Den va bra.', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Sörmlandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'GRYMT VANDRINGSLED', 
      'Helt sjukt! Hittade massa stenar som stod i en cirkel, sen låg det en hjälm och nån slags yxa där, så jag tog med mig den hem! Nu ska det skäras kött och dricka hembränt.',
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Så fint', 
      'Sååå fint, kunde verkligen känna naturen i kroppen och finna mitt inre ro. Blev dock lite förskräckt när jag såg en man springa in skogan med en yxa, men lite härligt ändå med energifyllda själar',
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'Karen'), 'Såg döden i ögonen', 
      'Idag såg jag döden i ögonen, men jag överlevde. Jag gick längs grusvägen upp till runstenarna och där stod ett spöke. Han plocka upp en yxa och skrek. Han tänkte döda mig, men jag använda mina spirituellakrafter för att jaga honom in skogen. Jag är en survivor',
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Roslagsleden')),
      ((SELECT user_id FROM user WHERE name = 'May-Britt'), 'Dåligt', 
      'Man fick inte röka, dåligt.', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Najs ställe', 
      'Träffade nån brud vid en bro, försökte ragga upp henne men hon skrek bara, så jag drog vidare. Men det var najs ändå, knäckte en öl och åt blåbär.', 
      3, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Upplandsleden')),
      ((SELECT user_id FROM user WHERE name = 'May-Britt'), 'Bra', 
      'Den fanns en bar. Vin 50kr.', 
      4, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Så underbart, wow!', 
      'Oj va fint! Tog med mig min fiol och spelade lite folkmusik vid en sjö. Kunde verkligen känna mig ett med naturen. Kärlek <3 ', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')),
      ((SELECT user_id FROM user WHERE name = 'Bob'), 'Jag gör inte om detta..', 
      'Hitta ingenting kul. Fanns bara skog och vatten. Saknar min yxa.', 
      1, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Rotsidan')), 
      ((SELECT user_id FROM user WHERE name = 'Anna'), 'Asså wow', 
      'Wow, känner mig som en ny person. Mitt spiritanimal lever verkligen nu <3', 
      5, (SELECT walkingtrail_id FROM walkingtrail WHERE name = 'Kärkevagge'))
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
