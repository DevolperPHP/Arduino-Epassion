const express = require("express")
const Project = require("../models/Project")
const User = require("../models/User")
const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const id = req.cookies.id
        const user = await User.findOne({ _id: id })
        const following = user.following.map(x => x.id)
        const data = await User.find({ _id: { $in: following }})
        const posts = data.map(x => x.posts)
        const userPosts = user.posts.map(x => x.projectImage)
        var projects = []

        posts.forEach(post => {
            post.forEach(data => {
                projects.push(data.projectImage)
            })
        })

        for (let i = 0; i < userPosts.length; i++) {
            projects.push(userPosts[i])
        }
        const project = await Project.find({ projectImage: {$in: projects}}).sort({ Date: -1 })
        const currentDate = project.reverse()
        res.render('user/index', {
            activeSuc: req.flash("activation-success"),
            user: user,
            login_require: req.flash("require-login"),
            search_err: req.flash("search-error"),
            project: currentDate
        })
    } catch (err) {
        console.log(err);
    }
})
module.exports = router