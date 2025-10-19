const User = require("../models/UserModel");
const bcrypt = require('bcryptjs');

const InitializeAdmin = async () => {
  const superAdminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (superAdminExists) {
    console.log('Super Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

  const superAdmin = new User({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    firstName: process.env.ADMIN_FIRSTNAME,
    lastName: process.env.ADMIN_LASTNAME, // fixed typo (was same as firstname)
    role: process.env.ADMIN_ROLE,
  });

  const newSuperAdmin = await superAdmin.save();
  if (!newSuperAdmin) throw new Error('Super Admin failed to create');

  console.log('Super Admin created successfully.');
};

module.exports = InitializeAdmin;
