import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="container py-8">
      <div className="relative mb-8">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="absolute -bottom-16 left-8">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="md:w-1/3 space-y-6 w-full">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        <div className="md:w-2/3 w-full">
          <Skeleton className="h-10 w-full max-w-md mb-6 rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
