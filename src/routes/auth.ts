import { Router } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/User";
import crypto from "crypto";
import { IUser, IDocUser } from "../types";

const router = Router();

// инициализация
router.get('/condition', (req, res) => {
  console.log('condition', res.locals.csurf);
  res.send({ csrfToken: res.locals.csurf });
});

// регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password || !name || !email) {
      res.send({
        status: 'не все данные введены'
      });
    }
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        res.send({
          status: 'неизвестная ошибка',
          error: err,
        });
      }
      const token = buffer.toString("hex");
      const hashPassword = await bcryptjs.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashPassword,
        token
      });
      await user.save();
      res.send({
        status: 'успешно зарегистрирован',
        token
      });
    });
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// авторизация
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      res.send({
        status: 'не все данные введены'
      });
    }
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        res.send({
          status: 'неизвестная ошибка',
          error: err,
        });
      }
      const token = buffer.toString("hex");
      const candidate: IUser | null = await User.findOneAndUpdate({ email }, (_err: Error, user: IDocUser) => {
        user.token = token;
        user.save();
      });
      if (candidate) {
        const pass = await bcryptjs.compare(password, candidate.password);
        if (pass) {
          res.send({
            status: 'успешно авторизован',
            token
          });
        }
        else {
          res.send({
            status: 'неверные данные'
          });
        }
      } else {
        res.send({
          status: 'пользователь не найден'
        });
      }
    });
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// получение корзины
router.post("/get-all-basket", async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.send({
        status: 'не все данные введены'
      });
    }
    const user: IDocUser | null = await User.findOne({ email, token });
    if (user) {
      const basket: string[] = [...(user.basket ? user.basket : [])];
      res.send({
        status: 'данные корзины отправлены',
        basket
      });
    }
    else {
      res.send({
        status: 'неверные учетные данные',
      });
    }
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// добавление в корзину
router.post("/add-to-basket", async (req, res) => {
  try {
    const { email, token, id } = req.body;
    if (!email || !token || !id) {
      res.send({
        status: 'не все данные введены'
      });
    }
    const user: IDocUser | null = await User.findOne({ email, token });
    if (user) {
      user.basket = [...(user.basket ? user.basket : []), id];
      await user.save();
      res.send({
        status: `фильм с id ${id} успешно добавлен в корзину`,
      });
    }
    else {
      res.send({
        status: 'неверные учетные данные',
      });
    }
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// удаление из корзины
router.post("/remove-from-basket", async (req, res) => {
  try {
    const { email, token, id } = req.body;
    if (!email || !token || !id) {
      res.send({
        status: 'не все данные введены'
      });
    }
    const user: IDocUser | null = await User.findOne({ email, token });
    if (user) {
      user.basket = [...(user.basket ? user.basket.filter(filmId => filmId !== id) : [])];
      await user.save();
      res.send({
        status: `фильм с id ${id} успешно удален из корзины`,
      });
    }
    else {
      res.send({
        status: 'неверные учетные данные',
      });
    }
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// очистка корзины
router.post("/clean-basket", async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.send({
        status: 'не все данные введены'
      });
    }
    const user: IDocUser | null = await User.findOne({ email, token });
    if (user) {
      user.basket = [];
      await user.save();
      res.send({
        status: 'корзина очищена',
      });
    }
    else {
      res.send({
        status: 'неверные учетные данные',
      });
    }
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// получение купленных фильмов
router.post("/get-all-movies", async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.send({
        status: 'не все данные введены'
      });
    }
    const user: IDocUser | null = await User.findOne({ email, token });
    if (user) {
      const movies: string[] = [...(user.movies ? user.movies : [])];
      res.send({
        status: 'список фильмов отправлен',
        movies
      });
    }
    else {
      res.send({
        status: 'неверные учетные данные',
      });
    }
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// покупка фильма
router.post("/add-to-movies", async (req, res) => {
  try {
    const { email, token, ids } = req.body;
    if (!email || !token || !ids) {
      res.send({
        status: 'не все данные введены'
      });
    }
    const user: IDocUser | null = await User.findOne({ email, token });
    if (user) {
      user.movies = [...(user.movies ? user.movies : []), ...ids];
      await user.save();
      res.send({
        status: `фильмы успешно куплены`,
      });
    }
    else {
      res.send({
        status: 'неверные учетные данные',
      });
    }
  } catch (error) {
    res.send({
      status: 'ошибка',
      error
    });
  }
});

// сброс пароля
router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        res.send({
          status: 'reset err'
        });
      }
      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 5 * 60 * 1000;
        await candidate.save();
        res.send({
          status: 'it is your token',
          token: token,
        });
      } else {
        res.send({
          status: 'user not found'
        });
      }
    });
  } catch (error) {
    res.send({
      status: 'user not found',
      error
    });
  }
});

// main page
// router.get("/auth", async (req, res) => {
//   return res.render("auth", {
//     loginError: 'loginError',
//     registerError: 'registerError',
//     files: false,
//     title: "Login Main",
//     csurf: "tiiiz",
//     // isLogin: true,
//   });
// });

// main page
// router.get("/login", (req, res) => {
//   return res.render("auth", {
//     loginError: 'loginError',
//     registerError: 'registerError',
//     files: false,
//     title: "Login",
//   });
// });

// main page
// router.get("/reset", (req, res) => {
//   return res.render("auth", {
//     loginError: 'loginError',
//     registerError: 'registerError',
//     files: false,
//     title: "Reset",
//     csurf: "tiiiz",
//   });
// });

// // регистрация
// router.post("/register", authMW, async (req, res) => {
//     try {
//       const { name, email, password } = req.body;
//       const hashPassword = await bcryptjs.hash(password, 10);
//       const user = new User({
//         name: name,
//         email: email,
//         password: hashPassword,
//       });
//       await user.save();
//       res.send({ status: "ну блять, аплодисменты, хуле" });
//     //   await transporter.sendMail(regEmail(email));
//     } catch (error) {
//       console.log(error);
//     }
//   });

export default router;
