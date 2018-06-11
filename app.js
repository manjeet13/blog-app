var express          = require("express"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    app              = express();
    

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});


var Blog = mongoose.model("Blog", blogSchema);


// routes

app.get("/", function(req,res){
    res.redirect("/blogs");
});


// the index route
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});


// new post route

app.get("/blogs/new", function(req, res) {
    res.render("new");
});


//CREATE route

app.post("/blogs", function(req, res){
    
    // sanitize the input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // create new blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //redirect to blogs page
            res.redirect("/blogs");
        }
    });
    
});


// SHOW route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});


//EDIT route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id,  function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    });
});


//UPDATE route
app.put("/blogs/:id", function(req,res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // find the blog to be updated and update
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//DELETE route
app.delete("/blogs/:id", function(req, res){
    //find the blog and then delete
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});




app.listen(3000, function(){
    console.log("RESTful blog app is now live!");
});