module.exports = function(match) {
  match('',                   'todos#index');
  match('/all',               'todos#all');
  match('/completed',         'todos#completed');
  match('/active',            'todos#active');
};
