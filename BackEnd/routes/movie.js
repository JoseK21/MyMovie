'use strict'

const validator = require('validator');
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Movie = require('../models/movie');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get movie list
router.get('/', (req, res) =>
    Movie.findAll({
        raw: true
    })
    .then(movies => {
        res.json({
            'status': 200,
            'message': 'Getting movies successfully',
            'data': movies
        })
    })
    .catch(() => res.json({
        'status': 500,
        'message': 'Getting movies failed',
    }))
)
// Add a movie
router.post('/add', (req, res) => {
    let {
        ID,
        Name,
        Director,
        Year,
        Gender,
        Language,
        Favorite,
        Community_Score,
        IMDB,
        Style,
        MetaScore,
        Popularity,
        Image
    } = req.body;
    // Data Validation
    try {
        var validate_name = !validator.isEmpty(Name);
        var validate_director = !validator.isEmpty(Director);
        var validate_year = !validator.isEmpty(Year);
        var validate_genre = !validator.isEmpty(Gender);
        var validate_language = !validator.isEmpty(Language);
        var validate_favorite = !validator.isEmpty(Favorite);
        var validate_grade = !validator.isEmpty(Community_Score);
        var validate_image = !validator.isEmpty(Image);
        var validate_style = !validator.isEmpty(Style);
        var validate_popularity = !validator.isEmpty(Popularity);


    } catch (err) {
        return res.json({
            'status': 404,
            'message': 'Faltan datos por enviar'
        });
    }

    if (validate_name && validate_director && validate_year && validate_genre && validate_language && validate_favorite && validate_grade && validate_image && validate_style && validate_popularity) {

        //Insert into table
        Movie.create({
                ID,
                Name,
                Director,
                Year,
                Gender,
                Language,
                Favorite,
                Community_Score,
                IMDB,
                Style,
                MetaScore,
                Popularity,
                Image
            })
            .then(movie => res.json({
                'status': 200,
                'message': 'Adding movies successfully',
                // 'data': movies // Talvez no sea necesario, pero luego veremos, esto si se actualiza la tabla de una vez o se hace otro request
            }))
            .catch(err =>
                res.json({
                    'status': 404,
                    'message': 'Faltan datos por enviar',
                    'error': err,
                })
            );
    } else {
        return res.json({
            'status': 500,
            'message': 'Los datos no son validos',
        });
    }
});
// Search for name
router.get('/search', (req, res) => {
    let {
        Name
    } = req.body;

    Movie.findAll({
            raw: true,
            where: {
                Name: {
                    [Op.like]: '%' + Name + '%'
                }
            }
        })
        .then(movies => {
            if (movies.length == 0) {
                res.json({
                    'status': 204,
                    'message': '0 movies found',
                })
            }
            res.json({
                'status': 200,
                'message': 'Searching movies successfully',
                'data': movies
            })

        })
        .catch(() => res.json({
            'status': 404,
            'message': 'Faltan datos por enviar',
        }))
});

module.exports = router;