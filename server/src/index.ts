import bodyParser from 'body-parser';
import express from 'express';
import cookieSession from 'cookie-session'
import passport from 'passport'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { queries } from '../graphql/queries';
import { mutations } from '../graphql/mutations';
import { getJiraWorklogs, getJiraWorklogsByType } from './dao'
import axios from 'axios'
import https from 'https'
import { router } from './route';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import env from './environment';

dotenv.config();

passport.use(new GoogleStrategy(
    {
        clientID: env.google.clientID,
        clientSecret: env.google.clientSecret,
        callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
        profile._json.hd === "coolshop.it" ? cb(null, profile) : cb(null, false);
    }
))

passport.serializeUser((user, done) => done(null, user));
  
passport.deserializeUser((user, done) => done(null, user as any));

const app = express()

app
    .use(cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 }))
    .use(passport.initialize())
    .use(passport.session())
    .use(bodyParser.json())
    .use(cors({
        origin: `${env.app.scheme}://${env.app.host}:${env.app.port}`,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    }))
    .use("/auth", router)
    .use('/graphql', graphqlHTTP({
        schema: new GraphQLSchema({query: queries, mutation: mutations}),
        graphiql: true,
    }))
    .post('/usersByIdIn', async (req, res) => {
        axios
            .get('http://intranet.coolshop.it/admin/external/usersByIdIn',
                {
                    httpsAgent: new https.Agent({rejectUnauthorized: false}),
                    headers: { 
                        Authorization: "Bearer " + env.external.intranetToken
                    },
                    data: req.body.ids
                })
            .then(resp => {
                res.json(resp.data)
                res.status(200).end()
            })
    })
    .get('/usersHolidays/:month', async (req, res) => {
        axios
            .get(`http://intranet.coolshop.it/admin/external/usersHolidays/${req.params.month}`, 
                {
                    httpsAgent: new https.Agent({rejectUnauthorized: false}),
                    headers: { 
                        Authorization: "Bearer " + env.external.intranetToken
                    }
                })
            .then(resp => {
                res.json(resp.data)
                res.status(200).end()
            })
    })
    .get('/worklogs', async (req, res) => {
        if (!req.query.type) {
            getJiraWorklogs(String(req.query.start), String(req.query.end), req.query.jira ? String(req.query.jira) : "")
                .then(worklogs => {
                    res.json(worklogs)
                    res.status(200).end()
                })
        } else {
            getJiraWorklogsByType(String(req.query.start), String(req.query.end), String(req.query.type), req.query.jira ? String(req.query.jira) : "")
                .then(worklogs => {
                    res.json(worklogs)
                    res.status(200).end()
                })
        }
    });

mongoose
    .connect(`mongodb://${env.mongodb.user}:${env.mongodb.password}@${env.mongodb.host}:${env.mongodb.port}/${env.mongodb.databaseName}`)
    .then(() => app.listen(env.serverPort, () => { console.log(`Server running on port ${env.serverPort} ...`) }));