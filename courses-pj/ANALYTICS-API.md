# 📊 Analytics API Documentation

## Overview
The Analytics API provides comprehensive dashboard analytics for administrators and instructors to monitor platform performance, user engagement, and content statistics.

### Base URL
- **Production:** `https://courses-nine-eta.vercel.app/api`
- **Local Development:** `http://localhost:3000/api`

---

## 📈 Dashboard Analytics Endpoint

### `GET /analytics/dashboard`

**Description:** Retrieves comprehensive analytics data for administrators and instructors including user statistics, content metrics, and system performance indicators.

### Authentication Required
- **Token Type:** Bearer Token (Access Token)
- **Required Roles:** `admin`, `instructor`
- **Authorization Header:** `Authorization: Bearer <access_token>`

### Request Format
```http
GET /api/analytics/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Frontend Implementation
```javascript
// JavaScript/React Example
const getAnalytics = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch('/api/analytics/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Analytics data:', data.data);
      return data.data;
    } else {
      console.error('Failed to fetch analytics:', data.message);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};

// React Component Example
import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>Failed to load analytics</div>;

  return (
    <div className="analytics-dashboard">
      <h2>📊 Dashboard Analytics</h2>
      
      {/* User Statistics */}
      <div className="analytics-section">
        <h3>👥 User Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{analytics.users.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h4>Active Students</h4>
            <p>{analytics.users.activeStudents}</p>
          </div>
          <div className="stat-card">
            <h4>Active Instructors</h4>
            <p>{analytics.users.activeInstructors}</p>
          </div>
          <div className="stat-card">
            <h4>Admins</h4>
            <p>{analytics.users.admins}</p>
          </div>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="analytics-section">
        <h3>📚 Content Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Lessons</h4>
            <p>{analytics.content.totalLessons}</p>
          </div>
          <div className="stat-card">
            <h4>Total Quizzes</h4>
            <p>{analytics.content.totalQuizzes}</p>
          </div>
          <div className="stat-card">
            <h4>Total Tasks</h4>
            <p>{analytics.content.totalTasks}</p>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="analytics-section">
        <h3>🎓 Grade Distribution</h3>
        {analytics.gradeDistribution.map((grade, index) => (
          <div key={index} className="grade-stat">
            <span>{grade._id}</span>
            <span>{grade.count} items</span>
          </div>
        ))}
      </div>

      {/* Students by Grade */}
      <div className="analytics-section">
        <h3>👨‍🎓 Students by Grade</h3>
        {analytics.studentsByGrade.map((gradeData, index) => (
          <div key={index} className="grade-stat">
            <span>{gradeData.grade}</span>
            <span>{gradeData.students} students</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="analytics-section">
        <h3>🕒 Recent Activity</h3>
        <div className="activity-grid">
          <div className="activity-card">
            <h4>New Users (Last 7 days)</h4>
            <p>{analytics.recentActivity.newUsersLastWeek}</p>
          </div>
          <div className="activity-card">
            <h4>New Content (Last 7 days)</h4>
            <p>{analytics.recentActivity.newContentLastWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "message": "تم جلب التحليلات بنجاح",
  "data": {
    "users": {
      "totalUsers": 157,
      "activeStudents": 125,
      "activeInstructors": 18,
      "admins": 3,
      "verifiedUsers": 142,
      "unverifiedUsers": 15
    },
    "content": {
      "totalLessons": 234,
      "totalQuizzes": 89,
      "totalTasks": 156
    },
    "gradeDistribution": [
      {
        "_id": "الصف الأول الثانوي",
        "count": 67
      },
      {
        "_id": "الصف الثاني الثانوي علمي",
        "count": 89
      },
      {
        "_id": "الصف الثاني الثانوي ادبي",
        "count": 45
      },
      {
        "_id": "الصف الثالث الثانوي علمي",
        "count": 78
      },
      {
        "_id": "الصف الثالث الثانوي ادبي",
        "count": 34
      }
    ],
    "contentByGrade": {
      "courses": [
        {
          "_id": "الصف الأول الثانوي",
          "count": 12
        },
        {
          "_id": "الصف الثاني الثانوي علمي",
          "count": 15
        }
      ],
      "lessons": [
        {
          "_id": "الصف الأول الثانوي",
          "count": 45
        },
        {
          "_id": "الصف الثاني الثانوي علمي",
          "count": 67
        }
      ],
      "quizzes": [
        {
          "_id": "الصف الأول الثانوي",
          "count": 23
        },
        {
          "_id": "الصف الثاني الثانوي علمي",
          "count": 28
        }
      ],
      "tasks": [
        {
          "_id": "الصف الأول الثانوي",
          "count": 34
        },
        {
          "_id": "الصف الثاني الثانوي علمي",
          "count": 45
        }
      ]
    },
    "studentsByGrade": [
      {
        "grade": "الصف الأول الثانوي",
        "students": 25
      },
      {
        "grade": "الصف الثاني الثانوي علمي",
        "students": 32
      },
      {
        "grade": "الصف الثاني الثانوي ادبي", 
        "students": 18
      },
      {
        "grade": "الصف الثالث الثانوي علمي",
        "students": 28
      },
      {
        "grade": "الصف الثالث الثانوي ادبي",
        "students": 15
      }
    ],
    "recentActivity": {
      "newUsersLastWeek": 12,
      "newContentLastWeek": 23,
      "newUsersLastMonth": 45,
      "newContentLastMonth": 89
    },
    "systemStats": {
      "totalDocuments": 623,
      "databaseSize": "2.4MB",
      "lastUpdated": "2025-01-20T10:30:00Z"
    }
  }
}
```

#### Error Responses

**401 - Unauthorized**
```json
{
  "success": false,
  "message": "خطأ في التحقق من المصادقة"
}
```

**403 - Forbidden (Not Admin/Instructor)**
```json
{
  "success": false,
  "message": "غير مصرح لك بالوصول لهذه البيانات"
}
```

**500 - Internal Server Error**
```json
{
  "success": false,
  "message": "خطأ في الخادم أثناء جلب التحليلات"
}
```

---

## 📊 Analytics Data Structure

### User Statistics
- **totalUsers:** Total number of registered users
- **activeStudents:** Number of verified students
- **activeInstructors:** Number of verified instructors  
- **admins:** Number of admin users
- **verifiedUsers:** Users who completed email verification
- **unverifiedUsers:** Users pending email verification

### Content Statistics
- **totalLessons:** Total number of lessons across all courses
- **totalQuizzes:** Total number of quizzes available
- **totalTasks:** Total number of tasks/assignments

### Students by Grade
Array of student counts for each academic grade:
- **grade:** Academic grade name (in Arabic)
- **students:** Number of verified students in that grade

### Grade Distribution
Distribution of content across different academic grades:
- الصف الأول الثانوي (First Secondary Grade)
- الصف الثاني الثانوي علمي (Second Secondary - Science)
- الصف الثاني الثانوي ادبي (Second Secondary - Literature)
- الصف الثالث الثانوي علمي (Third Secondary - Science)
- الصف الثالث الثانوي ادبي (Third Secondary - Literature)

### Content by Grade
Detailed breakdown of each content type (courses, lessons, quizzes, tasks) by academic grade.

### Recent Activity
- **newUsersLastWeek:** New user registrations in the last 7 days
- **newContentLastWeek:** New content items created in the last 7 days
- **newUsersLastMonth:** New user registrations in the last 30 days
- **newContentLastMonth:** New content items created in the last 30 days

---

## 🔧 Frontend Integration Examples

### Dashboard Cards Component
```javascript
const DashboardCards = ({ analytics }) => {
  return (
    <div className="dashboard-cards">
      <div className="card-grid">
        {/* User Stats Cards */}
        <div className="card blue">
          <div className="card-header">
            <h3>👥 Total Users</h3>
            <span className="icon">👥</span>
          </div>
          <div className="card-body">
            <h2>{analytics.users.totalUsers}</h2>
            <p>
              <span className="verified">{analytics.users.verifiedUsers} verified</span>
              <span className="unverified">{analytics.users.unverifiedUsers} pending</span>
            </p>
          </div>
        </div>

        <div className="card green">
          <div className="card-header">
            <h3>📚 Lessons</h3>
            <span className="icon">📚</span>
          </div>
          <div className="card-body">
            <h2>{analytics.content.totalLessons}</h2>
            <p>lessons total</p>
          </div>
        </div>

        <div className="card purple">
          <div className="card-header">
            <h3>📝 Assessments</h3>
            <span className="icon">📝</span>
          </div>
          <div className="card-body">
            <h2>{analytics.content.totalQuizzes + analytics.content.totalTasks}</h2>
            <p>
              <span>{analytics.content.totalQuizzes} quizzes</span>
              <span>{analytics.content.totalTasks} tasks</span>
            </p>
          </div>
        </div>

        <div className="card orange">
          <div className="card-header">
            <h3>🆕 This Week</h3>
            <span className="icon">📈</span>
          </div>
          <div className="card-body">
            <h2>{analytics.recentActivity.newUsersLastWeek}</h2>
            <p>new users</p>
            <small>{analytics.recentActivity.newContentLastWeek} new content</small>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Students by Grade Chart
```javascript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentsByGradeChart = ({ studentsByGrade }) => {
  return (
    <div className="chart-container">
      <h3>👨‍🎓 Students Distribution by Grade</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={studentsByGrade}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="grade" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, 'Students']}
            labelFormatter={(label) => `Grade: ${label}`}
          />
          <Bar dataKey="students" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

### Grade Distribution Chart
```javascript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const GradeDistributionChart = ({ gradeDistribution }) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
  
  return (
    <div className="chart-container">
      <h3>📊 Content Distribution by Grade</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            dataKey="count"
            data={gradeDistribution}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({_id, count}) => `${_id}: ${count}`}
          >
            {gradeDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### Real-time Analytics Hook
```javascript
import { useState, useEffect } from 'react';

const useAnalytics = (refreshInterval = 60000) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Auto-refresh analytics data
    const interval = setInterval(fetchAnalytics, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics
  };
};

// Usage
const AdminDashboard = () => {
  const { analytics, loading, error, refresh } = useAnalytics();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <button onClick={refresh}>🔄 Refresh</button>
      </div>
      <DashboardCards analytics={analytics} />
      <StudentsByGradeChart studentsByGrade={analytics.studentsByGrade} />
      <GradeDistributionChart gradeDistribution={analytics.gradeDistribution} />
    </div>
  );
};
```

---

## 🎨 CSS Styling Example

```css
.analytics-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-card, .activity-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover, .activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.stat-card h4 {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card p {
  color: #2c3e50;
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.analytics-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}

.analytics-section h3 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 18px;
}

.grade-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  margin: 8px 0;
  border-left: 4px solid #3498db;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  border-radius: 12px;
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
}

.card.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.card.green { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.card.purple { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.card.orange { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.card-header .icon {
  font-size: 24px;
  opacity: 0.8;
}

.card-body h2 {
  font-size: 36px;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.card-body p {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
}

@media (max-width: 768px) {
  .stats-grid, .card-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-dashboard {
    padding: 16px;
  }
}
```

---

## 🔐 Authorization & Security

### Required Permissions
- **Admin:** Full access to all analytics data
- **Instructor:** Access to system-wide analytics (same as admin currently)
- **Student:** No access to analytics endpoints

### Security Features
- **JWT Token Validation:** All requests must include valid access token
- **Role-based Access Control:** Only admin and instructor roles allowed
- **Data Aggregation:** No sensitive user data exposed in analytics
- **Rate Limiting:** Consider implementing rate limiting for analytics endpoints

---

## 🧪 Testing

### Manual Testing
```bash
# Test with valid admin/instructor token
curl -X GET https://courses-nine-eta.vercel.app/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"

# Test without authorization (should fail)
curl -X GET https://courses-nine-eta.vercel.app/api/analytics/dashboard \
  -H "Content-Type: application/json"
```

### Automated Testing Example
```javascript
describe('Analytics API', () => {
  let adminToken;

  beforeEach(async () => {
    // Login as admin to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@courses.com',
        password: 'admin123'
      });
    
    adminToken = loginResponse.body.data.accessToken;
  });

  it('should return analytics for admin', async () => {
    const response = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('users');
    expect(response.body.data).toHaveProperty('content');
    expect(response.body.data).toHaveProperty('gradeDistribution');
  });

  it('should reject unauthorized requests', async () => {
    await request(app)
      .get('/api/analytics/dashboard')
      .expect(401);
  });
});
```

---

## 📈 Performance Considerations

### Optimization Tips
1. **Caching:** Implement Redis caching for analytics data (refresh every 5-10 minutes)
2. **Database Indexing:** Ensure proper indexes on date fields and user roles
3. **Aggregation Pipelines:** Use MongoDB aggregation for efficient data processing
4. **Pagination:** Consider pagination for large datasets in future versions

### Monitoring
- Monitor response times for analytics endpoints
- Track database query performance
- Set up alerts for slow queries or high memory usage

---

**🎯 Quick Implementation Guide:**
1. Ensure user has admin or instructor role
2. Get access token from login
3. Call GET /api/analytics/dashboard with Authorization header
4. Handle the response data in your dashboard UI
5. Implement auto-refresh for real-time updates

**📊 Use Cases:**
- Admin dashboard overview
- Instructor performance monitoring  
- System health monitoring
- Content distribution analysis
- User engagement metrics