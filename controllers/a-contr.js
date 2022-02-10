const User = require('../models/user');
const validationSession = require("../util/validation-session-util");
const validation = require('../util/validation-logic');
const res = require('express/lib/response');

function getSignUp(req, res) {
    //session-validation
    const sessionInputData = validationSession.getSessionErrK(req, {
        email: "",
        confirmEmail: "",
        password: "",
    })

    res.render("signup", {
        inputData: sessionInputData
    });
}

function getSignIn(req, res) {
    /*  let sessionInputData = req.session.inputData;
        if (!sessionInputData) {
            sessionInputData = {
                hasError: false,
                email: "",
                password: "",
            };
        }
        req.session.inputData = null;
     */
    //session-validation
    const sessionInputData = validationSession.getSessionErrK(req, {
        email: "",
        password: "",
    })

    res.render("login", {
        inputData: sessionInputData
    });
}

async function createAccount(req, res) {
    const userData = req.body;
    const enteredEmail = userData.email; // userData['email']
    const enteredConfirmEmail = userData["confirm-email"];
    const enteredPassword = userData.password;

    if (
        /*  !enteredEmail ||
         !enteredConfirmEmail ||
         !enteredPassword ||
         enteredPassword.trim().length < 6 ||
         enteredEmail !== enteredConfirmEmail ||
         !enteredEmail.includes("@") */
        !validation.authSuccessKey(enteredEmail, enteredConfirmEmail, enteredPassword)
    ) {
        /*  req.session.inputData = {
            hasError: true,
            message: "Invalid input - please check your data.",
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
            };
             req.session.save(function () {
             res.redirect("/signup");
            }); */
        validationSession.flashErrSessionK(req, {
            message: "Invalid input - please check your data.",
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
        }, function () {
            res.redirect("/signup");
        });
        return;
    }

    //class user 1
    const newUser = new User(enteredEmail, enteredPassword);
    const existAlready = await newUser.existsAlready();
    //existAlready
    if (existAlready) {
        /* req.session.inputData = {
            hasError: true,
            message: "User exists already!",
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
        };
        req.session.save(function () {
            res.redirect("/signup");
        }); */
        validationSession.flashErrSessionK(req, {
            message: "User exists already!",
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
        }, function () {
            req.session.save(function () {
                res.redirect("/signup");
            });
        });
        return;
    }

    //class User 2
    // const hashedPassword = await bcrypt.hash(enteredPassword, 12);
    //conflicts
    /*   const user = {
        email: enteredEmail,
        password: hashedPassword,
      };
     */
    //await db.getDb().collection("users").insertOne(user);
    await newUser.signup();

    res.redirect("/login");
}

async function logOn(req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredPassword = userData.password;

    /*   const existingUser = await db
        .getDb()
        .collection("users")
        .findOne({ email: enteredEmail });
     */
    //class User 3
    const userLogin = new User(enteredEmail, enteredPassword);
    const existingUser = await userLogin.getSameUserMail();

    if (!existingUser) {
        /*req.session.inputData = {
        hasError: true,
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
        };
        req.session.save(function () {
        res.redirect("/login");
        });
         */
        validationSession.flashErrSessionK(req, {
            message: "Could not log you in - please check your credentials!",
            email: enteredEmail,
            password: enteredPassword,
        }, function () {
            res.redirect("/login");
        });
        return;
    }

    //class User 4
    /*   const passwordsAreEqual = await bcrypt.compare(
        enteredPassword,
        existingUser.password
      ); */
    const passwordsAreEqual = await userLogin.login(existingUser.password);

    if (!passwordsAreEqual) {
        /* req.session.inputData = {
            hasError: true,
            message: "Could not log you in - please check your credentials!",
            email: enteredEmail,
            password: enteredPassword,
        };
        req.session.save(function () {
            res.redirect("/login");
        });
        return; */
        validationSession.flashErrSessionK(req, {
            message: "Could not log you in - please check your credentials!",
            email: enteredEmail,
            password: enteredPassword,
        }, function () {
            res.redirect("/login");
        });
        return;
    }

    /*     req.session.user = { id: existingUser._id, email: existingUser.email };
        req.session.isAuthenticated = true;
        req.session.save(function () {
            res.redirect("/admin");
        }); */
    validationSession.isAuthSessionK(req, { id: existingUser._id, email: existingUser.email }, function () { res.redirect("/admin"); })
}

function logOut(req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect("/");
}

function display401(req, res) {
    res.status(401).render('401');
}

module.exports = {
    getSignUpK: getSignUp,
    getSignInK: getSignIn,
    createAccountK: createAccount,
    logOnK: logOn,
    logOutK: logOut,
    display401K: display401
}