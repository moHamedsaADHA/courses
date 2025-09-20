# 📚 Quiz System for Students - API Documentation

## Overview
This comprehensive guide explains how students can interact with the quiz system, take quizzes, and view their results. The system includes automatic grading, detailed feedback, and performance tracking.

### Base URL
- **Production:** `https://courses-nine-eta.vercel.app/api`
- **Local Development:** `http://localhost:3000/api`

---

## 🎯 Quiz System Workflow

### Student Quiz Journey:
1. **Browse Available Quizzes** - View quizzes for their grade
2. **Start a Quiz** - Get questions (without correct answers)
3. **Submit Answers** - Get immediate results and grading
4. **View Results** - See detailed performance analysis
5. **Track Progress** - Monitor improvement over time

---

## 📋 Available Quiz Endpoints

### 1. `GET /quizzes/grade/{grade-url}`

**Description:** Get all quizzes available for student's grade.

#### Grade URL Mapping:
- `first-secondary` → الصف الأول الثانوي
- `second-secondary-science` → الصف الثاني الثانوي علمي
- `second-secondary-literature` → الصف الثاني الثانوي ادبي
- `third-secondary-science` → الصف الثالث الثانوي علمي
- `third-secondary-literature` → الصف الثالث الثانوي ادبي

#### Request:
```javascript
const getAvailableQuizzes = async () => {
  const response = await fetch('/api/quizzes/grade/first-secondary', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};
```

#### Response:
```json
{
  "success": true,
  "message": "تم جلب الكويزات بنجاح",
  "data": {
    "quizzes": [
      {
        "_id": "quiz_id_here",
        "title": "كويز الرياضيات - الفصل الأول",
        "description": "كويز شامل على دروس الفصل الأول",
        "subject": "رياضيات",
        "grade": "الصف الأول الثانوي",
        "totalQuestions": 10,
        "totalPoints": 100,
        "timeLimit": 30,
        "createdBy": {
          "name": "أ. محمد أحمد",
          "email": "teacher@example.com"
        },
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ],
    "total": 5,
    "grade": "الصف الأول الثانوي"
  }
}
```

---

### 2. `GET /quizzes/:quizId/start`

**Description:** Start a quiz and get questions (without correct answers).

#### Request:
```javascript
const startQuiz = async (quizId) => {
  const response = await fetch(`/api/quizzes/${quizId}/start`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};
```

#### Response:
```json
{
  "success": true,
  "message": "تم جلب الكويز بنجاح",
  "data": {
    "quiz": {
      "_id": "quiz_id_here",
      "title": "كويز الرياضيات - الفصل الأول",
      "description": "كويز شامل على دروس الفصل الأول",
      "grade": "الصف الأول الثانوي",
      "subject": "رياضيات",
      "totalQuestions": 3,
      "totalPoints": 30,
      "timeLimit": 30,
      "createdBy": {
        "name": "أ. محمد أحمد",
        "email": "teacher@example.com"
      },
      "createdAt": "2025-01-15T10:00:00Z"
    },
    "questions": [
      {
        "questionIndex": 0,
        "questionText": "ما هو ناتج 5 + 3؟",
        "type": "اختر من متعدد",
        "points": 10,
        "explanation": "جمع عددين صحيحين",
        "options": [
          {
            "_id": "option1_id",
            "text": "7"
          },
          {
            "_id": "option2_id",
            "text": "8"
          },
          {
            "_id": "option3_id",
            "text": "9"
          }
        ]
      },
      {
        "questionIndex": 1,
        "questionText": "الرقم 10 عدد زوجي",
        "type": "صح وخطأ",
        "points": 10,
        "explanation": "تحديد نوع الرقم"
      }
    ],
    "instructions": {
      "timeLimit": 30,
      "totalQuestions": 3,
      "totalPoints": 30,
      "rules": [
        "اقرأ كل سؤال بعناية",
        "لديك 30 دقيقة لإنهاء الكويز",
        "يمكنك حل الكويز مرة واحدة فقط",
        "تأكد من اختيار الإجابة الصحيحة قبل المتابعة",
        "سيتم حفظ إجاباتك تلقائياً عند الإرسال"
      ]
    },
    "startedAt": "2025-01-20T14:30:00Z"
  }
}
```

---

### 3. `POST /quizzes/:quizId/submit`

**Description:** Submit quiz answers and get results with grading.

#### Request:
```javascript
const submitQuiz = async (quizId, answers, startedAt) => {
  const response = await fetch(`/api/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answers: answers, // Array of answers
      startedAt: startedAt, // ISO date string
      timeSpent: 1800 // Optional: time in seconds
    })
  });
  return await response.json();
};

// Example answers format:
const answers = [
  "option2_id", // For multiple choice: option ID
  true,         // For true/false: boolean
  "option1_id"  // Another multiple choice
];
```

#### Response:
```json
{
  "success": true,
  "message": "تم إرسال الإجابات وحساب النتيجة بنجاح",
  "data": {
    "result": {
      "id": "result_id_here",
      "quiz": {
        "title": "كويز الرياضيات - الفصل الأول",
        "subject": "رياضيات",
        "grade": "الصف الأول الثانوي"
      },
      "student": {
        "name": "أحمد محمد",
        "grade": "الصف الأول الثانوي"
      },
      "score": {
        "totalPoints": 30,
        "earnedPoints": 20,
        "correctAnswers": 2,
        "totalQuestions": 3,
        "percentage": 67
      },
      "grade": {
        "letter": "C+",
        "description": "جيد مرتفع"
      },
      "timeSpent": {
        "seconds": 1800,
        "minutes": 30,
        "display": "30:00"
      },
      "completedAt": "2025-01-20T15:00:00Z",
      "motivationalMessage": "👍 جيد! يمكنك التحسن أكثر!"
    },
    "answers": [
      {
        "questionIndex": 1,
        "questionText": "ما هو ناتج 5 + 3؟",
        "type": "اختر من متعدد",
        "userAnswer": "8",
        "correctAnswer": "8",
        "isCorrect": true,
        "pointsEarned": 10,
        "maxPoints": 10,
        "explanation": "جمع عددين صحيحين"
      },
      {
        "questionIndex": 2,
        "questionText": "الرقم 10 عدد زوجي",
        "type": "صح وخطأ",
        "userAnswer": "صح",
        "correctAnswer": "صح",
        "isCorrect": true,
        "pointsEarned": 10,
        "maxPoints": 10,
        "explanation": "تحديد نوع الرقم"
      },
      {
        "questionIndex": 3,
        "questionText": "ما هو ناتج 7 × 6؟",
        "type": "اختر من متعدد",
        "userAnswer": "41",
        "correctAnswer": "42",
        "isCorrect": false,
        "pointsEarned": 0,
        "maxPoints": 10,
        "explanation": "ضرب عددين صحيحين"
      }
    ],
    "statistics": {
      "totalQuestions": 3,
      "correctAnswers": 2,
      "incorrectAnswers": 1,
      "accuracyRate": 67,
      "pointsEarned": 20,
      "maxPoints": 30
    }
  }
}
```

---

### 4. `GET /quizzes/results/my-results`

**Description:** Get all quiz results for the logged-in student.

#### Request:
```javascript
const getMyResults = async () => {
  const response = await fetch('/api/quizzes/results/my-results', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};
```

#### Response:
```json
{
  "success": true,
  "message": "تم جلب النتائج بنجاح",
  "data": {
    "student": {
      "name": "أحمد محمد",
      "grade": "الصف الأول الثانوي"
    },
    "results": [
      {
        "id": "result_id_1",
        "quiz": {
          "title": "كويز الرياضيات - الفصل الأول",
          "subject": "رياضيات",
          "grade": "الصف الأول الثانوي",
          "totalQuestions": 3,
          "totalPoints": 30,
          "createdBy": "أ. محمد أحمد"
        },
        "score": {
          "percentage": 67,
          "earnedPoints": 20,
          "totalPoints": 30,
          "correctAnswers": 2,
          "totalQuestions": 3
        },
        "grade": {
          "letter": "C+",
          "description": "جيد مرتفع"
        },
        "timeSpent": {
          "seconds": 1800,
          "display": "30:00"
        },
        "completedAt": "2025-01-20T15:00:00Z",
        "performance": "جيد"
      }
    ],
    "statistics": {
      "totalQuizzes": 5,
      "averageScore": 78,
      "bestScore": 95,
      "worstScore": 45,
      "totalTimeSpent": {
        "seconds": 9000,
        "minutes": 150,
        "hours": 2,
        "display": "2:30:00"
      },
      "gradeDistribution": {
        "A+": 1,
        "B": 2,
        "C+": 1,
        "D": 1
      },
      "performanceTrend": [
        {
          "date": "2025-01-20T15:00:00Z",
          "score": 67
        },
        {
          "date": "2025-01-18T14:30:00Z",
          "score": 85
        }
      ]
    }
  }
}
```

---

### 5. `GET /quizzes/results/:resultId/details`

**Description:** Get detailed breakdown of a specific quiz result.

#### Request:
```javascript
const getResultDetails = async (resultId) => {
  const response = await fetch(`/api/quizzes/results/${resultId}/details`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};
```

#### Response:
```json
{
  "success": true,
  "message": "تم جلب تفاصيل النتيجة بنجاح",
  "data": {
    "result": {
      "id": "result_id_here",
      "student": {
        "name": "أحمد محمد",
        "email": "student@example.com",
        "grade": "الصف الأول الثانوي"
      },
      "quiz": {
        "title": "كويز الرياضيات - الفصل الأول",
        "description": "كويز شامل على دروس الفصل الأول",
        "subject": "رياضيات",
        "grade": "الصف الأول الثانوي",
        "totalQuestions": 3,
        "totalPoints": 30,
        "timeLimit": 30,
        "createdBy": {
          "name": "أ. محمد أحمد",
          "email": "teacher@example.com"
        },
        "createdAt": "2025-01-15T10:00:00Z"
      },
      "score": {
        "totalPoints": 30,
        "earnedPoints": 20,
        "correctAnswers": 2,
        "totalQuestions": 3,
        "percentage": 67
      },
      "grade": {
        "letter": "C+",
        "description": "جيد مرتفع"
      },
      "timeSpent": {
        "seconds": 1800,
        "minutes": 30,
        "display": "30:00"
      },
      "completedAt": "2025-01-20T15:00:00Z",
      "startedAt": "2025-01-20T14:30:00Z"
    },
    "answers": [
      {
        "questionNumber": 1,
        "questionText": "ما هو ناتج 5 + 3؟",
        "type": "اختر من متعدد",
        "maxPoints": 10,
        "pointsEarned": 10,
        "userAnswer": "8",
        "correctAnswer": "8",
        "isCorrect": true,
        "explanation": "جمع عددين صحيحين",
        "options": [
          {
            "_id": "option1_id",
            "text": "7",
            "isCorrect": false,
            "isSelected": false
          },
          {
            "_id": "option2_id",
            "text": "8",
            "isCorrect": true,
            "isSelected": true
          },
          {
            "_id": "option3_id",
            "text": "9",
            "isCorrect": false,
            "isSelected": false
          }
        ]
      }
    ],
    "statistics": {
      "totalQuestions": 3,
      "correctAnswers": 2,
      "incorrectAnswers": 1,
      "accuracyRate": 67,
      "pointsEarned": 20,
      "maxPoints": 30,
      "timeEfficiency": "جيد",
      "breakdown": {
        "byType": {
          "اختر من متعدد": {
            "total": 2,
            "correct": 1
          },
          "صح وخطأ": {
            "total": 1,
            "correct": 1
          }
        }
      }
    }
  }
}
```

---

## 🎨 Frontend Implementation Examples

### Complete Quiz Component (React)

```jsx
import React, { useState, useEffect } from 'react';

const QuizComponent = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load quiz when component mounts
  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      submitQuiz(); // Auto-submit when time runs out
    }
  }, [timeLeft]);

  const loadQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/start`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setQuiz(data.data);
        setAnswers(new Array(data.data.questions.length).fill(null));
        setTimeLeft(data.data.quiz.timeLimit * 60); // Convert to seconds
        setStartedAt(data.data.startedAt);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('حدث خطأ في تحميل الكويز');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers,
          startedAt,
          timeSpent: (quiz.quiz.timeLimit * 60) - timeLeft
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onComplete(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('حدث خطأ في إرسال الإجابات');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="quiz-loading">جاري تحميل الكويز...</div>;
  if (!quiz) return <div className="quiz-error">خطأ في تحميل الكويز</div>;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <h2>{quiz.quiz.title}</h2>
        <div className="quiz-info">
          <span className="subject">{quiz.quiz.subject}</span>
          <span className="time-left">
            ⏰ {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
        <span className="progress-text">
          {currentQuestion + 1} من {quiz.questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="question-container">
        <h3 className="question-text">
          {question.questionText}
        </h3>
        
        <div className="question-meta">
          <span className="question-type">{question.type}</span>
          <span className="question-points">{question.points} نقطة</span>
        </div>

        {/* Answer Options */}
        <div className="answer-options">
          {question.type === 'اختر من متعدد' && (
            <div className="multiple-choice">
              {question.options.map((option) => (
                <label key={option._id} className="option-label">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option._id}
                    checked={answers[currentQuestion] === option._id}
                    onChange={() => handleAnswer(option._id)}
                  />
                  <span className="option-text">{option.text}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'صح وخطأ' && (
            <div className="true-false">
              <label className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={true}
                  checked={answers[currentQuestion] === true}
                  onChange={() => handleAnswer(true)}
                />
                <span className="option-text">صح ✓</span>
              </label>
              <label className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={false}
                  checked={answers[currentQuestion] === false}
                  onChange={() => handleAnswer(false)}
                />
                <span className="option-text">خطأ ✗</span>
              </label>
            </div>
          )}
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="question-explanation">
            💡 {question.explanation}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button 
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="nav-button prev"
        >
          ← السابق
        </button>

        <div className="question-indicator">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`question-dot ${
                index === currentQuestion ? 'active' : ''
              } ${
                answers[index] !== null ? 'answered' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button 
            onClick={submitQuiz}
            className="nav-button submit"
            disabled={answers.includes(null)}
          >
            إرسال الإجابات 📤
          </button>
        ) : (
          <button 
            onClick={nextQuestion}
            className="nav-button next"
          >
            التالي →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
```

### Quiz Results Component

```jsx
const QuizResults = ({ resultData }) => {
  const { result, answers, statistics } = resultData;

  const getGradeColor = (letter) => {
    const colors = {
      'A+': '#4CAF50', 'A': '#4CAF50',
      'B+': '#8BC34A', 'B': '#8BC34A',
      'C+': '#FFC107', 'C': '#FFC107',
      'D+': '#FF9800', 'D': '#FF9800',
      'F': '#F44336'
    };
    return colors[letter] || '#9E9E9E';
  };

  return (
    <div className="quiz-results">
      {/* Results Header */}
      <div className="results-header">
        <h2>📊 نتائج الكويز</h2>
        <div className="motivational-message">
          {result.motivationalMessage}
        </div>
      </div>

      {/* Score Summary */}
      <div className="score-summary">
        <div className="score-circle">
          <div className="percentage">{result.score.percentage}%</div>
          <div 
            className="grade-badge"
            style={{ backgroundColor: getGradeColor(result.grade.letter) }}
          >
            {result.grade.letter}
          </div>
          <div className="grade-description">
            {result.grade.description}
          </div>
        </div>

        <div className="score-details">
          <div className="detail-item">
            <span className="label">النقاط المحققة:</span>
            <span className="value">
              {result.score.earnedPoints} / {result.score.totalPoints}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">الإجابات الصحيحة:</span>
            <span className="value">
              {result.score.correctAnswers} / {result.score.totalQuestions}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">الوقت المستغرق:</span>
            <span className="value">{result.timeSpent.display}</span>
          </div>
        </div>
      </div>

      {/* Question by Question Analysis */}
      <div className="answers-analysis">
        <h3>📝 تحليل الإجابات</h3>
        {answers.map((answer, index) => (
          <div 
            key={index} 
            className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
          >
            <div className="question-header">
              <span className="question-number">السؤال {answer.questionIndex}</span>
              <span className="question-type">{answer.type}</span>
              <span className="points">
                {answer.pointsEarned}/{answer.maxPoints} نقطة
              </span>
            </div>
            
            <div className="question-text">{answer.questionText}</div>
            
            <div className="answer-comparison">
              <div className="user-answer">
                <strong>إجابتك:</strong> {answer.userAnswer}
                {answer.isCorrect ? ' ✅' : ' ❌'}
              </div>
              {!answer.isCorrect && (
                <div className="correct-answer">
                  <strong>الإجابة الصحيحة:</strong> {answer.correctAnswer}
                </div>
              )}
            </div>
            
            {answer.explanation && (
              <div className="explanation">
                💡 <strong>الشرح:</strong> {answer.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Statistics */}
      <div className="overall-statistics">
        <h3>📈 إحصائيات عامة</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{statistics.correctAnswers}</div>
            <div className="stat-label">إجابات صحيحة</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.incorrectAnswers}</div>
            <div className="stat-label">إجابات خاطئة</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.accuracyRate}%</div>
            <div className="stat-label">معدل الدقة</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.pointsEarned}</div>
            <div className="stat-label">النقاط المحققة</div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Student Dashboard Component

```jsx
const StudentDashboard = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentResults();
  }, []);

  const loadStudentResults = async () => {
    try {
      const response = await fetch('/api/quizzes/results/my-results', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h2>لوحة تحكم الطالب</h2>
        <p>مرحباً {results?.student.name}</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <div className="card-value">{results?.statistics.totalQuizzes}</div>
            <div className="card-label">إجمالي الكويزات</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-value">{results?.statistics.averageScore}%</div>
            <div className="card-label">المعدل العام</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <div className="card-value">{results?.statistics.bestScore}%</div>
            <div className="card-label">أفضل نتيجة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-icon">⏱️</div>
          <div className="card-content">
            <div className="card-value">{results?.statistics.totalTimeSpent.display}</div>
            <div className="card-label">إجمالي الوقت</div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="recent-results">
        <h3>آخر النتائج</h3>
        {results?.results.map(result => (
          <div key={result.id} className="result-card">
            <div className="result-header">
              <h4>{result.quiz.title}</h4>
              <span className="subject">{result.quiz.subject}</span>
            </div>
            
            <div className="result-score">
              <span className="percentage">{result.score.percentage}%</span>
              <span 
                className="grade-badge"
                style={{ backgroundColor: getGradeColor(result.grade.letter) }}
              >
                {result.grade.letter}
              </span>
            </div>
            
            <div className="result-details">
              <span>✅ {result.score.correctAnswers}/{result.score.totalQuestions}</span>
              <span>⏱️ {result.timeSpent.display}</span>
              <span>📅 {new Date(result.completedAt).toLocaleDateString('ar')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎨 CSS Styling Examples

```css
/* Quiz Container */
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quiz-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.quiz-header h2 {
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.quiz-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.time-left {
  background: #e74c3c;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

/* Progress Bar */
.progress-bar {
  position: relative;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  margin-bottom: 30px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: -25px;
  right: 0;
  font-size: 12px;
  color: #7f8c8d;
}

/* Question Container */
.question-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.question-text {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.6;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  font-size: 14px;
}

.question-type {
  background: #3498db;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
}

.question-points {
  background: #f39c12;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
}

/* Answer Options */
.answer-options {
  margin: 25px 0;
}

.option-label {
  display: block;
  padding: 15px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-label:hover {
  background: #e3f2fd;
  border-color: #3498db;
}

.option-label input[type="radio"] {
  margin-left: 12px;
}

.option-label input[type="radio"]:checked + .option-text {
  font-weight: bold;
  color: #3498db;
}

.question-explanation {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 15px;
  margin-top: 20px;
  border-radius: 4px;
  font-style: italic;
}

/* Navigation */
.quiz-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.nav-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button.prev {
  background: #95a5a6;
  color: white;
}

.nav-button.next {
  background: #3498db;
  color: white;
}

.nav-button.submit {
  background: #27ae60;
  color: white;
  font-size: 16px;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.question-indicator {
  display: flex;
  gap: 8px;
}

.question-dot {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #bdc3c7;
  background: white;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-dot.active {
  border-color: #3498db;
  background: #3498db;
  color: white;
}

.question-dot.answered {
  border-color: #27ae60;
  background: #27ae60;
  color: white;
}

/* Results Styling */
.quiz-results {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.motivational-message {
  font-size: 24px;
  margin: 15px 0;
  padding: 20px;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.score-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.score-circle {
  text-align: center;
  min-width: 200px;
}

.percentage {
  font-size: 48px;
  font-weight: bold;
  color: #2c3e50;
  display: block;
}

.grade-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  margin: 10px 0;
}

.grade-description {
  font-size: 14px;
  color: #7f8c8d;
}

.score-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ecf0f1;
}

.detail-item .label {
  color: #7f8c8d;
}

.detail-item .value {
  font-weight: bold;
  color: #2c3e50;
}

/* Answer Analysis */
.answers-analysis {
  margin: 30px 0;
}

.answer-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #ecf0f1;
}

.answer-item.correct {
  border-left-color: #27ae60;
  background: #f8fff8;
}

.answer-item.incorrect {
  border-left-color: #e74c3c;
  background: #fff8f8;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  font-weight: bold;
  color: #3498db;
}

.answer-comparison {
  margin: 15px 0;
}

.user-answer, .correct-answer {
  padding: 8px 0;
}

.explanation {
  background: #f0f8ff;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
  font-style: italic;
}

/* Statistics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-item {
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #3498db;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quiz-container {
    padding: 15px;
  }
  
  .quiz-navigation {
    flex-direction: column;
    gap: 15px;
  }
  
  .question-indicator {
    order: -1;
  }
  
  .score-summary {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 🔐 Grading System

### Grade Scale:
- **A+ (95-100%):** ممتاز مرتفع
- **A (90-94%):** ممتاز  
- **B+ (85-89%):** جيد جداً مرتفع
- **B (80-84%):** جيد جداً
- **C+ (75-79%):** جيد مرتفع
- **C (70-74%):** جيد
- **D+ (65-69%):** مقبول مرتفع
- **D (60-64%):** مقبول
- **F (0-59%):** راسب

### Motivational Messages:
- **90%+:** "🎉 ممتاز! أداء رائع جداً!"
- **80-89%:** "👏 أحسنت! أداء جيد جداً!"
- **70-79%:** "👍 جيد! يمكنك التحسن أكثر!"
- **60-69%:** "💪 أداء مقبول، واصل المذاكرة!"
- **<60%:** "📚 تحتاج للمزيد من المذاكرة، لا تستسلم!"

---

## ⚠️ Important Security & Validation Rules

### Quiz Access Rules:
1. **Student Role Only:** Only students can take quizzes
2. **Grade Matching:** Students can only access quizzes for their grade
3. **One Attempt:** Each student can take a quiz only once
4. **Time Limits:** Quizzes are auto-submitted when time expires
5. **Active Quizzes Only:** Inactive quizzes cannot be accessed

### Data Validation:
- All answers must be provided before submission
- Time spent is tracked and validated
- IP address and user agent are logged for security
- Answer format is validated (boolean for true/false, ObjectId for multiple choice)

### Error Handling:
- Invalid quiz IDs return 400 error
- Unauthorized access returns 403 error
- Already completed quizzes return 400 with previous result
- Time exceeded returns 400 error
- Missing data returns 400 with specific error message

---

## 🧪 Testing Examples

### Test Quiz Taking Flow:

```javascript
// Test complete quiz workflow
describe('Quiz Taking Flow', () => {
  let studentToken, quizId, startData;

  beforeEach(async () => {
    // Login as student
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@example.com',
        password: 'student123'
      });
    
    studentToken = loginResponse.body.data.accessToken;
  });

  it('should start a quiz successfully', async () => {
    const response = await request(app)
      .get(`/api/quizzes/${quizId}/start`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.questions).toBeDefined();
    startData = response.body.data;
  });

  it('should submit quiz and get results', async () => {
    const answers = [true, 'option2_id', false]; // Example answers

    const response = await request(app)
      .post(`/api/quizzes/${quizId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers,
        startedAt: startData.startedAt,
        timeSpent: 1200
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.result.score).toBeDefined();
    expect(response.body.data.result.grade).toBeDefined();
  });

  it('should prevent retaking the same quiz', async () => {
    await request(app)
      .get(`/api/quizzes/${quizId}/start`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(400);
  });
});
```

---

**🎯 Quick Implementation Steps:**

1. **Start Quiz:** Call `/quizzes/:id/start` to get questions
2. **Track Time:** Implement countdown timer and auto-submit
3. **Collect Answers:** Store user selections in array format
4. **Submit Quiz:** Send answers with timing data
5. **Show Results:** Display detailed feedback and grading
6. **Track Progress:** Store results and show improvement trends

**📱 Mobile Considerations:**
- Responsive design for all screen sizes
- Touch-friendly option selection
- Offline answer storage (submit when online)
- Battery-efficient timer implementation
- Network error handling and retry logic

الآن نظام الكويزات للطلاب جاهز بالكامل مع التوثيق الشامل! 🎉📚