# 🎯 Frontend Integration Guide للكويزات

## 📝 كيفية إرسال بيانات الكويز من الـ Frontend

### 1. 🚀 بدء الكويز (Start Quiz)

```javascript
// GET /api/quizzes/{quizId}/start
const startQuiz = async (quizId) => {
  try {
    const response = await fetch(`/api/quizzes/${quizId}/start`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        quiz: data.data.quiz,
        startTime: new Date().toISOString() // احفظ وقت البدء
      };
    }
  } catch (error) {
    console.error('Error starting quiz:', error);
  }
};
```

### 2. 📊 إرسال إجابات الكويز (Submit Quiz)

#### التنسيق المطلوب للإرسال:

```javascript
// POST /api/quizzes/{quizId}/submit
const submitQuiz = async (quizId, answers, startTime) => {
  try {
    const requestBody = {
      answers: {
        answers: answers,  // مصفوفة الإجابات
        startTime: startTime  // وقت البدء
      }
    };

    const response = await fetch(`/api/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
```

### 3. 📋 تنسيق مصفوفة الإجابات

```javascript
// مثال لإجابات كويز يحتوي على سؤالين
const answers = [
  {
    questionIndex: 0,
    answer: "صح"  // للأسئلة من نوع صح وخطأ
  },
  {
    questionIndex: 1, 
    answer: "507f1f77bcf86cd799439012"  // للأسئلة من نوع اختر من متعدد (ID الخيار)
  }
];

const startTime = "2025-09-20T22:35:55.557Z";

// إرسال البيانات
const result = await submitQuiz(quizId, answers, startTime);
```

### 4. 🎮 مثال كامل لتطبيق React

```jsx
import React, { useState, useEffect } from 'react';

const QuizComponent = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // بدء الكويز
  useEffect(() => {
    const initQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${quizId}/start`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setQuiz(data.data.quiz);
          setStartTime(new Date().toISOString());
          // تهيئة مصفوفة الإجابات
          setAnswers(new Array(data.data.quiz.questions.length).fill(null));
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      }
    };

    initQuiz();
  }, [quizId]);

  // تحديث إجابة سؤال
  const updateAnswer = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      questionIndex,
      answer
    };
    setAnswers(newAnswers);
  };

  // إرسال الكويز
  const handleSubmit = async () => {
    if (!answers.every(answer => answer !== null)) {
      alert('يجب الإجابة على جميع الأسئلة');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: {
            answers: answers,
            startTime: startTime
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        alert(data.message || 'حدث خطأ أثناء إرسال الإجابات');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('حدث خطأ في الشبكة');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <div>Loading...</div>;
  if (result) return <QuizResult result={result} />;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <p>السؤال {currentQuestion + 1} من {quiz.questions.length}</p>
      </div>

      <div className="question">
        <h3>{question.questionText}</h3>
        
        {question.type === 'صح وخطأ' && (
          <div className="true-false-options">
            <label>
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value="صح"
                onChange={(e) => updateAnswer(currentQuestion, e.target.value)}
              />
              صح
            </label>
            <label>
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value="خطأ"
                onChange={(e) => updateAnswer(currentQuestion, e.target.value)}
              />
              خطأ
            </label>
          </div>
        )}

        {question.type === 'اختر من متعدد' && (
          <div className="multiple-choice-options">
            {question.options.map((option) => (
              <label key={option._id}>
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option._id}
                  onChange={(e) => updateAnswer(currentQuestion, e.target.value)}
                />
                {option.text}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="navigation">
        <button 
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          السؤال السابق
        </button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <button 
            onClick={() => setCurrentQuestion(prev => prev + 1)}
          >
            السؤال التالي
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'إرسال...' : 'إرسال الكويز'}
          </button>
        )}
      </div>
    </div>
  );
};

// مكون عرض النتيجة
const QuizResult = ({ result }) => {
  return (
    <div className="quiz-result">
      <div className="result-header">
        <h2>🎉 تم إكمال الكويز!</h2>
        <p className="motivational">{result.result.motivationalMessage}</p>
      </div>

      <div className="score-summary">
        <div className="score-card">
          <h3>النتيجة النهائية</h3>
          <div className="score-display">
            <span className="percentage">{result.result.score.percentage}%</span>
            <span className="grade">{result.result.grade}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat">
            <span className="label">الإجابات الصحيحة</span>
            <span className="value">{result.statistics.correctAnswers}</span>
          </div>
          <div className="stat">
            <span className="label">إجمالي الأسئلة</span>
            <span className="value">{result.statistics.totalQuestions}</span>
          </div>
          <div className="stat">
            <span className="label">النقاط المكتسبة</span>
            <span className="value">{result.statistics.pointsEarned}</span>
          </div>
          <div className="stat">
            <span className="label">الوقت المستغرق</span>
            <span className="value">{result.result.timeSpent.display}</span>
          </div>
        </div>
      </div>

      <div className="detailed-answers">
        <h3>تفاصيل الإجابات</h3>
        {result.answers.map((answer, index) => (
          <div key={index} className={`answer-review ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="question-text">
              <strong>س{answer.questionIndex}: </strong>
              {answer.questionText}
            </div>
            <div className="answer-comparison">
              <div className="user-answer">
                <span className="label">إجابتك:</span>
                <span className={answer.isCorrect ? 'correct' : 'incorrect'}>
                  {answer.userAnswer}
                </span>
              </div>
              {!answer.isCorrect && (
                <div className="correct-answer">
                  <span className="label">الإجابة الصحيحة:</span>
                  <span className="correct">{answer.correctAnswer}</span>
                </div>
              )}
            </div>
            {answer.explanation && (
              <div className="explanation">
                <strong>التوضيح:</strong> {answer.explanation}
              </div>
            )}
            <div className="points">
              {answer.pointsEarned} / {answer.maxPoints} نقاط
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizComponent;
```

### 5. 📱 مثال مبسط لـ Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>Quiz App</title>
</head>
<body>
    <div id="quiz-container"></div>

    <script>
        class QuizApp {
            constructor(quizId) {
                this.quizId = quizId;
                this.quiz = null;
                this.answers = [];
                this.startTime = null;
                this.currentQuestion = 0;
            }

            async startQuiz() {
                try {
                    const response = await fetch(`/api/quizzes/${this.quizId}/start`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                        this.quiz = data.data.quiz;
                        this.startTime = new Date().toISOString();
                        this.answers = new Array(this.quiz.questions.length).fill(null);
                        this.renderQuestion();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            updateAnswer(questionIndex, answer) {
                this.answers[questionIndex] = {
                    questionIndex: questionIndex,
                    answer: answer
                };
            }

            async submitQuiz() {
                try {
                    const response = await fetch(`/api/quizzes/${this.quizId}/submit`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            answers: {
                                answers: this.answers,
                                startTime: this.startTime
                            }
                        })
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                        this.showResult(data.data);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            renderQuestion() {
                const question = this.quiz.questions[this.currentQuestion];
                const container = document.getElementById('quiz-container');
                
                let optionsHtml = '';
                
                if (question.type === 'صح وخطأ') {
                    optionsHtml = `
                        <input type="radio" name="answer" value="صح" onchange="quizApp.updateAnswer(${this.currentQuestion}, 'صح')"> صح<br>
                        <input type="radio" name="answer" value="خطأ" onchange="quizApp.updateAnswer(${this.currentQuestion}, 'خطأ')"> خطأ<br>
                    `;
                } else if (question.type === 'اختر من متعدد') {
                    optionsHtml = question.options.map(option => 
                        `<input type="radio" name="answer" value="${option._id}" onchange="quizApp.updateAnswer(${this.currentQuestion}, '${option._id}')">${option.text}<br>`
                    ).join('');
                }

                container.innerHTML = `
                    <h2>${question.questionText}</h2>
                    ${optionsHtml}
                    <button onclick="quizApp.nextQuestion()">التالي</button>
                `;
            }

            nextQuestion() {
                if (this.currentQuestion < this.quiz.questions.length - 1) {
                    this.currentQuestion++;
                    this.renderQuestion();
                } else {
                    this.submitQuiz();
                }
            }

            showResult(result) {
                const container = document.getElementById('quiz-container');
                container.innerHTML = `
                    <h1>النتيجة: ${result.result.score.percentage}%</h1>
                    <p>${result.result.motivationalMessage}</p>
                    <p>الدرجة: ${result.result.grade}</p>
                `;
            }
        }

        // تشغيل التطبيق
        const quizApp = new QuizApp('YOUR_QUIZ_ID_HERE');
        quizApp.startQuiz();
    </script>
</body>
</html>
```

## 🔑 نقاط مهمة:

### 1. تنسيق البيانات المطلوب:
```json
{
  "answers": {
    "answers": [
      {
        "questionIndex": 0,
        "answer": "صح"  // أو ID الخيار للأسئلة متعددة الخيارات
      }
    ],
    "startTime": "2025-09-20T22:35:55.557Z"
  }
}
```

### 2. أنواع الإجابات:
- **صح وخطأ**: `"صح"` أو `"خطأ"`
- **اختر من متعدد**: `"507f1f77bcf86cd799439012"` (ID الخيار)

### 3. الـ Response المتوقع:
```json
{
  "success": true,
  "message": "تم إرسال الإجابات وحساب النتيجة بنجاح",
  "data": {
    "result": {
      "score": {
        "percentage": 85,
        "earnedPoints": 17,
        "totalPoints": 20
      },
      "grade": "جيد جداً",
      "timeSpent": {
        "display": "5:30"
      },
      "motivationalMessage": "👏 أحسنت! أداء جيد جداً!"
    },
    "answers": [...],  // تفاصيل كل إجابة
    "statistics": {...}  // إحصائيات شاملة
  }
}
```

### 4. معالجة الأخطاء:
- التأكد من وجود Authorization Token
- التحقق من صحة تنسيق البيانات  
- معالجة انتهاء وقت الكويز
- التعامل مع مشاكل الشبكة

هذا التوثيق يوضح بالتفصيل كيفية التعامل مع الكويزات من الـ Frontend! 🎯