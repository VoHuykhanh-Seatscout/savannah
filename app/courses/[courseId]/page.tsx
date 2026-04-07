// app/courses/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ChevronRight, Play, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from '@/components/Navbar';
import { COURSES, QuestionType } from '@/lib/courseData';

// Define the progress type
interface CourseProgress {
  overall: number;
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  averageScore: number;
  courseCompleted: boolean;
}

export default function CoursePage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  
  // Get course data from local file (for display)
  const course = COURSES.find(c => c.id === courseId);
  
  const [currentStep, setCurrentStep] = useState<'video' | 'quiz'>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch progress on load
  useEffect(() => {
    if (session?.user?.id && courseId) {
      fetchProgress();
    }
  }, [session, courseId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/courses/progress?courseId=${courseId}`);
      const data = await response.json();
      if (data.enrolled && data.progress) {
        setCourseProgress(data.progress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // Check enrollment on load
  useEffect(() => {
    if (session?.user?.id && courseId) {
      checkEnrollment();
    }
  }, [session, courseId]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`/api/courses/progress?courseId=${courseId}`);
      const data = await response.json();
      
      if (!data.enrolled) {
        await enrollInCourse();
      } else {
        setIsEnrolled(true);
        if (data.progress) {
          setCourseProgress(data.progress);
        }
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const enrollInCourse = async () => {
    try {
      const response = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const saveProgress = async () => {
    setIsSaving(true);
    try {
      const lessonId = `${courseId}-lesson`;
      
      const response = await fetch("/api/courses/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId,
          lessonId: lessonId,
          answers: answers,
          videoWatched: currentStep === 'quiz',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to save progress");
      }
      
      console.log("Progress saved successfully:", data);
      
      // Update local score
      if (data.lesson?.score !== undefined) {
        setScore(data.lesson.score);
      }
      
      // Refresh progress after saving
      await fetchProgress();
      
      return data;
    } catch (error) {
      console.error("Error saving progress:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (!course) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const currentQuestion = course.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === course.questions.length - 1;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      await calculateScore();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateScore = async () => {
    try {
      const result = await saveProgress();
      if (result) {
        setQuizCompleted(true);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error calculating score:", error);
    }
  };

  const handleRestartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setShowResults(false);
    setCurrentStep('video');
  };

  const handleFinish = () => {
    router.push('/');
  };

  const mcqQuestions = course.questions.filter(q => q.type !== QuestionType.TEXT);
  const totalScore = mcqQuestions.length;
  const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>

          {/* Progress Bar */}
          {courseProgress && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Course Progress</span>
                <span className="font-medium">{courseProgress.overall}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${courseProgress.overall}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{courseProgress.completedLessons}/{courseProgress.totalLessons} lessons</span>
                <span>{courseProgress.completedModules}/{courseProgress.totalModules} modules</span>
              </div>
            </div>
          )}

          {/* Course Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500">{course.questions.length} questions</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {course.questions.filter(q => q.type !== QuestionType.TEXT).length} multiple choice
              </span>
            </div>
          </div>

          {/* Rest of your component remains the same... */}
          {/* Step Indicator */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setCurrentStep('video')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                currentStep === 'video' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Video
              </div>
              {currentStep === 'video' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                />
              )}
            </button>
            <button
              onClick={() => setCurrentStep('quiz')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                currentStep === 'quiz' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Take Quiz
              </div>
              {currentStep === 'quiz' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                />
              )}
            </button>
          </div>

          {/* Video Section */}
          {currentStep === 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={course.videoUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={course.title}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3">About this course</h2>
                <p className="text-gray-600 mb-4">
                  Watch this video to learn the key concepts. After watching, test your knowledge with the quiz.
                </p>
                <button
                  onClick={() => setCurrentStep('quiz')}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Take Quiz
                </button>
              </div>
            </motion.div>
          )}

          {/* Quiz Section */}
          {currentStep === 'quiz' && !quizCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {course.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / course.questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / course.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

              <div className="space-y-3 mb-8">
                {currentQuestion.type === QuestionType.TEXT ? (
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={5}
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                  />
                ) : currentQuestion.type === QuestionType.TRUE_FALSE ? (
                  <div className="flex gap-4">
                    {['True', 'False'].map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          answers[currentQuestion.id] === option
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-200 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  currentQuestion.options?.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQuestion.id] === option
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-200 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!answers[currentQuestion.id] || isSaving}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  answers[currentQuestion.id] && !isSaving
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Results Section */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {percentage >= 70 ? (
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                <p className="text-gray-600">
                  You scored {score} out of {totalScore} ({Math.round(percentage)}%)
                </p>
                {percentage >= 70 ? (
                  <p className="text-green-600 mt-2">Great job! Progress saved to your account.</p>
                ) : percentage >= 50 ? (
                  <p className="text-yellow-600 mt-2">Good effort! Review the video and try again.</p>
                ) : (
                  <p className="text-red-600 mt-2">Watch the video again and retake the quiz.</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Back to Courses
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}