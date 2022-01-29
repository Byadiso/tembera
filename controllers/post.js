import { errorHandler } from '../helper/dbErroHandler'
import formidable from 'formidable'
import _ from 'lodash'
import fs from 'fs'
import Post from '../models/post'
import path from 'path'
import express from 'express'

//app
const app = express()

// seting heeders

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

// controlls for routes

exports.postById = (req, res, next) => {
    Post.findById({ _id: req.params.postId })
        .populate('category')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: ' post not found',
                })
            }
            req.post = post
            next()
        })
}

exports.read = (req, res) => {
    req.post.photo = undefined
    return res.json(req.post)
}

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'desc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 12

    Post.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'posts not found',
                })
            }
            res.status(200).json({
                posts: data,
                message: 'My Budget',
                status: true,
            })
        })
}

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 4
    console.log(req.post.category)
    Post.find({ _id: { $ne: req.post }, category: req.post.category })
        .limit(limit)
        .populate('category', '_id title')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: 'posts not found',
                })
            }
            res.json(posts)
        })
}

exports.listCategories = (req, res) => {
    Post.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: ' categories not found',
            })
        }
        res.json(categories)
    })
}

exports.listByUser = (req, res) => {
    Post.find({ createdBy: req.userId }, (err, posts) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            })
        }
        res.json({
            posts: posts,
        })
    })
}

exports.listBycategory = (req, res) => {
    Post.find({ category: req.params.categoryId }, (err, posts) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            })
        }
        res.json({
            data: posts,
            message: 'posts by category',
        })
    })
}

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc'
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'amount') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Post.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'posts not found',
                })
            }
            res.json({
                size: data.length,
                data,
            })
        })
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            })
        }
        // check for all fields
        const { title, description, amount, category } = fields
        if (!title || !description || !amount || !category) {
            return res.status(400).json({
                error: ' All fields are required',
            })
        }

        let post = new post(fields)
        post.createdBy = req.profile
        post.save((err, result) => {
            if (err) {
                return res.status(404).json({
                    // error: errorHandler(err),
                    error: err,
                    status: false,
                })
            }
            res.json({
                property: result,
                status: true,
                message: 'Your property is created successful',
            })
        })
    })
}

exports.remove = (req, res) => {
    let post = req.post
    post.remove((err, deletedpost) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            })
        }
        res.json({
            deletedpost,
            message: 'post deleted successfully',
            status: true,
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            })
        }

        let post = req.post
        post = _.extend(post, fields)
        post.save((err, result) => {
            if (err) {
                return res.status(404).json({
                    // error: errorHandler(err),
                    error: err,
                    status: false,
                })
            }
            res.json({
                property: result,
                status: true,
                message: 'Your property has been Updated successfull',
            })
        })
    })
}

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {}
    // assign search value to query.title
    if (req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' }
        // assign category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }
        // find the post based on query object with 2 posts
        // search and category
        Post.find(query, (err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                })
            }
            res.json(posts)
        }).select('-photo')
    }
}

// list by month

exports.listByMonth = (req, res) => {
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'month') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Post.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'posts not found',
                })
            }
            res.json({
                size: data.length,
                data,
            })
        })
}
