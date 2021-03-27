var Developer = require('../models/developer.js');

// Display list of all developers.
exports.developer_list = function(req, res) {
    res.send('NOT IMPLEMENTED: developer list');
};

// Display detail page for a specific developer.
exports.developer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: developer detail: ' + req.params.id);
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
