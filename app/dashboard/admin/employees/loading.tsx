export default function Loading() {
  return (
    <div className="flex h-screen w-[100vh] items-center justify-center gap-2 bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-gray-900"></div>
      <span className="ml-3 text-gray-600 text-lg">Loading Employees Page...</span>
    </div>
  );
}
