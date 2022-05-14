import { GridFSFile } from "mongodb";
import { Document } from "mongoose";

export interface IFilmSchema {
  name: string;
  image?: string;
  trailer?: string;
  country?: string;
  genre: string;
  actors?: string;
  rating?: number;
  description?: string;
  price?: number;
}

export interface IDocFilm extends Document, IFilmSchema { }

export interface IUser {
  email: string;
  name: string;
  password: string;
  token: string;
  avatarUrl?: string;
  resetToken?: string;
  resetTokenExp?: number;
  movies?: string[];
  basket?: string[];
}

export interface IDocUser extends Document, IUser { }

export interface IGridFSFile extends GridFSFile {
  isImage?: boolean;
  isVideo?: boolean;
}
