import Link from 'next/link';

export const metadata = {
  title: 'Categories - Portfolio',
  description: 'Browse project categories'
};

export default async function CategoriesIndex() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
  let categories: any[] = [];
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (res.ok) categories = await res.json();
  } catch (e) {
    // ignore — render empty list
  }

  return (
    <section>
      <h2 className="text-3xl">Categories</h2>
      <p className="mt-2 text-slate-400">Browse projects by category.</p>

      <div className="mt-6">
        {categories.length === 0 ? (
          <div className="text-gray-500">No categories yet.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((c: any) => (
              <li key={c.id} className="bg-slate-800 p-4 rounded">
                <Link href={`/categories/${c.slug}`} className="text-indigo-300 text-lg">
                  {c.name}
                </Link>
                <div className="text-sm text-slate-400 mt-2">View projects in this category</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
