import Header from "@/components/Header";

const dummy = Array.from({ length: 12 }).map((_, i) => ({ id: i, title: `Bookmark ${i + 1}` }));

export default function BookmarksPage() {
  return (
    <div>
      <Header />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummy.map((b) => (
          <div key={b.id} className="border p-4 rounded">{b.title}</div>
        ))}
      </main>
    </div>
  );
}
