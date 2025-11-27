import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, Users, Shield, Zap, Clock, TrendingUp, LogIn } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">FRAMS</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Attendance System</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              Face Recognition
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Attendance Made Simple
              </span>
            </h1>

           {/* Subheadline */}
            <p className="text-xl md:text-1xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your attendance tracking with cutting-edge facial recognition technology. 
              Fast, secure, and incredibly easy to use.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/student/face">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  <Camera className="w-5 h-5 mr-2" />
                  Register Your Face
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm text-slate-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">&lt;2s</div>
                <div className="text-sm text-slate-600">Recognition Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm text-slate-600">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need for seamless attendance management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Instant Recognition</CardTitle>
                <CardDescription className="text-slate-600">
                  Advanced AI recognizes faces in under 2 seconds with 99.9% accuracy
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Multi-Role Access</CardTitle>
                <CardDescription className="text-slate-600">
                  Separate dashboards for students, teachers, and administrators
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Secure & Private</CardTitle>
                <CardDescription className="text-slate-600">
                  Enterprise-grade encryption keeps your biometric data safe
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-slate-200 hover:border-pink-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Lightning Fast</CardTitle>
                <CardDescription className="text-slate-600">
                  Process hundreds of students in minutes, not hours
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Real-Time Tracking</CardTitle>
                <CardDescription className="text-slate-600">
                  Monitor attendance as it happens with live dashboards
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Detailed Analytics</CardTitle>
                <CardDescription className="text-slate-600">
                  Comprehensive reports and insights at your fingertips
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Register</h3>
              <p className="text-slate-600">
                Take a few quick photos using your webcam to register your face in the system
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Attend Class</h3>
              <p className="text-slate-600">
                Simply look at the camera when you enter class - no cards or sign-ins needed
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Track Progress</h3>
              <p className="text-slate-600">
                View your attendance records and analytics in real-time through your dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Choose Your Role
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Access the portal that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Student Card */}
            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2 text-slate-900">Student</CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Register your face and check your attendance records
                </CardDescription>
                <Link href="/student/face">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </CardHeader>
            </Card>

            {/* Teacher Card */}
            <Card className="border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2 text-slate-900">Teacher</CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Manage classes and track student attendance
                </CardDescription>
                <Link href="/teacher/classes">
                  <Button variant="outline" className="w-full border-2">
                    Teacher Portal
                  </Button>
                </Link>
              </CardHeader>
            </Card>

            {/* Admin Card */}
            <Card className="border-2 border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2 text-slate-900">Admin</CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Manage system, users, and view analytics
                </CardDescription>
                <Link href="/admin/students">
                  <Button variant="outline" className="w-full border-2">
                    Admin Panel
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Attendance?
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Join thousands of institutions already using FRAMS for seamless attendance management
            </p>
            <Link href="/student/face">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-7 text-lg shadow-2xl hover:shadow-3xl transition-all">
                <Camera className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-2 font-semibold text-white">FRAMS</p>
          <p className="text-sm">Face Recognition Attendance Management System</p>
          <p className="text-xs mt-4 text-slate-500">
            © {new Date().getFullYear()} FRAMS. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
