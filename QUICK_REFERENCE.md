# Developer Quick Reference

A quick reference guide for common tasks in the Passeio Legal project.

## 🔗 File Locations

| Component | Path |
|-----------|------|
| Type Definitions | `src/types/index.ts` |
| Firebase Config | `src/lib/firebase.ts` |
| Firestore Services | `src/lib/firestore.ts` |
| Cloudinary Utils | `src/lib/cloudinary.ts` |
| General Utils | `src/lib/utils.ts` |
| Custom Hooks | `src/hooks/useApi.ts`, `src/hooks/useAuth.tsx` |
| UI Components | `src/components/ui/` |
| Admin Layout | `src/app/admin/layout.tsx` |
| API Routes | `src/app/api/[resource]/route.ts` |
| Environment Config | `.env.example`, `.env.local` |

## 📝 Common Tasks

### Creating a New API Route

**File**: `src/app/api/[resource]/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { serviceMethod } from "@/lib/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await serviceMethod.get(params.id);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await serviceMethod.update(params.id, body);
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await serviceMethod.delete(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
```

### Creating a Zod Validation Schema

**File**: `src/lib/utils.ts` (add new schema)

```typescript
export const myEntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10),
  email: z.string().email(),
  price: z.number().positive(),
  active: z.boolean(),
  items: z.array(z.string()),
});

// Usage in component
import { myEntitySchema } from "@/lib/utils";

const { data, errors } = myEntitySchema.safeParse(formData);
```

### Creating a New UI Component

**File**: `src/components/ui/NewComponent.tsx`

```typescript
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("base-classes", variant === "secondary" && "secondary-classes", className)}
      {...props}
    />
  )
);
NewComponent.displayName = "NewComponent";

export { NewComponent };
```

### Using Firestore Service

```typescript
import { tourService } from "@/lib/firestore";

// Get all active tours
const tours = await tourService.getAll(true);

// Get single tour
const tour = await tourService.get("tour-id");

// Create tour
const id = await tourService.create({
  name: "City Tour",
  price: 100,
  // ... other fields
});

// Update tour
await tourService.update("tour-id", {
  price: 150,
  active: false,
});

// Delete tour
await tourService.delete("tour-id");
```

### Using the useApi Hook

```typescript
"use client";

import { useTours, useQuery, useMutation } from "@/hooks/useApi";

export default function MyComponent() {
  // Fetch data
  const { data: tours, loading, error, refetch } = useTours(true);

  // Generic query
  const { data: customData } = useQuery("/api/custom-endpoint");

  // Mutation
  const { mutate, loading: mutating } = useMutation("/api/tours", "POST");

  const handleCreate = async () => {
    try {
      const result = await mutate({
        name: "New Tour",
        price: 100,
      });
      console.log("Created:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {tours.map((tour) => (
        <div key={tour.id}>{tour.name}</div>
      ))}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
```

### Image Upload with Cloudinary

```typescript
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { CldUploadWidget } from "next-cloudinary";

// Method 1: Programmatic upload
const handleUpload = async (file: File) => {
  try {
    const result = await uploadImageToCloudinary(file, "tours");
    console.log("Upload successful:", result.secure_url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Method 2: Using CldUploadWidget
<CldUploadWidget
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  onSuccess={(result: any) => {
    console.log("Uploaded:", result.info.secure_url);
  }}
>
  {({ open }) => (
    <button onClick={() => open()}>Upload Image</button>
  )}
</CldUploadWidget>
```

### Delete Image from Cloudinary

```typescript
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

const handleDelete = async (publicId: string) => {
  try {
    await deleteImageFromCloudinary(publicId);
    console.log("Image deleted");
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
```

### Format Price

```typescript
import { formatPrice } from "@/lib/utils";

// PT-BR currency
const formatted = formatPrice(150.50); // R$ 150,50

// Custom locale
const formatted = formatPrice(150.50, "en-US"); // $150.50
```

### Format Date

```typescript
import { formatDate, formatDatetime } from "@/lib/utils";

const date = new Date();
formatDate(date); // "17 de agosto de 2026"
formatDatetime(date); // "17/08/2026 10:30"
```

### Slugify Text

```typescript
import { slugify, generateSlug } from "@/lib/utils";

const slug = slugify("My Tour Title"); // "my-tour-title"
const slug2 = generateSlug("Passeio Legal"); // "passeio-legal"
```

### Protected Admin Route

**File**: `src/app/admin/my-page/page.tsx`

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [loading, user, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}</h1>
    </div>
  );
}
```

### Create a Form with React Hook Form

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { tourSchema } from "@/lib/utils";

export default function TourForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tourSchema),
  });

  const onSubmit = async (data) => {
    const response = await fetch("/api/tours", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Created:", result);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Tour Name</label>
        <Input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label>Price</label>
        <Input
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && <span>{errors.price.message}</span>}
      </div>

      <Button type="submit">Create Tour</Button>
    </form>
  );
}
```

### Display Toast Notifications

```typescript
import toast from "react-hot-toast";

// Success
toast.success("Tour created successfully!");

// Error
toast.error("Failed to create tour");

// Custom
toast((t) => (
  <div>
    <p>Tour saved!</p>
    <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
  </div>
));
```

## 🎨 Component Patterns

### Button Variants
```typescript
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### Card Components
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

## 🔄 Data Flow Pattern

```
Component (client)
    ↓
Form Submission
    ↓
useApi Hook / Axios
    ↓
API Route (src/app/api/...)
    ↓
Firestore Service (src/lib/firestore.ts)
    ↓
Firebase Firestore
    ↓
Response JSON
    ↓
Component Update
```

## ⚡ Performance Tips

1. **Use dynamic imports** for large components
2. **Implement pagination** for large lists
3. **Cache API responses** with React Query or SWR
4. **Optimize images** with Cloudinary transformations
5. **Use Firestore indexes** for frequent queries
6. **Lazy load** images with next/image
7. **Code split** large forms and pages

## 🔐 Security Checklist

- [ ] Validate all input server-side
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling
- [ ] Add rate limiting to APIs
- [ ] Sanitize user input
- [ ] Use HTTPS in production
- [ ] Implement CORS appropriately
- [ ] Set secure cookie flags
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📊 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript

# Production
npm run build           # Build for production
npm start              # Start production server

# Deployment
npm install -g vercel   # Install Vercel CLI
vercel                 # Deploy to Vercel
vercel env pull        # Pull environment variables
```

## 🎯 Development Workflow

1. **Create type definition** in `src/types/index.ts`
2. **Add Firestore service** in `src/lib/firestore.ts`
3. **Add validation schema** in `src/lib/utils.ts`
4. **Create API routes** in `src/app/api/`
5. **Build UI components** in `src/components/`
6. **Create page component** in `src/app/`
7. **Test locally** with dev server
8. **Deploy** to Vercel

---

**Last Updated**: 2026-08-17
**Version**: 1.0.0

For more details, see README.md, SETUP.md, and API.md
