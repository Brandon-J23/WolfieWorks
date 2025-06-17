"use client"

import type React from "react"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"

export default function Page() {
  const [currentItem, setCurrentItem] = useState({
    title: "",
    description: "",
    imageUrl: "",
    url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here...
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          type="text"
          id="title"
          value={currentItem.title}
          onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          value={currentItem.description}
          onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="url">Project URL</Label>
        <Input
          type="text"
          id="url"
          value={currentItem.url}
          onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Project Image</Label>
        <FileUploader
          onUploadComplete={(url) => setCurrentItem({ ...currentItem, imageUrl: url })}
          currentImageUrl={currentItem.imageUrl}
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

function Input({
  type,
  id,
  value,
  onChange,
}: {
  type: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  )
}

function Textarea({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  )
}

function Button({ type, children }: { type: string; children: React.ReactNode }) {
  return (
    <button
      type={type}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {children}
    </button>
  )
}
