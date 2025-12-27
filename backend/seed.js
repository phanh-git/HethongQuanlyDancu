require('dotenv').config();
const { sequelize, User, Household, Population, Complaint } = require('./models');

const seedDatabase = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Sync database (drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123',
      fullName: 'Quản trị viên',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true
    });
    console.log('✓ Created admin user (username: admin, password: admin123)');

    // Create team leader
    const teamLeader = await User.create({
      username: 'leader',
      password: 'leader123',
      fullName: 'Tổ trưởng Nguyễn Văn A',
      email: 'leader@example.com',
      role: 'team_leader',
      assignedArea: {
        ward: 'Phường 1',
        zone: 'Khu phố 1'
      },
      isActive: true
    });
    console.log('✓ Created team leader (username: leader, password: leader123)');

    // Create sample population for household 1
    const person1 = await Population.create({
      fullName: 'Nguyễn Văn Hùng',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'male',
      idNumber: '012345678901',
      idIssueDate: new Date('2015-01-10'),
      idIssuePlace: 'Hà Nội',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      occupation: 'Kỹ sư',
      education: 'university',
      relationshipToHead: 'head',
      residenceStatus: 'permanent',
      permanentResidenceDate: new Date('2010-03-20'),
      previousAddress: 'Hà Nội',
      householdId: null, // Will be updated after household creation
      createdById: adminUser.id
    });

    const person2 = await Population.create({
      fullName: 'Trần Thị Lan',
      dateOfBirth: new Date('1985-08-20'),
      gender: 'female',
      idNumber: '012345678902',
      idIssueDate: new Date('2015-01-10'),
      idIssuePlace: 'Hà Nội',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      occupation: 'Giáo viên',
      education: 'university',
      relationshipToHead: 'spouse',
      residenceStatus: 'permanent',
      permanentResidenceDate: new Date('2010-03-20'),
      previousAddress: 'Hải Phòng',
      householdId: null,
      createdById: adminUser.id
    });

    const person3 = await Population.create({
      fullName: 'Nguyễn Văn Minh',
      dateOfBirth: new Date('2015-03-10'),
      gender: 'male',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      relationshipToHead: 'child',
      residenceStatus: 'permanent',
      permanentResidenceDate: new Date('2015-03-10'),
      previousAddress: 'Mới sinh',
      isNewborn: true,
      householdId: null,
      createdById: adminUser.id
    });

    // Create household 1
    const household1 = await Household.create({
      householdHeadId: person1.id,
      address: {
        houseNumber: '123',
        street: 'Nguyễn Trãi',
        ward: 'Phường 1',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh'
      },
      status: 'active',
      createdById: adminUser.id,
      history: [{
        date: new Date(),
        event: 'created',
        description: 'Hộ khẩu được tạo mới'
      }]
    });

    // Update population with household reference
    await person1.update({ householdId: household1.id });
    await person2.update({ householdId: household1.id });
    await person3.update({ householdId: household1.id });

    console.log('✓ Created sample household 1 with 3 members');

    // Create sample population for household 2
    const person4 = await Population.create({
      fullName: 'Lê Văn Bình',
      dateOfBirth: new Date('1975-12-05'),
      gender: 'male',
      idNumber: '012345678903',
      idIssueDate: new Date('2015-01-10'),
      idIssuePlace: 'TP. HCM',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      occupation: 'Bác sĩ',
      education: 'postgraduate',
      relationshipToHead: 'head',
      residenceStatus: 'permanent',
      permanentResidenceDate: new Date('2005-06-15'),
      previousAddress: 'Đà Nẵng',
      householdId: null,
      createdById: adminUser.id
    });

    const person5 = await Population.create({
      fullName: 'Phạm Thị Hoa',
      dateOfBirth: new Date('1978-04-18'),
      gender: 'female',
      idNumber: '012345678904',
      idIssueDate: new Date('2015-01-10'),
      idIssuePlace: 'TP. HCM',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      occupation: 'Y tá',
      education: 'college',
      relationshipToHead: 'spouse',
      residenceStatus: 'permanent',
      permanentResidenceDate: new Date('2005-06-15'),
      previousAddress: 'Huế',
      householdId: null,
      createdById: adminUser.id
    });

    // Create household 2
    const household2 = await Household.create({
      householdHeadId: person4.id,
      address: {
        houseNumber: '456',
        street: 'Lê Lợi',
        ward: 'Phường 2',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh'
      },
      status: 'active',
      createdById: adminUser.id,
      history: [{
        date: new Date(),
        event: 'created',
        description: 'Hộ khẩu được tạo mới'
      }]
    });

    await person4.update({ householdId: household2.id });
    await person5.update({ householdId: household2.id });

    console.log('✓ Created sample household 2 with 2 members');

    // Create sample complaints
    await Complaint.create({
      submittedBy: [person1.id],
      category: 'infrastructure',
      title: 'Cống thoát nước bị hỏng',
      description: 'Cống thoát nước trước nhà số 123 bị hỏng, nước chảy tràn ra đường',
      status: 'received',
      priority: 'high',
      createdById: adminUser.id,
      statusHistory: [{
        status: 'received',
        date: new Date(),
        note: 'Đã tiếp nhận phản ánh',
        updatedById: adminUser.id
      }]
    });

    await Complaint.create({
      submittedBy: [person4.id, person5.id],
      category: 'environment',
      title: 'Rác thải chưa được thu gom',
      description: 'Rác thải tại khu vực phường 2 đã 3 ngày chưa được thu gom',
      status: 'in_progress',
      priority: 'medium',
      createdById: adminUser.id,
      statusHistory: [
        {
          status: 'received',
          date: new Date(),
          note: 'Đã tiếp nhận phản ánh',
          updatedById: adminUser.id
        },
        {
          status: 'in_progress',
          date: new Date(),
          note: 'Đang liên hệ đơn vị thu gom rác',
          updatedById: teamLeader.id
        }
      ]
    });

    console.log('✓ Created 2 sample complaints');

    console.log('\n========================================');
    console.log('Database seeding completed successfully!');
    console.log('========================================');
    console.log('\nSample users created:');
    console.log('1. Admin - username: admin, password: admin123');
    console.log('2. Team Leader - username: leader, password: leader123');
    console.log('\nSample data created:');
    console.log('- 2 households');
    console.log('- 5 people');
    console.log('- 2 complaints');
    console.log('\nYou can now start the application and login!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


