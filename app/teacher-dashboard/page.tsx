// app/teacher-dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  CheckCircle, 
  BarChart3,
  Mail,
  Building2,
  Calendar,
  Award,
  RefreshCw
} from "lucide-react";
import Navbar from '@/components/Navbar';

interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  organization: string;
  enrolledAt: string;
  completed: boolean;
  completedAt: string | null;
  progressPercentage: number;
  moduleProgress: {
    moduleTitle: string;
    completed: boolean;
    score: number | null;
    lessonsCompleted: number;
    totalLessons: number;
  }[];
}

interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  averageScore: number;
  studentProgress: StudentProgress[];
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<{ courses: CourseAnalytics[]; totalCourses: number; totalStudents: number; overallCompletionRate: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    if (status === "authenticated" && session?.user?.role !== "TEACHER") {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "TEACHER") {
      fetchAnalytics();
    }
  }, [status, session]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/teacher/analytics");
      const data = await response.json();
      if (data.success) {
        setAnalytics(data);
      } else {
        console.error("API returned error:", data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // No analytics data yet
  if (!analytics) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      </main>
    );
  }

  // No courses with students
  if (analytics.courses.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No student data available</h3>
            <p className="text-gray-500">When students enroll in courses and complete lessons, their progress will appear here.</p>
            <button
              onClick={handleRefresh}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </main>
    );
  }

  const selectedCourseData = selectedCourse 
    ? analytics.courses.find(c => c.courseId === selectedCourse)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Refresh */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Student Progress Overview
              </h1>
              <p className="text-gray-600">
                Track your students' learning progress and performance
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.totalCourses}</h3>
              <p className="text-gray-600 text-sm">Courses with Students</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</h3>
              <p className="text-gray-600 text-sm">Total Students Enrolled</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{analytics.overallCompletionRate}%</h3>
              <p className="text-gray-600 text-sm">Average Completion Rate</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.round(analytics.courses.reduce((sum, c) => sum + c.averageScore, 0) / analytics.courses.length)}%
              </h3>
              <p className="text-gray-600 text-sm">Average Quiz Score</p>
            </div>
          </div>

          {/* Course Selection */}
          {analytics.courses.length > 1 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Course</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    !selectedCourse
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Courses ({analytics.totalCourses})
                </button>
                {analytics.courses.map(course => (
                  <button
                    key={course.courseId}
                    onClick={() => setSelectedCourse(course.courseId)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      selectedCourse === course.courseId
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {course.courseTitle} ({course.totalStudents})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student List */}
          {(selectedCourse ? [selectedCourseData!] : analytics.courses).map((course) => (
            <div key={course.courseId} className="mb-8">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-orange-50 to-white rounded-t-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{course.courseTitle}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {course.totalStudents} Students
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        {course.completedStudents} Completed
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {course.completionRate}% Completion
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {course.averageScore}% Avg Score
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{course.completionRate}%</span>
                  </div>
                </div>
              </div>

              {/* Student Table */}
              <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600">Student</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600">Organization</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600">Progress</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600">Enrolled</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {course.studentProgress.map((student) => (
                      <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {student.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{student.studentName}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {student.studentEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {student.organization || '-'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${student.progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{student.progressPercentage}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {student.completed ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-yellow-600 text-sm">
                              <TrendingUp className="w-4 h-4" />
                              In Progress
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(student.enrolledAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setExpandedStudent(expandedStudent === student.studentId ? null : student.studentId)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                          >
                            {expandedStudent === student.studentId ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Expanded Student Details */}
                {expandedStudent && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Module Progress Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.studentProgress
                        .find(s => s.studentId === expandedStudent)
                        ?.moduleProgress.map((module, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                              <span className="font-medium text-gray-900 text-sm">{module.moduleTitle}</span>
                              <div className="flex items-center gap-2">
                                {module.completed && (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Done
                                  </span>
                                )}
                                {module.score !== null && (
                                  <span className="text-xs font-medium text-orange-600">
                                    Score: {module.score}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{module.lessonsCompleted}/{module.totalLessons} Lessons</span>
                              <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-500 rounded-full"
                                  style={{ width: `${(module.lessonsCompleted / module.totalLessons) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    {course.studentProgress.find(s => s.studentId === expandedStudent)?.completedAt && (
                      <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Course completed on {new Date(course.studentProgress.find(s => s.studentId === expandedStudent)!.completedAt!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}