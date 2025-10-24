# How to Replace Form Inputs with Shadcn/UI Components

This guide shows you exactly how to upgrade your existing forms to use shadcn/ui components.

## Current Contact Form (Before)

Here's what your current contact form looks like (simplified):

```tsx
// OLD WAY - Plain HTML input
<div>
  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
    Name
  </label>
  <input
    type="text"
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-lg border border-border bg-input..."
    placeholder="Your name"
    required
  />
</div>
```

**Problems with this approach:**
- Long, repetitive className strings
- Manual styling for focus states
- Inconsistent styling across inputs
- No built-in error display
- Labels not automatically linked to inputs

---

## Upgraded Contact Form (After)

Here's the same input using shadcn/ui components:

```tsx
// NEW WAY - Shadcn/UI components
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Your name"
    required
    disabled={isSubmitting}
  />
</div>
```

**Benefits:**
- ✅ Automatic, consistent styling
- ✅ Built-in focus states and animations
- ✅ Shorter, cleaner code
- ✅ Automatic accessibility features
- ✅ Matches your theme automatically

---

## Step-by-Step: Upgrading Your Contact Form

### Step 1: Add the imports at the top

**OLD imports:**
```tsx
"use client"
import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
```

**NEW imports (add these):**
```tsx
"use client"
import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"      // ADD THIS
import { Textarea } from "@/components/ui/textarea"  // ADD THIS
import { Label } from "@/components/ui/label"      // ADD THIS
import { toast } from "sonner"                     // ADD THIS (for notifications)
```

### Step 2: Replace the Name input

**OLD (lines 74-89):**
```tsx
<div>
  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
    Name
  </label>
  <input
    type="text"
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent smooth-transition"
    placeholder="Your name"
    required
    disabled={isSubmitting}
  />
</div>
```

**NEW (much cleaner!):**
```tsx
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Your name"
    required
    disabled={isSubmitting}
  />
</div>
```

**What changed?**
- Replaced `<label>` with `<Label>` component
- Removed all the long className styling
- Replaced `<input>` with `<Input>` component
- Added `space-y-2` to the wrapper div for spacing

### Step 3: Replace the Email input

**OLD:**
```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
    Email
  </label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent smooth-transition"
    placeholder="your.email@example.com"
    required
    disabled={isSubmitting}
  />
</div>
```

**NEW:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="your.email@example.com"
    required
    disabled={isSubmitting}
  />
</div>
```

### Step 4: Replace the Subject input

**OLD:**
```tsx
<div>
  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
    Subject
  </label>
  <input
    type="text"
    id="subject"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent smooth-transition"
    placeholder="What's this about?"
    required
    disabled={isSubmitting}
  />
</div>
```

**NEW:**
```tsx
<div className="space-y-2">
  <Label htmlFor="subject">Subject</Label>
  <Input
    id="subject"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    placeholder="What's this about?"
    required
    disabled={isSubmitting}
  />
</div>
```

### Step 5: Replace the Message textarea

**OLD:**
```tsx
<div>
  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
    Message
  </label>
  <textarea
    id="message"
    name="message"
    rows={6}
    value={formData.message}
    onChange={handleChange}
    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent smooth-transition resize-none"
    placeholder="Tell me about your project or just say hello!"
    required
    disabled={isSubmitting}
  />
</div>
```

**NEW:**
```tsx
<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    name="message"
    rows={6}
    value={formData.message}
    onChange={handleChange}
    placeholder="Tell me about your project or just say hello!"
    required
    disabled={isSubmitting}
  />
</div>
```

**What changed?**
- Replaced `<textarea>` with `<Textarea>` component
- Removed all the className styling
- Shadcn's Textarea has `resize-none` built-in

### Step 6: Replace error messages with Toast notifications

**OLD (lines 140-144):**
```tsx
{submitStatus === 'error' && (
  <div className="text-red-600 text-sm">
    ❌ {errorMessage}
  </div>
)}
```

**NEW (in your handleSubmit function):**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const result = await submitContactForm(formData)

    if (!result.success) {
      throw new Error(result.error || 'Something went wrong')
    }

    // Replace setSubmitStatus('success') with toast
    toast.success('Message sent successfully! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  } catch (error) {
    // Replace setSubmitStatus('error') with toast
    const errorMsg = error instanceof Error ? error.message : 'Something went wrong'
    toast.error(errorMsg)
  } finally {
    setIsSubmitting(false)
  }
}
```

**Benefits of toast notifications:**
- ✅ Non-intrusive (appears in corner)
- ✅ Auto-dismisses after a few seconds
- ✅ User can continue interacting with page
- ✅ Looks much more professional

---

## Complete Upgraded Contact Form

Here's what your complete upgraded file would look like:

```tsx
"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { submitContactForm } from "@/app/actions/contact"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitContactForm(formData)

      if (!result.success) {
        throw new Error(result.error || 'Something went wrong')
      }

      toast.success('Message sent successfully! I\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project or just say hello!"
          required
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        <Mail className="w-5 h-5 mr-2" />
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

---

## Summary of Changes

### What to Import
```tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
```

### Pattern to Follow

**Every input follows this pattern:**

1. Wrap in a `<div className="space-y-2">` for spacing
2. Use `<Label>` instead of `<label>`
3. Use `<Input>` instead of `<input>`
4. Use `<Textarea>` instead of `<textarea>`
5. Remove all the long className strings
6. Keep your value, onChange, placeholder, required, disabled props the same

**Before:**
```tsx
<div>
  <label className="long-classes">Name</label>
  <input className="very-long-classes" />
</div>
```

**After:**
```tsx
<div className="space-y-2">
  <Label>Name</Label>
  <Input />
</div>
```

### Toast Notifications

Replace inline error messages with toast:

```tsx
// Show success
toast.success('Message sent!')

// Show error
toast.error('Something went wrong')

// Show loading → success/error
toast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load'
  }
)
```

---

## Want to Apply This?

Would you like me to:
1. **Update your contact-form.tsx file** with these changes right now?
2. **Show you how to do it yourself** step by step in your editor?
3. **Apply this pattern to other forms** in your project (assessment forms)?

Just let me know!
