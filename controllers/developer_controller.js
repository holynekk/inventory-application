var Developer = require('../models/developer.js');

// Display list of all developers.
exports.developer_list = function(req, res) {
    Developer.find({},'name imgUrl').exec(function(err, list_devs){
        if(err){return next(err);}
        res.render('developer_list', {title: 'Developer List', developer_list: list_devs});
    });
};

// Display detail page for a specific developer.
exports.developer_detail = function(req, res) {
    res.render('dev_detail', );
};

// Display developer create form on GET.
exports.developer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: developer create GET');
};

// Handle developer create on POST.
exports.developer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: developer create POST');
};

// Display developer delete form on GET.
exports.developer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: developer delete GET');
};

// Handle developer delete on POST.
exports.developer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: developer delete POST');
};

// Display developer update form on GET.
exports.developer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: developer update GET');
};

// Handle developer update on POST.
exports.developer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: developer update POST');
};
