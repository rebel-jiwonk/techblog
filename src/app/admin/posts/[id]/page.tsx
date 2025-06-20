'use client';

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import MDEditor, { commands as defaultCommands, ICommand } from '@uiw/react-md-editor'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  lang: 'en' | 'ko'
  published: boolean
  author_email: string
  tags: string[]
  description?: string
}

export default function Page() {
  const { id } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const bucket = 'blog-assets'

  const customImageCommand: ICommand = {
    name: 'image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': 'Insert image' },
    icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="2" width="18" height="16" rx="2" ry="2" />
          <circle cx="8.5" cy="7.5" r="1.5" />
          <path d="M21 13.8l-5-5L5 18" />
        </svg>
      ),
    execute: (state, api) => {
      if (inputRef.current) {
        inputRef.current.click()
        inputRef.current.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (!file) return

          const ext = file.name.split('.').pop()
          const filePath = `${Date.now()}.${ext}`

          const { error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, file)

          if (uploadError) {
            alert('Upload failed: ' + uploadError.message)
            return
          }

          const { data: publicData } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(filePath)

          const publicUrl = publicData?.publicUrl
          if (!publicUrl) {
            alert('Error generating public URL')
            return
          }

          const markdown = `![${file.name}](${publicUrl})`
          api.replaceSelection(markdown)
        }
      }
    },
  }

  const commandList = defaultCommands.getCommands().filter(cmd => cmd.name !== 'image')

  useEffect(() => {
    async function loadPost() {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        router.push('/admin/login')
        return
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading post:', error)
        return
      }

      setPost(data)
      setLoading(false)
    }

    loadPost()
  }, [id, router])

  if (loading) return <div className="p-4">Loading...</div>
  if (!post) return <div className="p-4">Post not found</div>

  const handleSave = async () => {
    const { error } = await supabase
      .from('posts')
      .update({
        title: post.title,
        content: post.content,
        slug: post.slug,
        lang: post.lang,
        published: post.published,
        tags: post.tags,
        author_email: post.author_email,
      })
      .eq('id', post.id)

    if (error) {
      alert('Error saving post: ' + error.message)
      return
    }

    alert('Post saved successfully!')
  }

  return (
    <div className="max-w-screen-xl w-full mx-auto px-8 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-600 hover:text-black hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-2 py-2 border text-xs border-gray-300 hover:bg-gray-50"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-2 bg-black text-xs text-white hover:bg-opacity-80"
          >
            Save Changes
          </button>
        </div>
      </div>

      {!isPreview ? (
        <div className="space-y-4">
        {/* Title + Author Email */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-1">TITLE</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1">AUTHOR EMAIL</label>
            <input
              type="email"
              value={post.author_email || ''}
              onChange={(e) => setPost({ ...post, author_email: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      
        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-1">SUMMARY</label>
          <textarea
            value={post.description || ""}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            rows={3}
          />
        </div>
      
        {/* Language + Tags + Slug */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="block text-sm font-bold mb-1">LANGUAGE</label>
            <select
              value={post.lang}
              onChange={(e) => setPost({ ...post, lang: e.target.value as 'en' | 'ko' })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
            </select>
          </div>
          <div className="w-1/3">
          <label className="block text-sm font-bold mb-1">TAGS</label>
          <div className="flex flex-wrap gap-2">
            {(post.lang === "ko"
              ? ["퍼포먼스", "솔루션", "최적화", "하드웨어", "툴", "양자화"]
              : ["Performance", "Solution", "Optimization", "Hardware", "Tools", "Quantization"]
            ).map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  setPost({
                    ...post,
                    tags: (post.tags || []).includes(tag)
                        ? post.tags.filter((t: string) => t !== tag)
                        : [...(post.tags || []), tag],
                  })
                }
                className={`px-2 py-1 text-sm border ${
                  (post.tags || []).includes(tag)
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">SLUG</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

          <div>
            <label className="block text-sm font-medium mb-1">CONTENT</label>
            <div className="border rounded overflow-hidden" style={{ height: '600px' }}>
              <MDEditor
                value={post.content}
                onChange={(value) => setPost({ ...post, content: value || '' })}
                commands={[...commandList, customImageCommand]}
                height="100%"
              />
            </div>
          </div>
        </div>
      ) : (
        <article className="prose prose-lg dark:prose-invert max-w-none prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-sm prose-pre:text-white prose-pre:rounded-md prose-pre:p-4">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ ...props }) => (
                <img
                  {...props}
                  className="rounded-md my-4 w-full max-w-full object-contain"
                  alt={props.alt || ''}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" />
    </div>
  )
}