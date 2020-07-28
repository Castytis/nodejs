const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const verifyUser = require("../authenticate").verifyUser;
const cors = require('./cors');

const Dishes = require('../models/dishes');
const Favorites  = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) =>{
    Favorites.find({ user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
        Favorites.findOne({user: req.user._id})
            .then((favorite) => {
                if (!favorite) {
                    Favorites.create({ user: req.user._id})
                    .then((favorite) => {
                        for(var dish = 0; dish< req.body.dishes.length; dish++)
                        { favorite.dishes.push(req.body.dishes[dish]);
                        }
                        favorite.save()
                        .then((favorite) =>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        });
            }, (err) => next(err))
            .catch((err) => next(err));

            }else
            {
                for(var dish = 0; dish< req.body.dishes.length; dish++)
                {
                    if(favorite.dishes.indexOf(req.body.dishes[dish])< 0){
                        favorite.dishes.push(req.body.dishes[dish]);
                    }
                }   
                favorite.save()
                .then((favorite) =>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                });
            }
        });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    Favorites.deleteOne({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) =>{
    Favorites.findById(req.params.dishId)
        .populate('user')
        .populate('dish')
        .then((Favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(Favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(!favorite){
            Favorites.create({ user: req.user._id})
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                });
        }, (err) => next(err))
        .catch((err) => next(err));
        
    }else
    {
            if(favorite.dishes.indexOf(req.params.dishId)< 0){
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                });
            }else{
                res.statusCode = 200;
                res.end("Favorite were added");
            }
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    Favorites.findOne({ user: req.user._id })
        .then((favorite) => {
            if(!favorite){
                res.statusCode = 200;
                res.end("nothing to delete");
            }
            var index = favorite.dishes.indexOf(req.params.dishId);
            if(index>-1)
            {
            favorite.dishes.splice(index,1);
            favorite.save()
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
    });
});

module.exports = favoriteRouter;