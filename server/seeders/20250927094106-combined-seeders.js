'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambahkan data Categories
    await queryInterface.bulkInsert('Categories', [
      { name: 'Roti', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kue', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Donat', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kue Kering', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Tambahkan data Users
    const passwordHash = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@aisya.com',
      password: passwordHash,
      role: 'admin',
      address: 'Jl. Merdeka No. 1, Jakarta',
      phoneNumber: '08123456789',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'User Example',
      email: 'user@example.com',
      password: passwordHash,
      role: 'user',
      address: 'Jl. Contoh No. 2, Bandung',
      phoneNumber: '08987654321',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Ambil ID kategori yang baru dibuat
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM Categories;`
    );
    const categoryIds = categories[0].map(c => c.id);

    // Ambil ID pengguna yang baru dibuat
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users;`
    );
    const userIds = users[0].map(u => u.id);

    // Tambahkan data Products
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Roti Gandum Utuh',
        description: 'Roti sehat dan lezat terbuat dari gandum utuh pilihan.',
        price: 15000,
        stock: 50,
        imageUrl: '/uploads/products/roti_gandum.jpg',
        categoryId: categoryIds[0],
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kue Cokelat Klasik',
        description: 'Kue cokelat kaya rasa dengan taburan serpihan cokelat.',
        price: 25000,
        stock: 30,
        imageUrl: '/uploads/products/kue_cokelat.jpg',
        categoryId: categoryIds[1],
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Donat Gula Halus',
        description: 'Donat lembut bertabur gula halus, cocok untuk sarapan.',
        price: 5000,
        stock: 100,
        imageUrl: '/uploads/products/donat.jpg',
        categoryId: categoryIds[2],
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kue Kering Kacang',
        description: 'Kue kering dengan rasa kacang gurih dan renyah.',
        price: 40000,
        stock: 80,
        imageUrl: '/uploads/products/kue_kering.jpg',
        categoryId: categoryIds[3],
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);

    // Ambil ID produk yang baru dibuat
    const products = await queryInterface.sequelize.query(
      `SELECT id FROM Products;`
    );
    const productIds = products[0].map(p => p.id);

    // Tambahkan data Orders
    await queryInterface.bulkInsert('Orders', [
      {
        userId: userIds[1],
        total: 25000,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    // Ambil ID order yang baru dibuat
    const orders = await queryInterface.sequelize.query(
      `SELECT id FROM Orders;`
    );
    const orderIds = orders[0].map(o => o.id);

    // Tambahkan data OrderItems
    await queryInterface.bulkInsert('OrderItems', [
      {
        orderId: orderIds[0],
        productId: productIds[1],
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    
    // Tambahkan data Testimonials
    await queryInterface.bulkInsert('Testimonials', [
      {
        name: 'Jane Doe',
        comment: 'Roti dan kuenya sangat lezat! Pelayanan cepat dan ramah. Sangat direkomendasikan!',
        avatar: 'uploads/testimonials/1758955776329.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Smith',
        comment: 'Saya sangat suka Donat Gula Halus mereka. Cocok untuk sarapan. Pasti akan membeli lagi.',
        avatar: 'uploads/testimonials/1758956302452.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shakilla Shop',
        comment: 'Kue cokelatnya luar biasa! Manisnya pas dan teksturnya lembut. Produk unggulan yang sempurna.',
        avatar: 'uploads/testimonials/1758955739823.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Testimonials', null, {});
  }
};