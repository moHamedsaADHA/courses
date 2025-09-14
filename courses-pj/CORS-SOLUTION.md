# 🌐 حل مشكلة CORS - دليل التشخيص والحلول

## 🚨 المشكلة
```
Access to fetch at 'http://localhost:3000/api/users/' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ الحلول المطبقة

### 1. تثبيت حزمة CORS
```bash
npm install cors
```

### 2. إعداد CORS في الخادم
تم إضافة إعدادات CORS شاملة في `src/app.js`:

```javascript
import cors from "cors";

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:8080',
    'http://localhost:8000',
    environment.CORS_ORIGIN
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 3. معالجة Preflight Requests
```javascript
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## 🔧 خطوات التشخيص

### 1. تشغيل الخادم
```bash
cd "d:\New folder (5)\courses\courses-pj"
npm start
```

### 2. فتح ملف الاختبار
افتح `cors-test.html` في المتصفح عبر Live Server أو أي خادم محلي

### 3. مراقبة Console
- تحقق من console الخادم لرؤية الطلبات الواردة
- تحقق من console المتصفح لرؤية أي أخطاء

## 🌐 Origins المدعومة

### تلقائياً:
- `http://localhost:3000` (الخادم نفسه)
- `http://localhost:5500` (Live Server)
- `http://127.0.0.1:5500` (Live Server IP)
- `http://localhost:8080` (خوادم التطوير)
- `http://localhost:8000` (خوادم التطوير)

### عبر متغير البيئة:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500
```

## 🛠️ حلول إضافية

### 1. إذا استمرت المشكلة - تعطيل الأمان مؤقتاً
```javascript
// للتطوير فقط - ليس للإنتاج!
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});
```

### 2. إعدادات المتصفح (Chrome)
```bash
# تشغيل Chrome بدون أمان CORS (للتطوير فقط)
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
```

### 3. استخدام Proxy في التطوير
```javascript
// في حالة استخدام Vite أو Create React App
{
  "proxy": "http://localhost:3000"
}
```

## 🧪 اختبار CORS

### 1. اختبار بسيط بـ cURL
```bash
# اختبار Preflight
curl -X OPTIONS http://localhost:3000/api/users/ \
  -H "Origin: http://127.0.0.1:5500" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# اختبار POST request
curl -X POST http://localhost:3000/api/users/ \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d '{"name":"Test User","email":"test@example.com"}' \
  -v
```

### 2. اختبار JavaScript
```javascript
// اختبار في console المتصفح
fetch('http://localhost:3000/api/users/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'محمد أحمد علي السيد',
    email: 'test@example.com',
    password: 'TestPass123',
    location: 'القاهرة',
    grade: 'الصف الثالث الثانوي'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
```

## 📝 ملاحظات مهمة

### للتطوير:
- ✅ CORS مفتوح لجميع localhost ports
- ✅ تسجيل الطلبات في console
- ✅ دعم جميع HTTP methods

### للإنتاج:
- ⚠️ يجب تحديد Origins محددة فقط
- ⚠️ إزالة تسجيل الطلبات
- ⚠️ تفعيل HTTPS

### أخطاء شائعة:
1. **عدم تشغيل الخادم**: تأكد من أن الخادم يعمل على المنفذ الصحيح
2. **Origin مختلف**: تأكد من أن الطلب يأتي من Origin مسموح
3. **Headers خاطئة**: تأكد من إرسال Content-Type الصحيح
4. **Method غير مدعوم**: تأكد من أن HTTP method مضاف للقائمة المسموحة

## 🎯 ملف الاختبار

استخدم `cors-test.html` لاختبار جميع endpoints:
1. تسجيل مستخدم جديد
2. تسجيل الدخول  
3. الحصول على الكورسات

---

**تاريخ الحل:** سبتمبر 2025  
**الحالة:** ✅ تم الحل