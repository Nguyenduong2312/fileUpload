const Course = require('../models/Account');

class LoginController {
    // [GET] /me/stored/courses
    storedCourses(req, res, next) {
        Course.find({})
            .lean()
            .then((courses) => res.render('me/stored-courses', { courses }))
            .catch(next);
    }

    // [GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .lean()
            .then((courses) => res.render('me/trash-courses', { courses }))
            .catch(next);
    }
}

module.exports = new LoginController();
