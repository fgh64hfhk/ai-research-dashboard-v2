"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Book, FileText } from "lucide-react"; // 引入 Lucide Icons
import { motion } from "motion/react"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8">
      <motion.h1
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to the AI Research Platform Dashboard
      </motion.h1>

      <motion.div
        className="flex flex-col gap-4 mt-6 w-72"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Link href="/models" passHref>
          <Button size="lg" className="flex items-center gap-2" asChild>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Rocket className="w-5 h-5" />
              Enter Dashboard
            </motion.div>
          </Button>
        </Link>

        <Button
          size="lg"
          variant="outline"
          className="flex items-center gap-2"
          disabled
        >
          <Book className="w-5 h-5" />
          Technical Documentation
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="flex items-center gap-2"
          disabled
        >
          <FileText className="w-5 h-5" />
          Development Logs
        </Button>
      </motion.div>
    </div>
  );
}
