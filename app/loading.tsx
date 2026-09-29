export default function Loading() {
  return (
    <main
      id="konten-utama"
      className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-8"
    >
      <div className="skeleton h-4 w-28 rounded" />
      <div className="skeleton mt-5 h-16 max-w-2xl rounded-lg" />
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="skeleton aspect-[3/4] rounded-xl" />
        ))}
      </div>
    </main>
  );
}
