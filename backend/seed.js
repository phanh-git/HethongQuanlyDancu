require('dotenv').config();
const { sequelize, User, Household, Population, Complaint, ComplaintCategory } = require('./models');

const seedDatabase = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Sync database (drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create complaint categories first
    const categories = [
      { name: 'Hạ tầng - đô thị', description: 'Phản ánh về cơ sở hạ tầng và đô thị' },
      { name: 'Vệ sinh môi trường', description: 'Phản ánh về vệ sinh và môi trường' },
      { name: 'An ninh - Trật tự', description: 'Phản ánh về an ninh và trật tự' },
      { name: 'Hành chính - chính sách', description: 'Phản ánh về hành chính và chính sách' },
      { name: 'Trật tự xây dựng', description: 'Phản ánh về trật tự xây dựng' },
      { name: 'Đời sống xã hội', description: 'Phản ánh về đời sống xã hội' }
    ];

    const createdCategories = [];
    for (const cat of categories) {
      const category = await ComplaintCategory.create(cat);
      createdCategories.push(category);
    }
    console.log('✓ Created 6 complaint categories');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123',
      fullName: 'Quản trị viên',
      email: 'admin@example.com',
      citizenIdentificationCard: '001099001234',
      dateOfBirth: '1985-01-15',
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
      citizenIdentificationCard: '001088001234',
      dateOfBirth: '1978-03-20',
      role: 'team_leader',
      assignedArea: {
        ward: 'Phường 1',
        zone: 'Khu phố 1'
      },
      isActive: true
    });
    console.log('✓ Created team leader (username: leader, password: leader123)');

    // Create citizen users
    const citizen1 = await User.create({
      username: 'citizen1',
      password: 'citizen123',
      fullName: 'Trần Văn Bình',
      email: 'citizen1@example.com',
      citizenIdentificationCard: '012345678901',
      dateOfBirth: '1990-05-10',
      phone: '0901234567',
      role: 'resident',
      isActive: true
    });

    const citizen2 = await User.create({
      username: 'citizen2',
      password: 'citizen123',
      fullName: 'Lê Thị Lan',
      email: 'citizen2@example.com',
      citizenIdentificationCard: '012345678902',
      dateOfBirth: '1992-08-15',
      phone: '0902345678',
      role: 'resident',
      isActive: true
    });

    const citizen3 = await User.create({
      username: 'citizen3',
      password: 'citizen123',
      fullName: 'Phạm Minh Tuấn',
      email: 'citizen3@example.com',
      citizenIdentificationCard: '012345678903',
      dateOfBirth: '1988-12-25',
      phone: '0903456789',
      role: 'resident',
      isActive: true
    });

    const citizen4 = await User.create({
      username: 'citizen4',
      password: 'citizen123',
      fullName: 'Hoàng Thị Mai',
      email: 'citizen4@example.com',
      citizenIdentificationCard: '012345678904',
      dateOfBirth: '1995-02-14',
      phone: '0904567890',
      role: 'resident',
      isActive: true
    });

    console.log('✓ Created 4 resident users');


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
      householdCode: 'HK000001',
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
      householdCode: 'HK000002',
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
      submitterName: 'Nguyễn Văn Hùng',
      submitterPhone: '0901234567',
      submitterAddress: '123 Nguyễn Trãi, Phường 1, Quận 1',
      submissionDate: new Date(),
      categoryId: createdCategories[0].id, // Hạ tầng - đô thị
      title: 'Cống thoát nước bị hỏng',
      description: 'Cống thoát nước trước nhà số 123 bị hỏng, nước chảy tràn ra đường. Đề nghị sửa chữa gấp.',
      status: 'submitted',
      priority: 'high',
      createdById: adminUser.id,
      statusHistory: [{
        status: 'submitted',
        date: new Date(),
        note: 'Đã phản ánh',
        updatedById: adminUser.id
      }]
    });

    await Complaint.create({
      submitterName: 'Lê Văn Bình',
      submitterPhone: '0902345678',
      submitterAddress: '456 Lê Lợi, Phường 2, Quận 1',
      submissionDate: new Date(),
      categoryId: createdCategories[1].id, // Vệ sinh môi trường
      title: 'Rác thải chưa được thu gom',
      description: 'Rác thải tại khu vực phường 2 đã 3 ngày chưa được thu gom, gây ô nhiễm môi trường.',
      status: 'acknowledged',
      priority: 'medium',
      createdById: adminUser.id,
      statusHistory: [
        {
          status: 'submitted',
          date: new Date(),
          note: 'Đã phản ánh',
          updatedById: adminUser.id
        },
        {
          status: 'acknowledged',
          date: new Date(),
          note: 'Đã tiếp nhận phản ánh',
          updatedById: teamLeader.id
        }
      ]
    });

    await Complaint.create({
      submitterName: 'Phạm Thị Hoa',
      submitterPhone: '0903456789',
      submitterAddress: '456 Lê Lợi, Phường 2, Quận 1',
      submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      categoryId: createdCategories[2].id, // An ninh - Trật tự
      title: 'Chiếu sáng công cộng hỏng',
      description: 'Đèn đường tại đường Lê Lợi bị hỏng, gây mất an toàn giao thông vào ban đêm.',
      status: 'forwarded',
      priority: 'high',
      createdById: adminUser.id,
      assignedToId: teamLeader.id,
      statusHistory: [
        {
          status: 'submitted',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          note: 'Đã phản ánh',
          updatedById: adminUser.id
        },
        {
          status: 'acknowledged',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          note: 'Đã tiếp nhận phản ánh',
          updatedById: teamLeader.id
        },
        {
          status: 'forwarded',
          date: new Date(),
          note: 'Đang gửi lên cấp trên',
          updatedById: teamLeader.id
        }
      ]
    });

    console.log('✓ Created 3 sample complaints');

    console.log('\n========================================');
    console.log('Database seeding completed successfully!');
    console.log('========================================');
    console.log('\nSample users created:');
    console.log('1. Admin - username: admin, password: admin123');
    console.log('2. Team Leader - username: leader, password: leader123');
    console.log('3. Citizen 1 - username: citizen1, password: citizen123');
    console.log('4. Citizen 2 - username: citizen2, password: citizen123');
    console.log('5. Citizen 3 - username: citizen3, password: citizen123');
    console.log('6. Citizen 4 - username: citizen4, password: citizen123');
    console.log('\nComplaint Categories:');
    createdCategories.forEach((cat, idx) => {
      console.log(`${idx + 1}. ${cat.name}`);
    });
    console.log('\nSample data created:');
    console.log('- 2 households');
    console.log('- 5 people');
    console.log('- 3 complaints');
    console.log('\nYou can now start the application and login!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


