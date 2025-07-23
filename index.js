import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"postgresql",
  port:"5432",
  


});

db.connect();


const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  const result=await db.query("select * from items");
  let items=[];
  result.rows.forEach(item=>{
    items.push(item);
  });
  //console.log(result.rows);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
   await db.query("insert into items (title) values ($1)",[item]);
  //items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const temp=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;

  await db.query("update items set title=($1) where id=($2)",[temp,id]);

  res.redirect("/");


});

app.post("/delete",async (req, res) => {
  const temp2=req.body.deleteItemId;

  await db.query("delete from items where id=($1)",[temp2]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
