// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";

// const app = express();
// const port = 3000;

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "permalist",
//   password: "pwd",
//   port: 5432,
// });
// db.connect();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

// app.get("/", async (req, res) => {
//   try {
//     const listsResult = await db.query("SELECT * FROM lists ORDER BY id ASC");
//     res.render("lists.ejs", { lists: listsResult.rows, });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/lists/:id", async (req, res) => {
//   try {
//     const listResult = await db.query("SELECT * FROM lists WHERE id = $1", [req.params.id]);
//     const itemsResult = await db.query("SELECT * FROM items WHERE list_id = $1", [req.params.id]);
    
//     res.render("lists.ejs", {
//       currentList: listResult.rows[0],
//       listItems: itemsResult.rows
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/lists", async (req, res) => {
//   try {
//     await db.query("INSERT INTO lists (name) VALUES ($1)", [req.body.listName]);
//     res.redirect("/");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/items", async (req, res) => {
//   try {
//     await db.query("INSERT INTO items (title, list_id) VALUES ($1, $2)", [
//       req.body.newItem,
//       req.body.listId
//     ]);
//     res.redirect(`/lists/${req.body.listId}`);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/add", async (req, res) => {
//   const item = req.body.newItem;
//   // items.push({title: item});
//   try {
//     await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
//     res.redirect("/");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/edit", async (req, res) => {
//   const item = req.body.updatedItemTitle;
//   const id = req.body.updatedItemId;

//   try {
//     await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
//     res.redirect("/");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/delete", async (req, res) => {
//   const id = req.body.deleteItemId;
//   try {
//     await db.query("DELETE FROM items WHERE id = $1", [id]);
//     res.redirect("/");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "pwd",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home route - Show all lists
app.get("/", async (req, res) => {
  try {
    const listsResult = await db.query("SELECT * FROM lists ORDER BY id ASC");
    res.render("lists.ejs", { lists: listsResult.rows });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new list
app.post("/lists", async (req, res) => {
  try {
    await db.query("INSERT INTO lists (name) VALUES ($1)", [req.body.listName]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Show a specific list and its items
app.get("/lists/:id", async (req, res) => {
  try {
    const listResult = await db.query("SELECT * FROM lists WHERE id = $1", [req.params.id]);
    const itemsResult = await db.query("SELECT * FROM items WHERE list_id = $1", [req.params.id]);
    
    res.render("index.ejs", {
      currentList: listResult.rows[0],
      listItems: itemsResult.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new item to a specific list
app.post("/items", async (req, res) => {
  try {
    await db.query("INSERT INTO items (title, list_id) VALUES ($1, $2)", [
      req.body.newItem,
      req.body.listId,
    ]);
    res.redirect(`/lists/${req.body.listId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Edit an item
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  const listId = req.body.listId;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect(`/lists/${listId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete an item
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  const listId = req.body.listId;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect(`/lists/${listId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
