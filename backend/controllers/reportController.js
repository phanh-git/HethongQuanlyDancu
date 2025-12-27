const ExcelJS = require('exceljs');
const Population = require('../models/Population');
const Household = require('../models/Household');
const Complaint = require('../models/Complaint');

// @desc    Generate population report by age
// @route   GET /api/reports/population-by-age
// @access  Private
exports.generatePopulationByAgeReport = async (req, res) => {
  try {
    const { ageCategory, format = 'json' } = req.query;

    const population = await Population.find({ 
      isDead: false, 
      hasMovedOut: false 
    }).populate('household', 'householdCode address');

    let filteredPopulation = population;
    if (ageCategory) {
      filteredPopulation = population.filter(person => person.ageCategory === ageCategory);
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách nhân khẩu');

      // Add headers
      worksheet.columns = [
        { header: 'Họ và tên', key: 'fullName', width: 25 },
        { header: 'Ngày sinh', key: 'dateOfBirth', width: 15 },
        { header: 'Tuổi', key: 'age', width: 10 },
        { header: 'Giới tính', key: 'gender', width: 10 },
        { header: 'CMND/CCCD', key: 'idNumber', width: 15 },
        { header: 'Mã hộ khẩu', key: 'householdCode', width: 15 },
        { header: 'Địa chỉ', key: 'address', width: 40 }
      ];

      // Add data
      filteredPopulation.forEach(person => {
        worksheet.addRow({
          fullName: person.fullName,
          dateOfBirth: new Date(person.dateOfBirth).toLocaleDateString('vi-VN'),
          age: person.age,
          gender: person.gender === 'male' ? 'Nam' : person.gender === 'female' ? 'Nữ' : 'Khác',
          idNumber: person.idNumber || 'N/A',
          householdCode: person.household?.householdCode || 'N/A',
          address: person.household?.address.houseNumber || 'N/A'
        });
      });

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0066CC' }
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=danh-sach-nhan-khau.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.json({
        total: filteredPopulation.length,
        population: filteredPopulation
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate quarterly complaint report
// @route   GET /api/reports/complaints-quarterly
// @access  Private
exports.generateQuarterlyComplaintReport = async (req, res) => {
  try {
    const { year, quarter } = req.query;
    
    // Calculate quarter date range
    const quarterStartMonth = (quarter - 1) * 3;
    const startDate = new Date(year, quarterStartMonth, 1);
    const endDate = new Date(year, quarterStartMonth + 3, 0);

    const complaints = await Complaint.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
    const receivedComplaints = complaints.filter(c => c.status === 'received').length;

    const byCategory = complaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {});

    const report = {
      period: `Q${quarter}/${year}`,
      startDate,
      endDate,
      summary: {
        totalComplaints,
        resolvedComplaints,
        inProgressComplaints,
        receivedComplaints,
        resolutionRate: ((resolvedComplaints / totalComplaints) * 100).toFixed(2) + '%'
      },
      byCategory
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate household report
// @route   GET /api/reports/households
// @access  Private
exports.generateHouseholdReport = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const households = await Household.find({ status: 'active' })
      .populate('householdHead', 'fullName dateOfBirth idNumber')
      .populate('members');

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách hộ khẩu');

      worksheet.columns = [
        { header: 'Mã hộ', key: 'householdCode', width: 15 },
        { header: 'Chủ hộ', key: 'headName', width: 25 },
        { header: 'Số nhà', key: 'houseNumber', width: 15 },
        { header: 'Địa chỉ', key: 'fullAddress', width: 40 },
        { header: 'Số thành viên', key: 'memberCount', width: 15 }
      ];

      households.forEach(household => {
        worksheet.addRow({
          householdCode: household.householdCode,
          headName: household.householdHead?.fullName || 'N/A',
          houseNumber: household.address.houseNumber,
          fullAddress: `${household.address.street || ''}, ${household.address.ward || ''}, ${household.address.district || ''}`,
          memberCount: household.members.length
        });
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0066CC' }
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=danh-sach-ho-khau.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.json({
        total: households.length,
        households: households.map(h => ({
          householdCode: h.householdCode,
          householdHead: h.householdHead?.fullName,
          address: h.address,
          memberCount: h.members.length
        }))
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
