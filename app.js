const express = require("express");
const ejs = require("ejs");
const app = express();
const rotas = require("./server/rotas")
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')
const device = require('express-device');
let PORT = 3000;

app.use(cookieSession({
    name: 'session',
    keys: ['papagaiodepiratas23233'],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(device.capture());

const checkMobile = (req, res, next) => {
    if (req.device.type === 'phone' || req.device.type === 'tablet') {
        return res.redirect('/erro');
    }
    next();
};

app.get('/erro', (req, res) => {
    res.render('./telas/erro');
});

app.use(checkMobile);
app.use(express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(rotas)
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(process.env.PORT || PORT, async () => {
    console.log("Site iniciado porta -> " + PORT)
})