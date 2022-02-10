const Post = require('../models/post');
const validationSession = require("../util/validation-session-util");
const validation = require('../util/validation-logic');


function getHome(req, res) {
    res.render("welcome");
}

async function getAdmin(req, res) {
    //redacted 401

    //cut for Post class 
    //no instantiation necessary
    const posts = await Post.fetchAll();

    //session-validation
    const sessionErrorData = validationSession.getSessionErrK(req, {
        title: "",
        content: "",
    });

    res.render("admin", {
        posts: posts,
        inputData: sessionErrorData
    });
}

async function createPost(req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;

    if (
        //inverted truthy function call
        !validation.postSuccessKey(enteredTitle, enteredContent)
    ) {
        //session-util
        validationSession.flashErrSessionK(req, {
            message: "Invalid input - please check your data.",
            title: enteredTitle,
            content: enteredContent
        }, function () { res.redirect("/admin"); });
        return; // or return res.redirect('/admin'); => Has the same effect
    }

    //cut for Post class
    //instantiate new obj from Post class
    const post = new Post(enteredTitle, enteredContent);
    //execute save() method
    post.save();

    res.redirect("/admin");
}
//next mw
async function fetchOnePost(req, res, next) {
    //const postId = new ObjectId(req.params.id);
    //cut for Post class 
    //try
    let post;
    try {
        post = new Post(null, null, req.params.id);
    } catch (err) {
        return next(err);
    }
    await post.fetch();

    if (!post.title || !post.content) { //
        return res.render("404"); // 404.ejs is missing at this point - it will be added later!
    }

    //session-validation
    const sessionErrorData = validationSession.getSessionErrK(req, {
        title: post.title,
        content: post.content,
    });


    res.render("single-post", {
        post: post,
        inputData: sessionErrorData
    });
}

async function updateOnePost(req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;
    //const postId = new ObjectId(req.params.id);

    if (
        //inverted truthy function call
        !validation.postSuccessKey(enteredTitle, enteredContent)
    ) {
        validationSession.flashErrSessionK(req, {
            message: "Invalid input - please check your data.",
            title: enteredTitle,
            content: enteredContent,
        }, function () {
            res.redirect(`/posts/${req.params.id}/edit`);
        });
        return;
    }

    //cut for Post class
    const post = new Post(enteredTitle, enteredContent, req.params.id);
    await post.save();

    res.redirect("/admin");
}

async function deletePost(req, res) {
    //const postId = new ObjectId(req.params.id);
    //cut for class Post
    const post = new Post(null, null, req.params.id);
    await post.delete();

    res.redirect("/admin");
}

module.exports = {
    getHomeKey: getHome,
    getAdminKey: getAdmin,
    createPostKey: createPost,
    fetchOnePostKey: fetchOnePost,
    updateOnePostKey: updateOnePost,
    deletePostKey: deletePost
}