'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
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
}

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const { theme } = useTheme()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const bucket = 'blog-assets' // ✅ your real bucket name

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

          console.log('📤 Uploading to:', bucket, '→', filePath)

          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, file)

          if (uploadError) {
            console.error('❌ Upload failed:', uploadError.message)
            alert('Upload failed: ' + uploadError.message)
            return
          }

          const { data: publicData } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(filePath)

          const publicUrl = publicData?.publicUrl
          console.log('🧾 Public URL:', publicUrl)

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
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error loading post:', error)
        return
      }

      setPost(data)
      setLoading(false)
    }

    loadPost()
  }, [params.id, router])

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
      })
      .eq('id', post.id)

    if (error) {
      alert('Error saving post: ' + error.message)
      return
    }

    alert('Post saved successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded hover:bg-opacity-80"
          >
            Save Changes
          </button>
        </div>
      </div>

      {!isPreview ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={post.lang}
              onChange={(e) => setPost({ ...post, lang: e.target.value as 'en' | 'ko' })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-black"
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <div className="border rounded">
              <MDEditor
                value={post.content}
                onChange={(value) => setPost({ ...post, content: value || '' })}
                commands={[...commandList, customImageCommand]}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={post.published}
              onChange={(e) => setPost({ ...post, published: e.target.checked })}
            />
            <label htmlFor="published" className="text-sm font-medium">
              Published
            </label>
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

      {/* Hidden input for file selection */}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" />
    </div>
  )
}