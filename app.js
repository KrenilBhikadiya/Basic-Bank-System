const { concatSeries } = require('async');
const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const User = require('./models/user');
const Transaction = require('./models/transaction');

mongoose.connect('mongodb+srv://Krenil:Krenil@6945@banksystem.dzhrc.mongodb.net/BankSystem?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: 'BankApp',
    resave: false,
    saveUninitialized: true,
}))

app.use(function (req, res, next) {
    // set success flash message
    res.locals.success = req.session.success || '';
    delete req.session.success;
    // set error flash message
    res.locals.error = req.session.error || '';
    delete req.session.error;
    next();
});

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/view', async (req, res) => {
    const users = await User.find({});
    // console.log(users);
    res.render('customerlist', { users });
});

app.get('/view/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const users = await User.find({});
    res.render('transfer', { user, users });
});

app.get("/view/:id1/:id2", async (req, res) => {
    const { id1, id2 } = req.params;
    const fromUser = await User.findById(id1);
    const toUser = await User.findById(id2);
    res.render("form", { fromUser, toUser });
});

app.put("/view/:id1/:id2", async (req, res) => {
    const { id1, id2 } = req.params;
    const credit = parseInt(req.body.credit);
    const fromUser = await User.findById(id1);
    const toUser = await User.findById(id2);

    if(credit <=0) {
        req.session.error = "Please Enter Positive Amount !!";
        res.redirect(`/view/${req.params.id1}/${req.params.id2}`);
    }

    else if(credit > fromUser.credits) {
        req.session.error = "Insufficient Balance !!";
        res.redirect(`/view/${req.params.id1}/${req.params.id2}`);
    }

    else {
        let fromCreditsNew = fromUser.credits - credit;
        let toCreditsNew = parseInt(toUser.credits + credit);
        await User.findByIdAndUpdate(id1, { credits: fromCreditsNew },
            { runValidators: true, new: true });
        await User.findByIdAndUpdate(id2, { credits: toCreditsNew },
            { runValidators: true, new: true });

        let newTransaction = new Transaction();
        newTransaction.fromName = fromUser.name;
        newTransaction.toName = toUser.name;
        newTransaction.transfer = credit;
        await newTransaction.save();

        req.session.success = "Money Transfered Sucessfully !";
        res.redirect("/view");
    }
});

app.get("/history", async (req, res) => {
    const transactions = await Transaction.find({});
    res.render("history", { transactions });
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('server running');
});
