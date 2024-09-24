import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [
  { id: 1, title: "第一篇文章", content: "这是第一篇博客内容" },
  { id: 2, title: "第二篇文章", content: "这是第二篇博客内容" },
];

app.post("/create", (req, res) => {
  const { title, content } = req.body;
  if (title & content) {
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      content: req.body.content,
    };
    posts.push(newPost);
    res.redirect("/");
  } else {
    // res
    //   .status(400)
    //   .send("Please fill in both the title and content to submit your blog.");
    res.redirect("/");
  }

  // next();
});

app.get("/header", (req, res) => {
  res.render("partials/header");
});

app.get("/", (req, res) => {
  res.render("index", { array: posts });
});
app.get("/create-post", (req, res) => {
  res.render("create");
});
app.post("/update-blog/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = posts.find((posts) => posts.id === postId);
  if (updatedPost) {
    updatedPost.title = req.body.title;
    updatedPost.content = req.body.content;
  }
  res.redirect("/");
});
app.get("/update/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (post) {
    res.render("update", { post: post });
  } else {
    res.status(404).send("Post not found");
  }
});
app.get("/blog-detail/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (post) {
    res.render("blog-detail", { post: post });
  } else {
    res.status(404).send("Post not found");
  }
});
app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id == postId);

  if (postIndex > -1) {
    // delete post from array
    posts.splice(postIndex, 1);
  }

  // redirect
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});
