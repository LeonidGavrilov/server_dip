import { model, Schema } from "mongoose";
import { IFilmSchema } from "../types";

const movieModel = new Schema<IFilmSchema>({
  name: {
    type: String,
    required: true,
  },
  image: String,
  trailer: String,
  country: String,
  genre: {
    type: String,
    required: true,
  },
  actors: String,
  rating: Number,
  description: String,
  price: Number,
},
{ versionKey: false });

const Movie = model("Movie", movieModel);

export default Movie;