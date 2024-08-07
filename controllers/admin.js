const moduleName = 'admin';

const currentUserRole = 3

// Import Accounts Model
const User = require('../models/user');

const Role = require('../models/role');

// Show Admin Dashboard
exports.getHome = (req, res, next) => {
  let tempPath = 'home';
  MenuOption.findAll({
    where: {
      parent_option_id: 1
    }
  })
    .then(categories => {
      res.render('template', {
        pageTitle: 'Admin Dashboard',
        moduleName: moduleName,
        pagetoLoad: `dashboards/main`,
        moduleSection: `${moduleName}-${tempPath}`,
        cats: categories,
        type: 'menu',
        user_role: currentUserRole
      });
    })
    .catch(err => console.log(err));
}

// Get /admin/route1/
exports.getMenuHandler1 = (req, res, next) => {
  const firstRoute = req.params.firstRoute;
  let tempPath = 'home';
  MenuOption.findAll({
    where: {
      url: `/admin/${firstRoute}/`
    }
  })
    .then(optionFound => {
      if (!optionFound || optionFound.length === 0) {
        next();
      }
      console.log(optionFound)
      MenuOption.findAll({
        where: {
          parent_option_id: optionFound[0].id
        }
      })
        .then(categories => {
          if (categories && categories.length > 0) {
            res.render('template', {
              pageTitle: optionFound[0].name,
              moduleName: moduleName,
              pagetoLoad: `dashboards/main`,
              moduleSection: `${moduleName}-${tempPath}`,
              cats: categories,
              type: 'menu',
              user_role: currentUserRole
            });
          } else {
            next();
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

// Show Admin -> Users Dashboard
exports.getUsers = (req, res, next) => {
  let tempPath = 'users';
  User.findAll()
    .then(users => {
      res.render('template', {
        pageTitle: 'Admin Dashboard > Users',
        moduleName: moduleName,
        pagetoLoad: `${moduleName}/${tempPath}`,
        moduleSection: `${moduleName}-${tempPath}`,
        type: 'table',
        usrs: users
      });
    })
    .catch(err => console.log(err));
}

// Show Admin -> Users Dashboard
exports.getRoles = (req, res, next) => {
  let tempPath = 'roles';
  Role.findAll()
    .then(roles => {
      const tableHeaders = ['ID', 'Name'];
      const tableRows = roles.map(role => [
        role.id,
        role.name,
      ]);
      const dataTableOptions = `
      responsive: true
      `;
      res.render('template', {
        pageTitle: 'Admin Dashboard > Roles',
        moduleName: moduleName,
        pagetoLoad: `dashboards/main`,
        moduleSection: `${moduleName}-${tempPath}`,
        table_headers: tableHeaders,
        type: 'table',
        rows: tableRows,
        dtoptions: dataTableOptions
      });
    })
    .catch(err => console.log(err));
}

// Show Admin -> User Details
exports.getUserDetails = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode != 'true') {
    res.redirect('/admin/users');
  }
  let tempPath = 'user-details';
  // It's extracting from /user-details/:userId
  const userId = req.params.userId;

  User.findByPk(userId)
    .then(user => {
      if (!user) {
        res.redirect('/admin/users');
      }
      console.log(user)
      res.render('template', {
        pageTitle: 'Details of ' + user.first_name,
        moduleName: moduleName,
        pagetoLoad: `${moduleName}/${tempPath}`,
        moduleSection: `${moduleName}-${tempPath}`,
        editing: editMode,
        usr: user
      });
    })
    .catch(err => console.log(err));  
}

// Post Update User or Delete User
exports.updateUser = (req, res, next)=> {
  // Getting data from the form
  let userId = req.body.id;
  
  if (req.body.form_action == 'edit') {
    let userFirstName = req.body.first_name;
    let userLastName = req.body.last_name;
    let updatedEmail = req.body.email;
    let updatedPhone = req.body.phone;
    const updatedUser = new User(userId, userFirstName, userLastName, updatedEmail, updatedPhone, null, 1);
    updatedUser.save();
    res.redirect('/admin/users');
  } if (req.body.form_action == 'delete') {
    User.deleteUserById(userId)
    .then(() => {
      res.redirect('/admin/users');
    })
    .catch(err => console.log(err));
  } else {
    res.redirect('/');
  }
}