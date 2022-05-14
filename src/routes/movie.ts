import express, { Router } from "express";
import Film from "../models/FilmDescription";
import { IFilmSchema, IDocFilm } from "../types";
const jsonParser = express.json();
const router = Router();

// возвращает все фильмы
router.get("/film-description", (req, res) => {
    Film.find(
        {},
        (err: Error, movie: IFilmSchema) => {
            if (err) return console.log(err);
            res.send(movie);
        }
    );
});

// возвращает фильм по id
router.get("/film-description/:id", (req, res) => {
    const id = req.params.id;
    Film.findOne(
        { _id: id },
        (err: Error, movie: IFilmSchema) => {
            if (err) return console.log(err);
            res.send(movie);
        }
    );
});

// добавляет фильм
router.post("/film-description", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const obj: IFilmSchema = req.body;
    const {
        name,
        image,
        trailer,
        country,
        genre,
        actors,
        rating,
        price,
        description,
    } = obj;
    const movie = new Film({
        name,
        image,
        trailer,
        country,
        genre,
        actors,
        rating,
        price,
        description,
    });
    movie.save((err: Error | null) => {
        if (err) return console.log(err);
        res.send(movie);
    });
});

// удаляет фильм
router.delete("/film-description", jsonParser, (req, res) => {
    const _id = req.body._id;
    Film.findByIdAndDelete(
        _id,
        (err: Error, movie: IFilmSchema) => {
            if (err) return console.log(err);
            res.send(movie);
        }
    );
});

// изменяет фильм
router.put("/film-description", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const obj: IDocFilm = req.body;
    const {
        _id,
        name,
        image,
        trailer,
        country,
        genre,
        actors,
        rating,
        price,
        description,
    } = obj;
    
    const movie = {
        _id,
        name,
        image,
        trailer,
        country,
        genre,
        actors,
        rating,
        price,
        description,
    };
    Film.findOneAndUpdate(
        { _id },
        movie,
        { new: true },
        (err, movie: IFilmSchema | null) => {
            if (err) return console.log(err);
            res.send(movie);
        }
    );
});

export default router;
