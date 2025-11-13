const { db } = require('../src/db');
const bcrypt = require('bcryptjs');

db.serialize(()=>{
  db.run(`DELETE FROM parent_child;`);
  db.run(`DELETE FROM tasks;`);
  db.run(`DELETE FROM moods;`);
  db.run(`DELETE FROM rewards;`);
  db.run(`DELETE FROM settings;`);
  db.run(`DELETE FROM users;`);

  const pHash = bcrypt.hashSync('password123', 10);
  const cHash = bcrypt.hashSync('password123', 10);

  db.run(`INSERT INTO users(name,email,password_hash,role) VALUES('Parent One','parent@example.com',?,'parent')`, [pHash], function(err){
    if (err) return console.error(err);
    const parentId = this.lastID;
    db.run(`INSERT INTO users(name,email,password_hash,role) VALUES('Child One','child@example.com',?,'child')`, [cHash], function(err2){
      if (err2) return console.error(err2);
      const childId = this.lastID;
      db.run(`INSERT INTO parent_child(parent_id,child_id) VALUES(?,?)`, [parentId, childId]);
      db.run(`INSERT INTO settings(child_id) VALUES(?)`, [childId]);
      db.run(`INSERT INTO tasks(child_id,title,priority) VALUES(?,?,?)`, [childId, 'Read 10 minutes', 1]);
      db.run(`INSERT INTO rewards(child_id,type,points) VALUES(?,?,?)`, [childId, 'welcome', 10]);
      console.log('Seeded: parent@example.com & child@example.com (password: password123)');
    });
  });
});
