
const Order = require('../models/order');

//  Sales Report (Get Method) :-  

const loadReport = async (req, res) => {

    try {

        const reportVal = req.params.id;

        if (reportVal == "Week") {

            const crrDate = new Date();

            const weeStart = new Date(

                crrDate.getFullYear(),
                crrDate.getMonth(),
                crrDate.getDate() - crrDate.getDay()

            );

            const weekEnd = new Date(weeStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            const report = await Order.find({ orderDate: { $gte: weeStart, $lte: weekEnd } });

            res.render("salesReport", { report, data: "Week", reportVal: req.params.id });

        } else if (reportVal == "Month") {

            const crrDate = new Date();
            const crrMonth = crrDate.getMonth();
            const startDate = new Date(crrDate.getFullYear(), crrMonth);
            const endDate = new Date(crrDate.getFullYear(), crrMonth + 1, 0);

            const report = await Order.find({ orderDate: { $gte: startDate, $lte: endDate } });

            res.render("salesReport", { report, data: "Month", reportVal: req.params.id, });
            
        } else if (reportVal == "Year") {

            const crrDate = new Date();
            const yearStart = new Date(crrDate.getFullYear(), 0, 1);
            const yearEnd = new Date(crrDate.getFullYear() + 1, 0, 0);

            const report = await Order.find({

                orderDate: { $gte: yearStart, $lte: yearEnd },

            });

            res.render("salesReport", { report, data: "Year", reportVal: req.params.id });

        } else if ((reportVal == "Custom")) {

            res.render("salesReport", {

                custom: true,
                reportVal: req.params.id,
                data: "costum",

            });

        } else {

            res.redirect("/admin");
        }

    } catch (err) {

        console.log(err.message);

    }

};

//  Sales Custom Report :-

const customReport = async (req, res) => {

    try {

        const startDate = new Date(req.body.startDatee);



        const endDate = new Date(req.body.endDatee);
        
        endDate.setDate(endDate.getDate() + 1);
    
        const getData = await Order.find({
          orderDate: { $gte: startDate, $lte: endDate }
        });
        // console.log(getData);

        res.send({ getData });

    } catch (err) {

        console.log(err.message);

    }

};

module.exports = {

    loadReport,
    customReport

};
