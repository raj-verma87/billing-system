'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bills', 'discount', {
      type: Sequelize.FLOAT,
      allowNull: true, // It can be null if no discount is applied
      defaultValue: 0, // Default value of 0 if no discount is provided
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bills', 'discount');
  }
};
