import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items1 = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
let items2 = [
  { id: 1, title: "Buy milk2" },
  { id: 2, title: "Finish homewor2" },
];
let items3 = [
  { id: 1, title: "Buy milk3" },
  { id: 2, title: "Finish homework3" },
];

app.get("/", async (req, res) => {
  try {
    const result1 = await db.query("SELECT * FROM items1 ORDER BY id ASC");
    items1 = result1.rows;
    const result2 = await db.query("SELECT * FROM items2 ORDER BY id ASC");
    items2 = result2.rows;
    const result3 = await db.query("SELECT * FROM items3 ORDER BY id ASC");
    items3 = result3.rows;
    res.render("index.ejs", {listItems1: items1,listItems2: items2,listItems3: items3});
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const list = req.body.list;
  console.log(item);
  console.log(list);
  let tableName;
  if (list[0] === "Today") {
    tableName = 'items1';
  } else if (list[0] === 'Weekly') {
    tableName = 'items2';
  } else if (list[0] === 'Monthly') {
    tableName = 'items3';
  } else {
    return res.status(400).send('Invalid list type');
  }

  try {
    await db.query(`INSERT INTO ${tableName} (title) VALUES ($1)`, [item]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting item');
  }
});


app.post("/edit1", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items1 SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/edit2", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items2 SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/edit3", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items3 SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete1", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items1 WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/delete2", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items2 WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/delete3", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items3 WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
