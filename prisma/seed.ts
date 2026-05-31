import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import ws from 'ws'

neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('开始初始化数据库...')

  // 清空现有数据（按外键依赖倒序删除）
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.investReturn.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.billingRecord.deleteMany()
  await prisma.careRecord.deleteMany()
  await prisma.staffMember.deleteMany()
  await prisma.elder.deleteMany()
  await prisma.purchaseOrderItem.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // 创建机构
  const headquartersOrg = await prisma.organization.create({
    data: {
      name: '郴和养老总部',
      code: 'CHENHE-HQ',
      address: '湖南省郴州市北湖区',
      phone: '0735-8888888',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
    },
  })

  const jiaheeOrg = await prisma.organization.create({
    data: {
      name: '嘉禾养老院',
      code: 'JIAHEE-001',
      address: '湖南省郴州市嘉禾县',
      phone: '0735-7777777',
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
    },
  })

  console.log('机构创建完成:', headquartersOrg.name, jiaheeOrg.name)

  // 密码加密
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 超级管理员
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@chenhe.com',
      password: hashedPassword,
      name: '系统管理员',
      phone: '13800138000',
      role: 'SUPER_ADMIN',
      organizationId: headquartersOrg.id,
    },
  })

  // 机构管理员
  const orgAdmin = await prisma.user.create({
    data: {
      email: 'orgadmin@jiahee.com',
      password: hashedPassword,
      name: '李院长',
      phone: '13800138001',
      role: 'ORG_ADMIN',
      organizationId: jiaheeOrg.id,
    },
  })

  // 护理人员
  const nurse = await prisma.user.create({
    data: {
      email: 'nurse@jiahee.com',
      password: hashedPassword,
      name: '张护士',
      phone: '13800138002',
      role: 'NURSE',
      organizationId: jiaheeOrg.id,
    },
  })

  // 家属
  const family = await prisma.user.create({
    data: {
      email: 'family@example.com',
      password: hashedPassword,
      name: '王小明',
      phone: '13800138003',
      role: 'FAMILY',
      organizationId: jiaheeOrg.id,
    },
  })

  // 投资人
  const investor = await prisma.user.create({
    data: {
      email: 'investor@example.com',
      password: hashedPassword,
      name: '赵投资人',
      phone: '13800138004',
      role: 'INVESTOR',
      organizationId: jiaheeOrg.id,
    },
  })

  console.log('用户创建完成')

  // 创建员工档案
  await prisma.staffMember.create({
    data: {
      userId: orgAdmin.id,
      position: '院长',
      department: '管理部',
      salary: 8000,
      organizationId: jiaheeOrg.id,
    },
  })

  await prisma.staffMember.create({
    data: {
      userId: nurse.id,
      position: '护理员',
      department: '护理部',
      salary: 4500,
      organizationId: jiaheeOrg.id,
    },
  })

  console.log('员工档案创建完成')

  // 创建老人
  const elder1 = await prisma.elder.create({
    data: {
      name: '刘奶奶',
      gender: '女',
      age: 78,
      idCard: '430523194601010001',
      phone: '13900139001',
      emergencyContact: '王小明',
      emergencyPhone: '13800138003',
      careLevel: 'B',
      roomNumber: '201',
      bedNumber: '1',
      admissionDate: new Date('2024-03-15'),
      status: 'ACTIVE',
      notes: '有高血压，需定期测量血压',
      organizationId: jiaheeOrg.id,
      familyUserId: family.id,
    },
  })

  const elder2 = await prisma.elder.create({
    data: {
      name: '陈爷爷',
      gender: '男',
      age: 85,
      idCard: '430523193901010002',
      phone: '13900139002',
      emergencyContact: '陈大明',
      emergencyPhone: '13900139100',
      careLevel: 'C',
      roomNumber: '202',
      bedNumber: '1',
      admissionDate: new Date('2023-08-20'),
      status: 'ACTIVE',
      notes: '行动不便，需要轮椅辅助，有糖尿病',
      organizationId: jiaheeOrg.id,
    },
  })

  console.log('老人信息创建完成:', elder1.name, elder2.name)

  // 创建护理记录
  await prisma.careRecord.createMany({
    data: [
      {
        elderId: elder1.id,
        nurseId: nurse.id,
        type: '日常护理',
        description: '协助洗漱、换衣，老人状态良好',
        temperature: 36.5,
        bloodPressure: '130/80',
        pulse: 72,
        mood: '愉快',
        organizationId: jiaheeOrg.id,
      },
      {
        elderId: elder1.id,
        nurseId: nurse.id,
        type: '健康检查',
        description: '测量血压偏高，已通知家属',
        temperature: 36.7,
        bloodPressure: '145/92',
        pulse: 78,
        mood: '平静',
        organizationId: jiaheeOrg.id,
      },
      {
        elderId: elder2.id,
        nurseId: nurse.id,
        type: '日常护理',
        description: '协助翻身、清洁，测血糖7.8mmol/L',
        temperature: 36.4,
        bloodPressure: '125/75',
        pulse: 68,
        weight: 65.5,
        mood: '一般',
        organizationId: jiaheeOrg.id,
      },
      {
        elderId: elder2.id,
        nurseId: nurse.id,
        type: '用药记录',
        description: '按时服用降糖药及降压药',
        organizationId: jiaheeOrg.id,
      },
    ],
  })

  console.log('护理记录创建完成')

  // 创建账单
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  // 用当月1日往前推，避免月底日期溢出（如5月31日 setMonth 3 = April 31 → May 1）
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

  await prisma.billingRecord.createMany({
    data: [
      // 当月：刘奶奶已缴
      {
        elderId: elder1.id,
        month: currentMonth,
        baseFee: 3000,
        careFee: 1500,
        medicineFee: 300,
        otherFee: 200,
        total: 5000,
        status: 'PAID',
        paidAt: new Date(),
        organizationId: jiaheeOrg.id,
      },
      // 当月：陈爷爷待缴
      {
        elderId: elder2.id,
        month: currentMonth,
        baseFee: 4000,
        careFee: 2500,
        medicineFee: 600,
        otherFee: 300,
        total: 7400,
        status: 'UNPAID',
        organizationId: jiaheeOrg.id,
      },
      // 上月：刘奶奶已缴
      {
        elderId: elder1.id,
        month: lastMonth,
        baseFee: 3000,
        careFee: 1500,
        medicineFee: 250,
        otherFee: 150,
        total: 4900,
        status: 'PAID',
        paidAt: new Date(lastMonth + '-28'),
        organizationId: jiaheeOrg.id,
      },
      // 上月：陈爷爷已缴
      {
        elderId: elder2.id,
        month: lastMonth,
        baseFee: 4000,
        careFee: 2500,
        medicineFee: 550,
        otherFee: 250,
        total: 7300,
        status: 'PAID',
        paidAt: new Date(lastMonth + '-25'),
        organizationId: jiaheeOrg.id,
      },
    ],
  })

  console.log('账单记录创建完成')

  // 创建投资记录（与商业计划书对齐：100万/3.1%/IRR28%）
  const investment = await prisma.investment.create({
    data: {
      investorId: investor.id,
      organizationId: jiaheeOrg.id,
      amount: 1000000,
      sharePercent: 3.1,
      productType: 'B',
      monthlyReturn: 8780,
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
    },
  })

  // 创建投资收益记录
  await prisma.investReturn.createMany({
    data: [
      {
        investmentId: investment.id,
        month: lastMonth,
        amount: 5000,
        status: 'PAID',
        paidAt: new Date(lastMonth + '-28'),
      },
      {
        investmentId: investment.id,
        month: currentMonth,
        amount: 5000,
        status: 'PENDING',
      },
    ],
  })

  console.log('投资记录创建完成')

  // 创建通知
  await prisma.notification.createMany({
    data: [
      {
        userId: orgAdmin.id,
        title: '账单提醒',
        content: '本月共有2笔账单未缴纳，请及时联系家属',
        type: 'WARNING',
        read: false,
      },
      {
        userId: nurse.id,
        title: '护理任务',
        content: '今日需要为陈爷爷进行翻身护理，请及时完成',
        type: 'INFO',
        read: false,
      },
      {
        userId: investor.id,
        title: '收益通知',
        content: `您${currentMonth}的月度收益5000元将于月底发放`,
        type: 'SUCCESS',
        read: false,
      },
    ],
  })

  // 创建消息
  await prisma.message.create({
    data: {
      fromUserId: orgAdmin.id,
      toUserId: family.id,
      content: '您好，刘奶奶本月账单已生成，请及时查看并缴纳',
      read: false,
    },
  })

  await prisma.message.create({
    data: {
      fromUserId: nurse.id,
      toUserId: orgAdmin.id,
      content: '陈爷爷今日血糖偏高，已记录在护理记录中，请知悉',
      read: false,
    },
  })

  console.log('通知和消息创建完成')

  // ── 供应商数据 ───────────────────────────────────────────
  const supplier1 = await prisma.supplier.create({
    data: {
      name: '嘉禾县绿源农产品配送中心',
      category: 'FOOD',
      contactName: '李老板',
      contactPhone: '13700137001',
      address: '湖南省郴州市嘉禾县农贸市场A区',
      rating: 4,
      status: 'ACTIVE',
      notes: '每日配送新鲜蔬菜水果，周一至周六送货',
      organizationId: jiaheeOrg.id,
    },
  })

  const supplier2 = await prisma.supplier.create({
    data: {
      name: '郴州市康泰医疗器械有限公司',
      category: 'EQUIPMENT',
      contactName: '王经理',
      contactPhone: '13700137002',
      address: '湖南省郴州市北湖区医疗器械园区',
      rating: 5,
      status: 'ACTIVE',
      notes: '提供轮椅、护理床、呼叫设备等',
      organizationId: jiaheeOrg.id,
    },
  })

  const supplier3 = await prisma.supplier.create({
    data: {
      name: '嘉禾县人民医院药剂科',
      category: 'MEDICINE',
      contactName: '张药师',
      contactPhone: '13700137003',
      address: '湖南省郴州市嘉禾县人民路88号',
      rating: 5,
      status: 'ACTIVE',
      notes: '老人常用药品直供，享院内优惠价',
      organizationId: jiaheeOrg.id,
    },
  })

  await prisma.supplier.create({
    data: {
      name: '郴州市洁康消耗品有限公司',
      category: 'CONSUMABLE',
      contactName: '陈主任',
      contactPhone: '13700137004',
      address: '湖南省郴州市苏仙区工业园',
      rating: 3,
      status: 'ACTIVE',
      notes: '提供纸尿裤、护理垫、清洁用品等耗材',
      organizationId: jiaheeOrg.id,
    },
  })

  // 采购订单
  const po1 = await prisma.purchaseOrder.create({
    data: {
      orderNo: 'PO-2026-0501',
      supplierId: supplier1.id,
      organizationId: jiaheeOrg.id,
      status: 'DELIVERED',
      totalAmount: 3600,
      expectedDate: new Date('2026-05-10'),
      deliveredDate: new Date('2026-05-10'),
      notes: '5月上旬食材采购',
      items: {
        create: [
          { itemName: '新鲜蔬菜（混合）', unit: '公斤', quantity: 150, unitPrice: 8, totalPrice: 1200 },
          { itemName: '猪肉', unit: '公斤', quantity: 80, unitPrice: 22, totalPrice: 1760 },
          { itemName: '鸡蛋', unit: '箱', quantity: 20, unitPrice: 32, totalPrice: 640 },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      orderNo: 'PO-2026-0502',
      supplierId: supplier3.id,
      organizationId: jiaheeOrg.id,
      status: 'APPROVED',
      totalAmount: 2850,
      expectedDate: new Date('2026-05-15'),
      notes: '5月常规用药补货',
      items: {
        create: [
          { itemName: '降压药（苯磺酸氨氯地平）', unit: '盒', quantity: 30, unitPrice: 35, totalPrice: 1050 },
          { itemName: '降糖药（二甲双胍）', unit: '盒', quantity: 40, unitPrice: 18, totalPrice: 720 },
          { itemName: '止痛药（布洛芬）', unit: '盒', quantity: 20, unitPrice: 12, totalPrice: 240 },
          { itemName: '消毒酒精', unit: '瓶', quantity: 20, unitPrice: 42, totalPrice: 840 },
        ],
      },
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      orderNo: 'PO-2026-0503',
      supplierId: supplier2.id,
      organizationId: jiaheeOrg.id,
      status: 'PENDING',
      totalAmount: 12800,
      expectedDate: new Date('2026-06-01'),
      notes: '新增床位护理设备采购',
      items: {
        create: [
          { itemName: '多功能护理床', unit: '张', quantity: 5, unitPrice: 1800, totalPrice: 9000 },
          { itemName: '移动式血压计', unit: '台', quantity: 3, unitPrice: 380, totalPrice: 1140 },
          { itemName: '指夹式血氧仪', unit: '个', quantity: 10, unitPrice: 86, totalPrice: 860 },
          { itemName: '轮椅（折叠式）', unit: '台', quantity: 4, unitPrice: 450, totalPrice: 1800 },
        ],
      },
    },
  })

  console.log('供应链数据创建完成')

  // ── 客户数据库（意向客户CRM） ─────────────────────────────
  await prisma.customer.createMany({
    data: [
      {
        name: '李大华',
        phone: '13600136001',
        gender: '男',
        age: 52,
        source: 'HOSPITAL',
        status: 'NEGOTIATING',
        elderName: '李奶奶',
        elderAge: 79,
        careNeed: 'B',
        budget: '4000-6000',
        visitDate: new Date('2026-05-20'),
        followUpDate: new Date('2026-06-01'),
        assignedTo: '李院长',
        notes: '从县人民医院出院后转介，本周约好参观',
        organizationId: jiaheeOrg.id,
      },
      {
        name: '张小燕',
        phone: '13600136002',
        gender: '女',
        age: 45,
        source: 'REFERRAL',
        status: 'VISITING',
        elderName: '张爷爷',
        elderAge: 83,
        careNeed: 'C',
        budget: '5000-8000',
        visitDate: new Date('2026-05-28'),
        followUpDate: new Date('2026-06-05'),
        assignedTo: '李院长',
        notes: '由刘奶奶家属王小明介绍，已完成初次参观',
        organizationId: jiaheeOrg.id,
      },
      {
        name: '周建国',
        phone: '13600136003',
        gender: '男',
        age: 58,
        source: 'ONLINE',
        status: 'LEAD',
        elderName: '周奶奶',
        elderAge: 76,
        careNeed: 'A',
        budget: '3000-4500',
        followUpDate: new Date('2026-06-03'),
        assignedTo: '李院长',
        notes: '通过59养老网在线咨询，需电话跟进',
        organizationId: jiaheeOrg.id,
      },
      {
        name: '王美兰',
        phone: '13600136004',
        gender: '女',
        age: 48,
        source: 'GOV',
        status: 'SIGNED',
        elderName: '王爷爷',
        elderAge: 88,
        careNeed: 'C',
        budget: '6000以上',
        visitDate: new Date('2026-05-10'),
        assignedTo: '李院长',
        notes: '民政局转介失能补贴老人，已签约，6月1日入住',
        organizationId: jiaheeOrg.id,
      },
      {
        name: '陈志远',
        phone: '13600136005',
        gender: '男',
        age: 50,
        source: 'WALK_IN',
        status: 'LOST',
        elderName: '陈奶奶',
        elderAge: 74,
        careNeed: 'A',
        budget: '2500-3500',
        visitDate: new Date('2026-04-15'),
        assignedTo: '李院长',
        notes: '直接来访，因价格问题未成交，已选择其他机构',
        organizationId: jiaheeOrg.id,
      },
    ],
  })

  console.log('客户数据库创建完成')
  console.log('\n数据库初始化完成！')
  console.log('\n测试账号：')
  console.log('超级管理员: admin@chenhe.com / admin123')
  console.log('机构管理员: orgadmin@jiahee.com / admin123')
  console.log('护理人员: nurse@jiahee.com / admin123')
  console.log('家属: family@example.com / admin123')
  console.log('投资人: investor@example.com / admin123')
}

main()
  .catch((e) => {
    console.error('初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
