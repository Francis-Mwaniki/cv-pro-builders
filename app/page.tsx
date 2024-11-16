'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ChevronRight, Edit, Sparkles, Rocket, FileText } from 'lucide-react'

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-orange-600">CV Builder Pro</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Create Your Perfect CV
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Craft a standout CV that showcases your skills and experience. Our intuitive builder makes it easy to create a professional CV in minutes.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              Start Building Now <ChevronRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { icon: <Edit className="w-12 h-12 text-orange-500" />, title: "Easy to Use", description: "Intuitive interface for quick and effortless CV creation" },
            { icon: <Sparkles className="w-12 h-12 text-amber-500" />, title: "Customizable Sections", description: "Tailor your CV with relevant sections that highlight your unique skills" },
            { icon: <Rocket className="w-12 h-12 text-blue-500" />, title: "ATS-Friendly", description: "Ensure your CV passes Applicant Tracking Systems with our optimized formats" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-xl shadow-2xl mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your account in seconds" },
              { step: "2", title: "Fill in Your Details", description: "Add your experience, skills, and achievements" },
              { step: "3", title: "Download & Apply", description: "Get your polished CV ready for your dream job" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Create Your Standout CV?</h3>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              Get Started <FileText className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 text-center text-gray-600">
        <p>&copy; 2024 Francis Mwaniki. All rights reserved.</p>
      </footer>
    </div>
  )
}