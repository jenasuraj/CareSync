export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-[380px] max-w-full p-6 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse">
        
        {/* Title */}
        <div className="h-6 w-2/3 bg-neutral-700 rounded mb-6" />

        {/* Input 1 */}
        <div className="h-10 w-full bg-neutral-800 rounded mb-4" />

        {/* Input 2 */}
        <div className="h-10 w-full bg-neutral-800 rounded mb-6" />

        {/* Button */}
        <div className="h-11 w-full bg-neutral-700 rounded" />
      </div>
    </div>
  );
}
