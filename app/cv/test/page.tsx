"use client";
import CVBuilder from "@/components/workingCv";
import Layout from "@/components/layout";
import ChatInterface from "@/components/chat-interface";
// import { ClipLoader } from 'react-spinners';

export default function Home() {
  return (
    <Layout>
      <CVBuilder />
      <ChatInterface />
    </Layout>
  );
}

