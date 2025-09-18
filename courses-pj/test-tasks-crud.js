/**
 * 🧪 اختبار شامل لنظام إدارة المهام والواجبات
 * يتضمن اختبارات لجميع العمليات CRUD والمسارات المخصصة للصفوف
 */

console.log('🚀 بدء اختبار نظام المهام والواجبات...\n');

// بيانات اختبار المهام
const testTasks = [
  {
    title: "مراجعة الوحدة الأولى في الفيزياء",
    description: "حل جميع تمارين الوحدة الأولى في كتاب الفيزياء مع التركيز على قوانين نيوتن والحركة",
    dueDate: new Date('2024-02-15T23:59:59Z'),
    grade: "الصف الثالث الثانوي علمي",
    subject: "فيزياء",
    priority: "عالي",
    attachments: [
      {
        filename: "تمارين_الوحدة_الأولى.pdf",
        url: "https://example.com/files/physics-unit1.pdf"
      }
    ]
  },
  {
    title: "كتابة موضوع تعبير عن البيئة",
    description: "كتابة موضوع تعبير شامل عن أهمية المحافظة على البيئة لا يقل عن 300 كلمة",
    dueDate: new Date('2024-02-10T23:59:59Z'),
    grade: "الصف الثاني الثانوي ادبي", 
    subject: "لغة عربية",
    priority: "متوسط"
  },
  {
    title: "حل مسائل المعادلات التفاضلية",
    description: "حل جميع المسائل في الفصل الخامس من كتاب الرياضيات المتعلقة بالمعادلات التفاضلية",
    dueDate: new Date('2024-02-20T23:59:59Z'),
    grade: "الصف الثاني الثانوي علمي",
    subject: "رياضيات",
    priority: "عاجل"
  },
  {
    title: "قراءة الفصل الثالث من رواية أولاد حارتنا",
    description: "قراءة وتحليل الفصل الثالث من رواية أولاد حارتنا لنجيب محفوظ مع كتابة ملخص",
    dueDate: new Date('2024-02-12T23:59:59Z'),
    grade: "الصف الأول الثانوي",
    subject: "أدب عربي",
    priority: "منخفض"
  },
  {
    title: "مشروع بحثي عن الثورة الفرنسية",
    description: "إعداد بحث شامل عن أسباب ونتائج الثورة الفرنسية مع المراجع والمصادر",
    dueDate: new Date('2024-03-01T23:59:59Z'),
    grade: "الصف الثالث الثانوي ادبي",
    subject: "تاريخ",
    priority: "عالي"
  }
];

// متغيرات عامة للاختبار
const baseURL = 'http://localhost:3000/api';
let authToken = '';
let createdTaskIds = [];

// دالة مساعدة للطلبات HTTP
async function makeRequest(method, url, data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // إضافة Token للطلبات المحمية
  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  // إضافة البيانات للطلبات POST/PUT
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    return {
      status: response.status,
      data: result,
      success: response.ok
    };
  } catch (error) {
    console.error(`❌ خطأ في الطلب ${method} ${url}:`, error.message);
    return {
      status: 0,
      data: { message: error.message },
      success: false
    };
  }
}

// دالة تسجيل الدخول للحصول على Token
async function loginAsTeacher() {
  console.log('🔐 تسجيل الدخول كمدرس...');
  
  const loginData = {
    email: "teacher@example.com", // تأكد من وجود هذا المدرس في قاعدة البيانات
    password: "123456789"
  };

  const result = await makeRequest('POST', `${baseURL}/users/login`, loginData);
  
  if (result.success) {
    authToken = result.data.token;
    console.log('✅ تم تسجيل الدخول بنجاح');
    console.log(`👤 المستخدم: ${result.data.user.name} (${result.data.user.role})\n`);
    return true;
  } else {
    console.log('❌ فشل تسجيل الدخول:', result.data.message);
    return false;
  }
}

// اختبار إنشاء المهام
async function testCreateTasks() {
  console.log('📝 اختبار إنشاء المهام...');
  
  for (let i = 0; i < testTasks.length; i++) {
    const task = testTasks[i];
    console.log(`إنشاء المهمة ${i + 1}: ${task.title}`);
    
    const result = await makeRequest('POST', `${baseURL}/tasks`, task);
    
    if (result.success) {
      console.log(`✅ تم إنشاء المهمة: ${result.data.data.title}`);
      createdTaskIds.push(result.data.data._id);
    } else {
      console.log(`❌ فشل إنشاء المهمة: ${result.data.message}`);
    }
  }
  
  console.log(`📊 تم إنشاء ${createdTaskIds.length} مهمة من أصل ${testTasks.length}\n`);
}

// اختبار جلب جميع المهام
async function testGetAllTasks() {
  console.log('📋 اختبار جلب جميع المهام...');
  
  const result = await makeRequest('GET', `${baseURL}/tasks?page=1&limit=10`);
  
  if (result.success) {
    console.log(`✅ تم جلب ${result.data.data.length} مهمة`);
    console.log(`📊 إجمالي المهام: ${result.data.pagination.totalTasks}`);
    
    if (result.data.statistics) {
      console.log('📈 الإحصائيات:', JSON.stringify(result.data.statistics, null, 2));
    }
  } else {
    console.log('❌ فشل في جلب المهام:', result.data.message);
  }
  
  console.log('');
}

// اختبار جلب مهمة واحدة
async function testGetSingleTask() {
  if (createdTaskIds.length === 0) {
    console.log('⚠️ لا توجد مهام لاختبار جلب مهمة واحدة\n');
    return;
  }
  
  console.log('🔍 اختبار جلب مهمة واحدة...');
  
  const taskId = createdTaskIds[0];
  const result = await makeRequest('GET', `${baseURL}/tasks/${taskId}`);
  
  if (result.success) {
    console.log(`✅ تم جلب المهمة: ${result.data.data.title}`);
    console.log(`📅 تاريخ التسليم: ${result.data.data.dueDate}`);
    console.log(`🎯 الأولوية: ${result.data.data.priority}`);
    
    if (result.data.data.additionalInfo) {
      console.log('ℹ️ معلومات إضافية:', result.data.data.additionalInfo);
    }
  } else {
    console.log('❌ فشل في جلب المهمة:', result.data.message);
  }
  
  console.log('');
}

// اختبار تحديث مهمة
async function testUpdateTask() {
  if (createdTaskIds.length === 0) {
    console.log('⚠️ لا توجد مهام لاختبار التحديث\n');
    return;
  }
  
  console.log('✏️ اختبار تحديث مهمة...');
  
  const taskId = createdTaskIds[0];
  const updateData = {
    priority: "عاجل",
    status: "نشط",
    description: "وصف محدث - تم إضافة معلومات جديدة للمهمة"
  };
  
  const result = await makeRequest('PUT', `${baseURL}/tasks/${taskId}`, updateData);
  
  if (result.success) {
    console.log(`✅ تم تحديث المهمة: ${result.data.data.title}`);
    console.log(`🆕 الأولوية الجديدة: ${result.data.data.priority}`);
    console.log(`📝 الوصف الجديد: ${result.data.data.description.substring(0, 50)}...`);
  } else {
    console.log('❌ فشل في تحديث المهمة:', result.data.message);
  }
  
  console.log('');
}

// اختبار المهام حسب الصف
async function testTasksByGrade() {
  console.log('🎓 اختبار جلب المهام حسب الصفوف...');
  
  const gradeEndpoints = [
    { name: 'الصف الأول الثانوي', endpoint: 'first-secondary' },
    { name: 'الصف الثاني الثانوي علمي', endpoint: 'second-secondary-science' },
    { name: 'الصف الثاني الثانوي أدبي', endpoint: 'second-secondary-literature' },
    { name: 'الصف الثالث الثانوي علمي', endpoint: 'third-secondary-science' },
    { name: 'الصف الثالث الثانوي أدبي', endpoint: 'third-secondary-literature' }
  ];
  
  for (const grade of gradeEndpoints) {
    console.log(`📚 اختبار ${grade.name}...`);
    
    const result = await makeRequest('GET', `${baseURL}/tasks/grade/${grade.endpoint}?limit=5`);
    
    if (result.success) {
      console.log(`  ✅ ${result.data.data.length} مهام موجودة`);
      
      if (result.data.statistics && result.data.statistics.gradeOverview) {
        const stats = result.data.statistics.gradeOverview;
        console.log(`  📊 إحصائيات: ${stats.totalTasks} إجمالي | ${stats.activeTasks} نشطة | ${stats.urgentTasks} عاجلة`);
      }
      
      if (result.data.statistics && result.data.statistics.subjectBreakdown) {
        const subjects = result.data.statistics.subjectBreakdown.slice(0, 3);
        console.log(`  📖 أكثر المواد: ${subjects.map(s => `${s._id} (${s.count})`).join(', ')}`);
      }
    } else {
      console.log(`  ❌ فشل في جلب مهام ${grade.name}: ${result.data.message}`);
    }
  }
  
  console.log('');
}

// اختبار البحث والفلترة
async function testSearchAndFilter() {
  console.log('🔍 اختبار البحث والفلترة...');
  
  // البحث النصي
  console.log('🔎 اختبار البحث النصي...');
  let result = await makeRequest('GET', `${baseURL}/tasks?search=فيزياء`);
  if (result.success) {
    console.log(`  ✅ البحث عن "فيزياء": ${result.data.data.length} نتيجة`);
  }
  
  // فلترة حسب الأولوية
  console.log('🎯 اختبار فلترة الأولوية...');
  result = await makeRequest('GET', `${baseURL}/tasks?priority=عاجل`);
  if (result.success) {
    console.log(`  ✅ المهام العاجلة: ${result.data.data.length} مهمة`);
  }
  
  // فلترة حسب الحالة
  console.log('📋 اختبار فلترة الحالة...');
  result = await makeRequest('GET', `${baseURL}/tasks?status=نشط`);
  if (result.success) {
    console.log(`  ✅ المهام النشطة: ${result.data.data.length} مهمة`);
  }
  
  // فلترة متعددة
  console.log('🔄 اختبار فلترة متعددة...');
  result = await makeRequest('GET', `${baseURL}/tasks?grade=الصف الثالث الثانوي علمي&priority=عالي&status=نشط`);
  if (result.success) {
    console.log(`  ✅ الصف الثالث علمي + أولوية عالية + نشطة: ${result.data.data.length} مهمة`);
  }
  
  console.log('');
}

// اختبار حذف مهمة
async function testDeleteTask() {
  if (createdTaskIds.length === 0) {
    console.log('⚠️ لا توجد مهام للحذف\n');
    return;
  }
  
  console.log('🗑️ اختبار حذف مهمة...');
  
  const taskId = createdTaskIds.pop(); // حذف آخر مهمة
  const result = await makeRequest('DELETE', `${baseURL}/tasks/${taskId}`);
  
  if (result.success) {
    console.log(`✅ تم حذف المهمة: ${result.data.data.deletedTask.title}`);
    console.log(`🕒 وقت الحذف: ${result.data.data.deletedAt}`);
    console.log(`👤 تم الحذف بواسطة: ${result.data.data.deletedBy}`);
  } else {
    console.log('❌ فشل في حذف المهمة:', result.data.message);
  }
  
  console.log('');
}

// اختبار الأخطاء الشائعة
async function testErrorHandling() {
  console.log('⚠️ اختبار معالجة الأخطاء...');
  
  // محاولة إنشاء مهمة ببيانات ناقصة
  console.log('📝 اختبار بيانات ناقصة...');
  let result = await makeRequest('POST', `${baseURL}/tasks`, {
    title: "مهمة ناقصة" // نقص الحقول المطلوبة
  });
  
  if (!result.success && result.status === 400) {
    console.log('  ✅ تم اكتشاف البيانات الناقصة بنجاح');
    console.log(`  📋 عدد الأخطاء: ${result.data.errors ? result.data.errors.length : 0}`);
  }
  
  // محاولة جلب مهمة غير موجودة
  console.log('🔍 اختبار مهمة غير موجودة...');
  result = await makeRequest('GET', `${baseURL}/tasks/507f1f77bcf86cd799439011`);
  
  if (!result.success && result.status === 404) {
    console.log('  ✅ تم اكتشاف المهمة غير الموجودة بنجاح');
  }
  
  // محاولة جلب مهمة بمعرف خاطئ
  console.log('🆔 اختبار معرف خاطئ...');
  result = await makeRequest('GET', `${baseURL}/tasks/invalid-id`);
  
  if (!result.success && result.status === 400) {
    console.log('  ✅ تم اكتشاف المعرف الخاطئ بنجاح');
  }
  
  console.log('');
}

// دالة عرض الملخص النهائي
async function showFinalSummary() {
  console.log('📊 الملخص النهائي للاختبار...');
  
  // جلب إحصائيات شاملة
  const result = await makeRequest('GET', `${baseURL}/tasks?limit=1`);
  
  if (result.success && result.data.pagination) {
    console.log(`📈 إجمالي المهام في النظام: ${result.data.pagination.totalTasks}`);
    
    if (result.data.statistics) {
      console.log('📊 إحصائيات الحالة:');
      if (result.data.statistics.statusCounts) {
        result.data.statistics.statusCounts.forEach(status => {
          console.log(`  - ${status._id}: ${status.count} مهمة`);
        });
      }
      
      if (result.data.statistics.priorityCounts) {
        console.log('🎯 إحصائيات الأولوية:');
        result.data.statistics.priorityCounts.forEach(priority => {
          console.log(`  - ${priority._id}: ${priority.count} مهمة`);
        });
      }
    }
  }
  
  console.log(`🆔 المهام المتبقية من الاختبار: ${createdTaskIds.length}`);
  console.log('');
}

// الدالة الرئيسية للاختبار
async function runTasksTest() {
  console.log('🎯 بدء اختبار شامل لنظام إدارة المهام والواجبات\n');
  console.log('=' .repeat(60));
  
  try {
    // تسجيل الدخول
    const loginSuccess = await loginAsTeacher();
    if (!loginSuccess) {
      console.log('❌ لا يمكن المتابعة بدون تسجيل الدخول');
      return;
    }
    
    // تشغيل جميع الاختبارات
    await testCreateTasks();
    await testGetAllTasks();
    await testGetSingleTask();
    await testUpdateTask();
    await testTasksByGrade();
    await testSearchAndFilter();
    await testDeleteTask();
    await testErrorHandling();
    await showFinalSummary();
    
    console.log('=' .repeat(60));
    console.log('🎉 تم الانتهاء من جميع اختبارات نظام المهام بنجاح!');
    console.log('📝 تحقق من النتائج أعلاه للتأكد من صحة جميع العمليات');
    
  } catch (error) {
    console.error('❌ حدث خطأ أثناء تشغيل الاختبارات:', error.message);
  }
}

// تشغيل الاختبار إذا تم تشغيل الملف مباشرة
if (typeof require !== 'undefined' && require.main === module) {
  // للبيئات التي تدعم Node.js modules
  runTasksTest();
} else {
  // للمتصفحات أو البيئات الأخرى
  console.log('📌 لتشغيل الاختبار، استخدم الأمر: node test-tasks-crud.js');
  console.log('أو استدعي الدالة: runTasksTest()');
}

// تصدير الدوال للاستخدام الخارجي
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runTasksTest,
    testCreateTasks,
    testGetAllTasks,
    testTasksByGrade,
    testSearchAndFilter
  };
}