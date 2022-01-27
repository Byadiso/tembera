import { errorHandler } from '../helper/dbErroHandler'
import formidable from 'formidable'
import _ from 'lodash'
import fs from 'fs'
import Money from '../models/money'
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

exports.moneyById = (req, res, next) => {
    Money.findById({ _id: req.params.moneyId })
        .populate('category')
        .exec((err, money) => {
            if (err || !money) {
                return res.status(400).json({
                    error: ' money not found',
                })
            }
            req.money = money
            next()
        })
}

exports.read = (req, res) => {
    req.money.photo = undefined
    return res.json(req.money)
}

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'desc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 12

    Money.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'moneys not found',
                })
            }
            res.status(200).json({
                moneys: data,
                message: 'My Budget',
                status: true,
            })
        })
}

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 4
    console.log(req.money.category)
    Money.find({ _id: { $ne: req.money }, category: req.money.category })
        .limit(limit)
        .populate('category', '_id title')
        .exec((err, moneys) => {
            if (err) {
                return res.status(400).json({
                    error: 'moneys not found',
                })
            }
            res.json(moneys)
        })
}

exports.listCategories = (req, res) => {
    Money.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: ' categories not found',
            })
        }
        res.json(categories)
    })
}

exports.listByUser = (req, res) => {
    Money.find({ createdBy: req.userId }, (err, moneys) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            })
        }
        res.json({
            moneys: moneys,
        })
    })
}

exports.listBycategory = (req, res) => {
    Money.find({ category: req.params.categoryId }, (err, moneys) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            })
        }
        res.json({
            data: moneys,
            message: 'moneys by category',
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

    Money.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'moneys not found',
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

        let money = new Money(fields)
        money.createdBy = req.profile
        money.save((err, result) => {
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
    let money = req.money
    money.remove((err, deletedmoney) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            })
        }
        res.json({
            deletedmoney,
            message: 'money deleted successfully',
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

        let money = req.money
        money = _.extend(money, fields)
        money.save((err, result) => {
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
        // find the money based on query object with 2 moneys
        // search and category
        Money.find(query, (err, moneys) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                })
            }
            res.json(moneys)
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

    Money.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'moneys not found',
                })
            }
            res.json({
                size: data.length,
                data,
            })
        })
}
