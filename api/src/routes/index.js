const { Router } = require('express');
const { Blog, Comments } = require('../db');


const router = Router();


module.exports = router;
//----------------------------------------------READ---------------------------------------------
//READ only 1 blog, include comments
router.get("/getBlog/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        let blog = await Blog.findOne({ include: Comments, where: { id } });
        res.send(blog)
    } catch (error) {

    }

});

//READ all blogs, include comments
router.get("/getBlogs", async (req, res, next) => {
    try {
        let { page = 1, size = 4 } = req.query;
        // if (!page) {
        //     page = 1;
        // }
        // if (!size) {
        //     size = 10;
        // }
        const limit = parseInt(size); //limit of elements in the pagination
        const skip = parseInt((page - 1) * size);   

        let blogs = await Blog.findAll({ include: Comments, offset: skip, limit, order:[["id",'ASC']] })
        console.log(blogs.dataValues);
        res.send(blogs.map(e => { return { ...e.dataValues, comments: e.comments?.map(e => { return { author: e.author, comment: e.comment, id: e.id } }) } }))
    } catch (err) {
        next(err)
    }
});

//-----------------------------------CREATE----------------------------

//---------------------------CREATE ONE BLOG--------------------------------------
router.post("/postBlog/:tittle", async (req, res, next) => {
    const paragraphs = req.body;
    const { tittle } = req.params;

    /*
    {
    "paragrap1":"hello, my name is David",
    "paragrap2":"I'm from Colombia and I like ride bicicle",
    "paragrap3":"Thanks for read my post",
    "paragrap4":"yeiii",
    "paragrap5": "we are doing an API"
} */

    try {
        if (!tittle) res.status(400).send("A tittle must be provided");
        else if (paragraphs.length < 1) res.status(400).send("The paragraphs must be provided");
        else {
            let text = "";
            for (let x in paragraphs) { text += paragraphs[x] + "\n\n" };
            console.log("the text is: " + text);
            const blog = await Blog.create({ tittle, text });
            res.send({ message: "created", blog });
        }
    } catch (err) {
        next(err)
    }

});
//------------------------------CREATE ONE COMMENT FOR A BLOG-----------------------
router.post("/comment", async (req, res, next) => {

    const { author, comment, blogID } = req.body;
    try {
        if (!blogID) res.status(400).send("A blog must be selected");
        else if (!author) res.status(400).send("An author must be provided");
        else if (!comment) res.status(400).send("A comment must be provided");

        const blog = await Blog.findOne({ where: { id: blogID } });
        const newComment = await Comments.create({ author, comment });
        await blog.addComments(newComment);
        res.send({ blog, newComment });

    } catch (err) { next(err) }
});
//-----------------------------------------------------------------------------------


//----------------------------------DELETE------------------------------------
//--------------------DELETE ONE COMMENT------------------------
router.delete("/deleteComment/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        let result = await Comments.destroy({ where: { id: id } });
        res.send(result ? { message: "Deleted" } : { message: "Error, nonexistent ID" })
    } catch (error) {
        next(error)
    }
});

//--------------------DELETE ONE BLOG------------------------
router.delete("/deleteBlog/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        let result = await Blog.destroy({ where: { id: id } });
        res.send(result ? { message: "Deleted" } : { message: "Error, nonexistent ID" })
    } catch (error) {

    }
});
//--------------------------------------------------------------------------------


//---------------------------EDIT--------------------------
//------------------------------EDIT ONE COMMENT--------------
router.put("/updateComment/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newComment } = req.body;
        if(!id) res.send("Error, nonexistent ID")
        else if(!newComment) res.send("Error, nonexistent new comment")
        let result = await Comments.update({ comment: newComment }, { where: { id } });
        res.send(result ? { message: "Modified" } : { message: "Error" })
    } catch (err) {
        next(err);
    }
});
//------------------------------EDIT A BLOG-------------------------

router.put("/updateBlog/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const paragraphs = req.body;
        if(!id) res.send("Error, nonexistent ID")
        else if(paragraphs.length<1) res.send("Error, nonexistent new text for the blog")
        let text = "";
        for (let x in paragraphs) { text += paragraphs[x] + "\n\n" };
        const blog = await Blog.update({ text },{where:{id}});
        res.send(blog?{ message: "Modified", newContent:text }:{message:"Error"});
  
    } catch (err) {
        next(err);
    }
});