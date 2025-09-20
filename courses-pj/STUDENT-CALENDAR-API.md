# 📅 Student Calendar API Documentation

## Overview
The Student Calendar API provides personalized calendar functionality for students, allowing them to view their scheduled classes, tasks, quizzes, and lessons based on their grade level.

### Base URL
- **Production:** `https://courses-nine-eta.vercel.app/api`
- **Local Development:** `http://localhost:3000/api`

---

## 🎓 Student Calendar Endpoints

### Authentication Required
- **Token Type:** Bearer Token (Access Token)
- **Required Role:** `student`
- **Authorization Header:** `Authorization: Bearer <access_token>`

---

## 📆 Get Student Calendar

### `GET /students/calendar`

**Description:** Retrieves the personalized calendar for a student based on their grade level, including scheduled classes, tasks, quizzes, and lessons.

### Query Parameters
- `month` (optional): Month number (1-12). Default: Current month
- `year` (optional): Year (e.g., 2025). Default: Current year

### Request Format
```http
GET /api/students/calendar?month=9&year=2025
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Frontend Implementation
```javascript
// JavaScript/React Example
const getStudentCalendar = async (month = null, year = null) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    // Build query string
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const queryString = params.toString();
    const url = `/api/students/calendar${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Calendar data:', data.data);
      return data.data;
    } else {
      console.error('Failed to fetch calendar:', data.message);
    }
  } catch (error) {
    console.error('Error fetching calendar:', error);
  }
};

// React Component Example
import React, { useState, useEffect } from 'react';

const StudentCalendar = () => {
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const data = await getStudentCalendar(selectedMonth, selectedYear);
        setCalendar(data);
      } catch (error) {
        console.error('Failed to load calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [selectedMonth, selectedYear]);

  if (loading) return <div>Loading calendar...</div>;
  if (!calendar) return <div>Failed to load calendar</div>;

  return (
    <div className="student-calendar">
      <div className="calendar-header">
        <h2>📅 My Calendar - {calendar.studentInfo.grade}</h2>
        
        {/* Month/Year Selector */}
        <div className="date-selector">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(2025, i).toLocaleDateString('ar-EG', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="calendar-stats">
        <div className="stat-card">
          <h4>📚 Classes</h4>
          <span>{calendar.stats.totalSchedules}</span>
        </div>
        <div className="stat-card">
          <h4>📝 Tasks</h4>
          <span>{calendar.stats.totalTasks}</span>
        </div>
        <div className="stat-card">
          <h4>🧪 Quizzes</h4>
          <span>{calendar.stats.totalQuizzes}</span>
        </div>
        <div className="stat-card">
          <h4>🎥 Lessons</h4>
          <span>{calendar.stats.totalLessons}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {calendar.calendar.map((day, index) => (
          <DayCard key={index} dayData={day} />
        ))}
      </div>

      {/* Active Dates Summary */}
      <div className="active-dates">
        <h3>📋 Days with Activities</h3>
        {calendar.activeDates.map((activeDate, index) => (
          <div key={index} className="active-date">
            <span className="date">{activeDate.date}</span>
            <span className="count">{activeDate.itemsCount} items</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Day Card Component
const DayCard = ({ dayData }) => {
  const totalItems = dayData.totalItems;
  
  return (
    <div className={`day-card ${totalItems > 0 ? 'has-events' : 'empty'}`}>
      <div className="day-header">
        <span className="day-number">
          {new Date(dayData.date).getDate()}
        </span>
        <span className="items-count">{totalItems}</span>
      </div>
      
      <div className="day-content">
        {/* Schedules */}
        {dayData.schedules.map((schedule, index) => (
          <div key={index} className="event schedule">
            <span className="time">{schedule.timeFrom} - {schedule.timeTo}</span>
            <span className="title">{schedule.title}</span>
          </div>
        ))}
        
        {/* Tasks */}
        {dayData.tasks.map((task, index) => (
          <div key={index} className={`event task priority-${task.priority}`}>
            <span className="title">📝 {task.title}</span>
            <span className="subject">{task.subject}</span>
          </div>
        ))}
        
        {/* Quizzes */}
        {dayData.quizzes.map((quiz, index) => (
          <div key={index} className="event quiz">
            <span className="title">🧪 {quiz.title}</span>
            <span className="questions">{quiz.questionsCount} questions</span>
          </div>
        ))}
        
        {/* Lessons */}
        {dayData.lessons.map((lesson, index) => (
          <div key={index} className="event lesson">
            <span className="title">🎥 {lesson.title}</span>
            <span className="unit">{lesson.unitTitle}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCalendar;
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "message": "تم جلب التقويم بنجاح",
  "data": {
    "calendar": [
      {
        "date": "2025-09-20T00:00:00.000Z",
        "schedules": [
          {
            "id": "66ed123456789abcd",
            "type": "schedule",
            "title": "الرياضيات",
            "day": "الأحد",
            "timeFrom": "08:00",
            "timeTo": "09:30",
            "instructor": {
              "_id": "66ed987654321dcba",
              "name": "أ. محمد أحمد",
              "email": "instructor@courses.com"
            },
            "location": "قاعة 101",
            "description": "درس الجبر الخطي",
            "priority": "medium"
          }
        ],
        "tasks": [
          {
            "id": "66ed111222333444",
            "type": "task",
            "title": "حل تمارين الرياضيات",
            "description": "حل التمارين من صفحة 45 إلى 50",
            "subject": "الرياضيات",
            "dueDate": "2025-09-20T23:59:00.000Z",
            "createdBy": {
              "_id": "66ed987654321dcba",
              "name": "أ. محمد أحمد",
              "email": "instructor@courses.com"
            },
            "daysUntilDue": 0,
            "priority": "high",
            "status": "pending"
          }
        ],
        "quizzes": [
          {
            "id": "66ed555666777888",
            "type": "quiz",
            "title": "اختبار الجبر",
            "description": "اختبار شامل على وحدة الجبر الخطي",
            "subject": "الرياضيات",
            "duration": 60,
            "questionsCount": 15,
            "createdBy": {
              "_id": "66ed987654321dcba",
              "name": "أ. محمد أحمد",
              "email": "instructor@courses.com"
            },
            "createdAt": "2025-09-20T10:00:00.000Z",
            "priority": "high"
          }
        ],
        "lessons": [
          {
            "id": "66ed999888777666",
            "type": "lesson",
            "title": "مقدمة في الجبر الخطي",
            "unitTitle": "وحدة الجبر",
            "videoUrl": "https://youtube.com/watch?v=example",
            "createdBy": {
              "_id": "66ed987654321dcba",
              "name": "أ. محمد أحمد",
              "email": "instructor@courses.com"
            },
            "createdAt": "2025-09-20T09:00:00.000Z",
            "priority": "medium"
          }
        ],
        "totalItems": 4
      }
    ],
    "stats": {
      "totalSchedules": 15,
      "totalTasks": 8,
      "totalQuizzes": 3,
      "totalLessons": 12,
      "totalItems": 38,
      "overdueTasks": 1,
      "upcomingTasks": 3
    },
    "activeDates": [
      {
        "date": "2025-09-20",
        "itemsCount": 4,
        "hasSchedules": true,
        "hasTasks": true,
        "hasQuizzes": true,
        "hasLessons": true
      },
      {
        "date": "2025-09-21",
        "itemsCount": 2,
        "hasSchedules": true,
        "hasTasks": false,
        "hasQuizzes": false,
        "hasLessons": true
      }
    ],
    "period": {
      "startDate": "2025-09-01T00:00:00.000Z",
      "endDate": "2025-09-30T23:59:59.999Z",
      "month": 9,
      "year": 2025
    },
    "studentInfo": {
      "grade": "الصف الأول الثانوي",
      "userId": "66ed444333222111"
    }
  }
}
```

---

## 📋 Get Day Events

### `GET /students/calendar/day/:date`

**Description:** Retrieves all events for a specific day for the authenticated student.

### Path Parameters
- `date` (required): Date in YYYY-MM-DD format (e.g., "2025-09-20")

### Request Format
```http
GET /api/students/calendar/day/2025-09-20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Frontend Implementation
```javascript
// Get events for a specific day
const getDayEvents = async (date) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`/api/students/calendar/day/${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to fetch day events:', data.message);
    }
  } catch (error) {
    console.error('Error fetching day events:', error);
  }
};

// React Component for Day View
const DayView = ({ selectedDate }) => {
  const [dayEvents, setDayEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDayEvents = async () => {
      setLoading(true);
      try {
        const data = await getDayEvents(selectedDate);
        setDayEvents(data);
      } catch (error) {
        console.error('Failed to load day events:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchDayEvents();
    }
  }, [selectedDate]);

  if (loading) return <div>Loading day events...</div>;
  if (!dayEvents) return <div>No events for this day</div>;

  return (
    <div className="day-view">
      <h3>📅 Events for {dayEvents.date}</h3>
      
      <div className="events-summary">
        <p>Total Events: {dayEvents.summary.totalEvents}</p>
        <div className="summary-breakdown">
          <span>📚 {dayEvents.summary.schedules} Classes</span>
          <span>📝 {dayEvents.summary.tasks} Tasks</span>
          <span>🧪 {dayEvents.summary.quizzes} Quizzes</span>
          <span>🎥 {dayEvents.summary.lessons} Lessons</span>
        </div>
      </div>

      <div className="events-list">
        {dayEvents.events.map((event, index) => (
          <div key={index} className={`event-item ${event.type}`}>
            <div className="event-header">
              <span className="event-type">{getEventIcon(event.type)}</span>
              <span className="event-title">
                {event.type === 'schedule' ? event.subject : 
                 event.type === 'task' ? event.title :
                 event.type === 'quiz' ? event.title :
                 event.lessonTitle}
              </span>
            </div>
            
            <div className="event-details">
              {event.type === 'schedule' && (
                <>
                  <span>🕐 {event.timeFrom} - {event.timeTo}</span>
                  <span>👨‍🏫 {event.instructor?.name}</span>
                  {event.location && <span>📍 {event.location}</span>}
                </>
              )}
              
              {event.type === 'task' && (
                <>
                  <span>📖 {event.subject}</span>
                  <span>📅 Due: {new Date(event.dueDate).toLocaleString('ar-EG')}</span>
                  <span className={`priority-${event.priority}`}>
                    Priority: {event.priority}
                  </span>
                </>
              )}
              
              {event.type === 'quiz' && (
                <>
                  <span>📖 {event.subject}</span>
                  <span>❓ {event.questions?.length || 0} questions</span>
                  <span>⏱️ {event.duration} minutes</span>
                </>
              )}
              
              {event.type === 'lesson' && (
                <>
                  <span>📚 {event.unitTitle}</span>
                  <span>🎥 Video Lesson</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getEventIcon = (type) => {
  switch(type) {
    case 'schedule': return '📚';
    case 'task': return '📝';
    case 'quiz': return '🧪';
    case 'lesson': return '🎥';
    default: return '📅';
  }
};
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "message": "تم جلب أحداث اليوم بنجاح",
  "data": {
    "date": "2025-09-20",
    "events": [
      {
        "_id": "66ed123456789abcd",
        "subject": "الرياضيات",
        "date": "2025-09-20T00:00:00.000Z",
        "timeFrom": "08:00",
        "timeTo": "09:30",
        "day": "الأحد",
        "grade": "الصف الأول الثانوي",
        "instructor": {
          "_id": "66ed987654321dcba",
          "name": "أ. محمد أحمد",
          "email": "instructor@courses.com"
        },
        "location": "قاعة 101",
        "type": "schedule"
      }
    ],
    "summary": {
      "totalEvents": 4,
      "schedules": 1,
      "tasks": 1,
      "quizzes": 1,
      "lessons": 1
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

**403 - Forbidden (Not Student)**
```json
{
  "success": false,
  "message": "غير مصرح لك بالوصول لهذه البيانات"
}
```

**400 - Invalid Date Format**
```json
{
  "success": false,
  "message": "تنسيق التاريخ غير صحيح. استخدم YYYY-MM-DD"
}
```

---

## 🎨 CSS Styling Example

```css
.student-calendar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.date-selector {
  display: flex;
  gap: 10px;
}

.date-selector select {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: white;
  color: #333;
}

.calendar-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  border-left: 4px solid #3498db;
}

.stat-card h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.stat-card span {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 30px;
}

.day-card {
  background: white;
  border-radius: 8px;
  padding: 10px;
  min-height: 120px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.day-card.has-events {
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
}

.day-card.empty {
  opacity: 0.6;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.day-number {
  font-weight: bold;
  color: #2c3e50;
}

.items-count {
  background: #3498db;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.event {
  margin: 4px 0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.2;
}

.event.schedule {
  background: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.event.task {
  background: #fff3e0;
  border-left: 3px solid #ff9800;
}

.event.task.priority-high {
  background: #ffebee;
  border-left-color: #f44336;
}

.event.quiz {
  background: #f3e5f5;
  border-left: 3px solid #9c27b0;
}

.event.lesson {
  background: #e8f5e8;
  border-left: 3px solid #4caf50;
}

.event .time {
  display: block;
  font-weight: bold;
  color: #555;
}

.event .title {
  display: block;
  margin-top: 2px;
  color: #333;
}

.active-dates {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.active-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.active-date:last-child {
  border-bottom: none;
}

.day-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.events-summary {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-breakdown {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.summary-breakdown span {
  font-size: 12px;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.events-list {
  space-y: 10px;
}

.event-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 10px;
}

.event-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.event-title {
  font-weight: bold;
  color: #2c3e50;
}

.event-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #666;
}

.priority-high {
  color: #e74c3c !important;
  font-weight: bold;
}

.priority-medium {
  color: #f39c12 !important;
}

.priority-low {
  color: #27ae60 !important;
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .calendar-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .summary-breakdown {
    flex-direction: column;
    gap: 5px;
  }
}
```

---

## 🔧 Features Summary

### Calendar Features
- **Grade-based Filtering:** Automatically shows content for student's grade level
- **Multi-type Events:** Schedules, tasks, quizzes, and lessons in one view
- **Priority System:** Visual priority indicators for urgent tasks
- **Date Navigation:** Monthly view with easy date selection
- **Statistics:** Overview of total activities and upcoming deadlines
- **Responsive Design:** Works on all device sizes

### Data Types Included
1. **Schedules (📚):** Class timetables with instructors and locations
2. **Tasks (📝):** Assignments with due dates and priority levels
3. **Quizzes (🧪):** Tests and assessments with question counts
4. **Lessons (🎥):** Video lessons and course materials

### Priority System
- **High Priority:** Due within 1 day or urgent items
- **Medium Priority:** Due within 3 days or regular items  
- **Low Priority:** Future items with plenty of time

---

## 📱 Integration Guide

### Quick Setup Steps
1. **Authentication:** Ensure student is logged in with valid token
2. **Calendar Component:** Use the provided React component
3. **Styling:** Apply the CSS for proper visual presentation
4. **Navigation:** Implement month/year selection functionality
5. **Day View:** Add detailed day view for specific dates

### API Usage Pattern
```javascript
// 1. Load monthly calendar
const calendar = await getStudentCalendar(9, 2025);

// 2. Display in calendar grid
<CalendarGrid calendar={calendar.calendar} />

// 3. Show day details on click
const dayEvents = await getDayEvents('2025-09-20');

// 4. Update view with events
<DayView events={dayEvents.events} />
```

**🎯 Perfect for:**
- Student dashboard calendars
- Mobile study apps
- Academic planning tools
- Parent monitoring systems
- Learning management systems

**📞 Support:** For integration help, refer to the main API documentation or contact the development team.